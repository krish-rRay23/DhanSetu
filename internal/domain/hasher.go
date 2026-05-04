package domain

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

// ComputeIntentHash computes a canonical SHA-256 fingerprint for an intent payload
func ComputeIntentHash(payerID, payeeID string, amount int64, nonce string) string {
	raw := fmt.Sprintf("%s:%s:%d:%s", payerID, payeeID, amount, nonce)
	h := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(h[:])
}
