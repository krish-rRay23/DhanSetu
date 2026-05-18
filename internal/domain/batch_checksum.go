package domain

import (
	"crypto/sha256"
	"encoding/hex"
)

func ComputeBatchChecksum(intents []string) string {
	hasher := sha256.New()
	for _, id := range intents {
		hasher.Write([]byte(id))
	}
	return hex.EncodeToString(hasher.Sum(nil))
}
