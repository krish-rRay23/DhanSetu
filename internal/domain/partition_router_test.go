package domain

import "testing"

func TestGetPartitionShard(t *testing.T) {
	s1 := GetPartitionShard("merch_abc", 8)
	s2 := GetPartitionShard("merch_abc", 8)
	if s1 != s2 {
		t.Fatalf("expected deterministic shard for same merchant")
	}
	if s1 < 0 || s1 >= 8 {
		t.Fatalf("shard index out of bounds: %d", s1)
	}
}
