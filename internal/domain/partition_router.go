package domain

import (
	"hash/fnv"
)

// GetPartitionShard returns the deterministic shard index for a given merchant ID
func GetPartitionShard(merchantID string, numShards int) int {
	if numShards <= 0 {
		return 0
	}
	h := fnv.New32a()
	h.Write([]byte(merchantID))
	return int(h.Sum32() % uint32(numShards))
}
