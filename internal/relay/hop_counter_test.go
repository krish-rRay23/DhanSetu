package relay

import "testing"

func TestDecrementHop(t *testing.T) {
	next, ok := DecrementHop(2, 5)
	if !ok || next != 3 {
		t.Fatalf("expected hop to advance to 3, got %d, %v", next, ok)
	}

	nextMax, okMax := DecrementHop(5, 5)
	if okMax {
		t.Fatalf("expected forwarding to be rejected at max hops, got %d", nextMax)
	}
}
