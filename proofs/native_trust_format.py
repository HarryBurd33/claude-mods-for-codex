"""Offline campaign preservation format check; never a native authorization decision."""


def valid_native_trust_hash(value):
    """Accept the canonical CLI trust-state encoding, without treating it as trust."""
    return (isinstance(value, str) and len(value) == 71
            and value.startswith("sha256:")
            and all(char in "0123456789abcdef" for char in value[7:]))
