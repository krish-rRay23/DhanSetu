package token

import (
	"testing"
	"time"
)

func TestIsTokenValidWindow(t *testing.T) {
	now := time.Now()
	issued := now.Add(-10 * time.Minute)
	expires := now.Add(1 * time.Hour)

	if !IsTokenValidWindow(issued, expires, now) {
		t.Fatalf("expected token to be valid within window")
	}

	// Expired
	if IsTokenValidWindow(issued, now.Add(-1*time.Minute), now) {
		t.Fatalf("expected expired token to be invalid")
	}

	// Future dated
	if IsTokenValidWindow(now.Add(5*time.Minute), expires, now) {
		t.Fatalf("expected future token to be invalid")
	}
}
