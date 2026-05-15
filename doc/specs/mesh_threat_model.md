# Mesh Proximity Relay Threat Model

## Threat Vectors & Mitigations
1. **Replay Attacks**: A rogue peer relays the same intent envelope multiple times.
   - *Mitigation*: Deterministic nonce deduplication in settlement ledger.
2. **Traffic Flooding / Amplification**: Endless relay looping across peer mesh.
   - *Mitigation*: Strict hop-count decrement (`MaxHops = 5`).
3. **Payload Tampering**: Intermediate relay modifies payment amount or recipient.
   - *Mitigation*: Authenticated ciphertext (AES-256-GCM / Poly1305 AEAD).
