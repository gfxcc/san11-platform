import pathlib
import re
import unittest


HANDLER_ROOT = pathlib.Path(__file__).resolve().parent / 'handlers'
DIRECT_MODEL_PERSISTENCE_PATTERN = re.compile(
    r'Model[A-Za-z0-9_]+\.(from_name|list|find)\(')


class RepositoryBoundaryTest(unittest.TestCase):
    def test_handler_layer_does_not_call_model_persistence_directly(self):
        offenders = []
        for path in HANDLER_ROOT.rglob('*.py'):
            if path.name.endswith('_test.py'):
                continue
            text = path.read_text()
            for match in DIRECT_MODEL_PERSISTENCE_PATTERN.finditer(text):
                offenders.append(f'{path.relative_to(HANDLER_ROOT)}:{match.start()}')

        self.assertEqual([], offenders)


if __name__ == '__main__':
    unittest.main()
