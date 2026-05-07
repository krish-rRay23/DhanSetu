# Offline Intent Envelope Specification

## Overview
OfflinePay uses ECIES (Elliptic Curve Integrated Encryption Scheme) on Curve25519 / NIST P-256 for end-to-end confidential intent transmission.

## Binary Structure
1. `Version` (1 byte) - Protocol version identifier (`0x01`).
2. `EphemeralPublicKey` (32 or 65 bytes) - Ephemeral sender curve point.
3. `Nonce` (12 bytes) - AES-GCM 96-bit initialization vector.
4. `Ciphertext` (variable) - Encrypted JSON intent payload.
5. `AuthTag` (16 bytes) - Poly1305 / GCM authentication tag.

## Relay Guarantee
Relay nodes forward the raw bytes unchanged; only the settlement bank possesses the recipient private key to decrypt and verify the balance reservation.
