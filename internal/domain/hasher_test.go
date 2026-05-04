package domain

import "testing"

func TestComputeIntentHash(t *testing.T) {
	h1 := ComputeIntentHash("user_A", "user_B", 50000, "nonce_1")
	h2 := ComputeIntentHash("user_A", "user_B", 50000, "nonce_1")
	h3 := ComputeIntentHash("user_A", "user_B", 50000, "nonce_2")

	if h1 != h2 {
		t.Fatalf("expected identical hashes, got %s and %s", h1, h2)
	}
	if h1 == h3 {
		t.Fatalf("expected different hashes for different nonces")
	}
}
