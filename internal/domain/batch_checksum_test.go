package domain

import "testing"

func TestBatchChecksum(t *testing.T) {
	h1 := ComputeBatchChecksum([]string{"A", "B"})
	h2 := ComputeBatchChecksum([]string{"A", "B"})
	if h1 != h2 {
		t.Errorf("Expected deterministic checksum")
	}
}
