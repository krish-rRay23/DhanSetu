# Offline Intent Store & Forward Lifecycle

```
[Offline Payer App]
        │
        │ 1. Signs ECIES Intent Envelope (Bluetooth / NFC / QR)
        ▼
[Merchant / Peer Proximity Relay]
        │
        │ 2. Stores Envelope in local Outbox
        │ 3. Uplinks when 4G / Wi-Fi restored
        ▼
[OfflinePay Cloud Ingest API]
        │
        │ 4. Verifies Signature & Nonce Deduplication
        ▼
[Settlement Authority Ledger]
        │
        │ 5. Executes Double-Entry Settle (Debit Payer, Credit Payee)
        ▼
[Confirmed Settlement Notice]
```
