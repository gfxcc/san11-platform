import unittest
from unittest.mock import patch

from .db_adaptor import PostgresAdaptor, FieldTrait, ListOptions


class TestPostgresAdaptor(unittest.TestCase):
    def setUp(self) -> None:
        self.adaptor = PostgresAdaptor({
            'f1': FieldTrait('f1', False, int),
            'f2': FieldTrait('f2', True, str),
            'f3': FieldTrait('f3', False, str),
            'f4': FieldTrait('f4', False, int),
        })
        return super().setUp()

    def test_gen_order_by(self):
        statement1 = self.adaptor.gen_order_by(ListOptions(None, 1, 1, 'f1'))
        statement2 = self.adaptor.gen_order_by(ListOptions(None, 1, 1, 'f1 DESC, f3'))

        self.assertEqual(statement1, "ORDER BY (data->>'f1')::int")
        self.assertEqual(statement2, "ORDER BY (data->>'f1')::int DESC, data->>'f3'")

    @patch('handler.model.base.common.list_options.db_adaptor.gen_random_str')
    def test_gen_where_all_comp_ops(self, mock_gen_random_str):
        mock_gen_random_str.side_effect = ['suffix_1', 'suffix_2']

        s1, p1 = self.adaptor.gen_where(ListOptions(None, 1, 1, '', 'f1 = 123'))
        self.assertEqual(s1, "WHERE (data->>'f1')::int = %(f1_suffix_1)s")
        self.assertEqual(p1, {'f1_suffix_1': 123})

        s2, p2 = self.adaptor.gen_where(ListOptions(None, 1, 1, '', 'f2 : 123'))
        self.assertEqual(s2, "WHERE (data->'f2')::jsonb ? %(f2_suffix_2)s")
        self.assertEqual(p2, {'f2_suffix_2': 123})

    @patch('handler.model.base.common.list_options.db_adaptor.gen_random_str')
    def test_gen_where_complex(self, mock_gen_random_str):
        mock_gen_random_str.side_effect = ['suffix_1', 'suffix_2', 'suffix_3', 'suffix_4']
        s, p = self.adaptor.gen_where(ListOptions(None, 1, 1, '', 'f1 >= 123 OR (f2 : 456 AND f3 = "OK") AND f4 > 1'))

        self.assertEqual(s, "WHERE ((data->>'f1')::int >= %(f1_suffix_1)s) OR (((data->'f2')::jsonb ? %(f2_suffix_2)s)"
                         " AND (data->>'f3' = %(f3_suffix_3)s)) AND ((data->>'f4')::int > %(f4_suffix_4)s)")
        self.assertEqual(p, {
            'f1_suffix_1': 123,
            'f2_suffix_2': 456,
            'f3_suffix_3': 'OK',
            'f4_suffix_4': 1,
        })

    @patch('handler.model.base.common.list_options.db_adaptor.gen_random_str')
    def test_gen_where_fuzzy_match(self, mock_gen_random_str):
        mock_gen_random_str.side_effect = ['suffix_1']
        s, p = self.adaptor.gen_where(ListOptions(None, 1, 1, '', 'f3 = "*test*"'))

        self.assertEqual(s, "WHERE data->>'f3' LIKE %(f3_suffix_1)s")
        self.assertEqual(p, {
            'f3_suffix_1': '%test%',
        })

    @patch('handler.model.base.common.list_options.db_adaptor.gen_random_str')
    def test_gen_where_contains_parent(self, mock_gen_random_str):
        mock_gen_random_str.side_effect = ['suffix_1']
        s, p = self.adaptor.gen_where(ListOptions('abc', 1, 1, '', 'f3 = "*test*"'))

        self.assertEqual(s, "WHERE parent = %(parent)s AND data->>'f3' LIKE %(f3_suffix_1)s")
        self.assertEqual(p, {
            'f3_suffix_1': '%test%',
            'parent': 'abc',
        })
