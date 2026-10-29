"""Run directly with the packet's bound Python -I -S; no native client required."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("native_trust_format", Path(__file__).with_name("native_trust_format.py"))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class TrustFormatTests(unittest.TestCase):
    def test_canonical_encoding(self):
        for value in ["sha256:" + "0" * 64, "sha256:" + "a1" * 32]:
            with self.subTest(value=value):
                self.assertTrue(module.valid_native_trust_hash(value))

    def test_reject_other_encodings_and_types(self):
        values = [None, True, 71, [], {}, b"sha256:" + b"a" * 64,
                  "", "a" * 64, "sha256:" + "a" * 63,
                  "sha256:" + "a" * 65, "SHA256:" + "a" * 64,
                  "sha256:" + "A" * 64, "sha512:" + "a" * 64,
                  "sha256:" + "g" * 64, "sha256:" + "ａ" * 64,
                  "sha256:" + "a" * 64 + "\n", " sha256:" + "a" * 64,
                  "sha256:" + "a" * 63 + "\x00"]
        for value in values:
            with self.subTest(value=repr(value)):
                self.assertFalse(module.valid_native_trust_hash(value))


if __name__ == "__main__":
    unittest.main()
