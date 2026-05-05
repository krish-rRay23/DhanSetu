# Replay Prevention Threat Model

Offline intents carry a client-generated UUIDv4 nonce and a strictly bounded monotonic counter.
Terminals reject duplicate nonces across the 24-hour settlement window.
