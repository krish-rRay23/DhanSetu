package recovery

import (
	"testing"
	"time"
)

func TestCalculateBackoff(t *testing.T) {
	base := 1 * time.Second
	max := 10 * time.Second

	b0 := CalculateBackoff(0, base, max)
	if b0 != 1*time.Second {
		t.Fatalf("expected 1s for attempt 0, got %v", b0)
	}

	b2 := CalculateBackoff(2, base, max)
	if b2 != 4*time.Second {
		t.Fatalf("expected 4s for attempt 2, got %v", b2)
	}

	b10 := CalculateBackoff(10, base, max)
	if b10 != max {
		t.Fatalf("expected cap at 10s, got %v", b10)
	}
}
