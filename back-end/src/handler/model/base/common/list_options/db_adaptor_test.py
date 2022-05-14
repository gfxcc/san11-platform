import unittest

from src.handler.model.base.common.list_options.parser import (Comp_Op,
                                                               OrderOptions)

from .db_adaptor import *


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

    def test_gen_where_all_comp_ops(self):
        s1, p1 = self.adaptor.gen_where(ListOptions(None, 1, 1, '', 'f1 = 123'))
        self.assertEqual(s1, "WHERE (data->>'f1')::int = %(f1)s")
        self.assertEqual(p1, {'f1': 123})

        s2, p2 = self.adaptor.gen_where(ListOptions(None, 1, 1, '', 'f2 : 123'))
        self.assertEqual(s2, "WHERE (data->'f2')::jsonb ? %(f2)s")
        self.assertEqual(p2, {'f2': 123})

    def test_gen_where_complex(self):
        s, p = self.adaptor.gen_where(ListOptions(None, 1, 1, '', 'f1 >= 123 OR (f2 : 456 AND f3 = "OK") AND f4 > 1'))

        self.assertEqual(s, "WHERE ((data->>'f1')::int >= %(f1)s) OR (((data->'f2')::jsonb ? %(f2)s) AND (data->>'f3' = %(f3)s)) AND ((data->>'f4')::int > %(f4)s)")
        self.assertEqual(p, {
            'f1': 123,
            'f2': 456,
            'f3': 'OK',
            'f4': 1,
        })

    def test_gen_where_fuzzy_match(self):
        s, p = self.adaptor.gen_where(ListOptions(None, 1, 1, '', 'f3 = "*test*"'))

        self.assertEqual(s, "WHERE data->>'f3' LIKE %(f3)s")
        self.assertEqual(p, {
            'f3': '%test%',
        })

    def test_gen_where_contains_parent(self):
        s, p = self.adaptor.gen_where(ListOptions('abc', 1, 1, '', 'f3 = "*test*"'))

        self.assertEqual(s, "WHERE parent = %(parent)s AND data->>'f3' LIKE %(f3)s")
        self.assertEqual(p, {
            'f3': '%test%',
            'parent': 'abc',
        })
