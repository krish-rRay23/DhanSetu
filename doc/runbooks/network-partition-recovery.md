# Network Partition Recovery Runbook

## Scope
When cellular connectivity drops in a regional retail cluster, offline intent queues accumulate in merchant edge relays.

## Ingestion Procedure upon Uplink Restoration
1. Edge relays detect internet connectivity via gateway ping.
2. Ingestion API accepts buffered intent batches in streaming mode.
3. Dedup filter rejects replayed intent nonces via Redis bloom filter.
4. Core settlement engine processes double-entry ledger transactions concurrently across partition shards.
5. Emits settlement confirmation SMS / Push back to merchant terminal.
