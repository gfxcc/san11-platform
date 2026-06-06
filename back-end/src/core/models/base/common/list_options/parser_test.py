import unittest

from .parser import *


class TestFilterItem(unittest.TestCase):
    def test_from_str_double_quote_is_supported(self):
        expr = 'name = "abc"'

        item = FilterItem.from_str(expr)

        self.assertEqual(item.field_name, 'name')
        self.assertEqual(item.comp_op, Comp_Op.EQ)
        self.assertEqual(item.value, 'abc')

    def test_from_str_comp_op_eq_is_supported(self):
        expr = 'state = 987'

        item = FilterItem.from_str(expr)

        self.assertEqual(item.field_name, 'state')
        self.assertEqual(item.comp_op, Comp_Op.EQ)
        self.assertEqual(item.value, 987)

    def test_from_str_logic_op_is_invalid(self):
        expr1 = 'state = 1 AND'
        expr2 = 'state = 1 OR'

        self.assertRaises(ValueError, FilterItem.from_str, expr1)
        self.assertRaises(ValueError, FilterItem.from_str, expr2)


class TestFilterExpr(unittest.TestCase):
    def test_from_str_single_item(self):
        expr_str = 'tags : "123"'

        expr = FilterExpr.from_str(expr_str)

        self.assertEqual(expr.logic_op, None)
        self.assertEqual(expr.value, FilterItem('tags', Comp_Op.HAS, "123"))

    def test_from_str_multiple_items(self):
        expr_str = 'state = 123 OR name != 456 AND type = "OK"'

        expr = FilterExpr.from_str(expr_str)

        self.assertEqual(expr.logic_op, None)
        self.assertIsInstance(expr.value, List)
        self.assertListEqual(expr.value, [
            FilterExpr(None, FilterItem('state', Comp_Op.EQ, 123)),
            FilterExpr(Logic_Op.OR, FilterItem('name', Comp_Op.NOT_EQ, 456)),
            FilterExpr(Logic_Op.AND, FilterItem('type', Comp_Op.EQ, 'OK')),
        ])

    def test_from_str_parentheses_are_handled(self):
        expr_str = 'state = 123 OR (name != 456 AND type = "OK") AND level > 1'

        expr = FilterExpr.from_str(expr_str)

        self.assertEqual(expr.logic_op, None)
        self.assertIsInstance(expr.value, List)
        self.assertListEqual(expr.value, [
            FilterExpr(None, FilterItem('state', Comp_Op.EQ, 123)),
            FilterExpr(Logic_Op.OR, [
                FilterExpr(None, FilterItem('name', Comp_Op.NOT_EQ, 456)),
                FilterExpr(Logic_Op.AND, FilterItem(
                    'type', Comp_Op.EQ, 'OK')),
            ]),
            FilterExpr(Logic_Op.AND, FilterItem('level', Comp_Op.GREATER, 1)),
        ])

    def test_from_str_complicated_expr_with_nested_parentheses(self):
        expr_str = 'state = 123 OR (name != 456 AND (type = "OK" OR state = 5)) AND level > 1'

        expr = FilterExpr.from_str(expr_str)

        self.assertEqual(expr.logic_op, None)
        self.assertIsInstance(expr.value, List)
        self.assertListEqual(expr.value, [
            FilterExpr(None, FilterItem('state', Comp_Op.EQ, 123)),
            FilterExpr(Logic_Op.OR, [
                FilterExpr(None, FilterItem('name', Comp_Op.NOT_EQ, 456)),
                FilterExpr(Logic_Op.AND, [
                    FilterExpr(None, FilterItem('type', Comp_Op.EQ, 'OK')),
                    FilterExpr(Logic_Op.OR, FilterItem(
                        'state', Comp_Op.EQ, 5)),
                ]),
            ]),
            FilterExpr(Logic_Op.AND, FilterItem('level', Comp_Op.GREATER, 1)),
        ])
