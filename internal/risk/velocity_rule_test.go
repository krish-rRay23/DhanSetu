package risk

import "testing"

func TestCheckOfflineVelocity(t *testing.T) {
	if !CheckOfflineVelocity(5, 10) {
		t.Fatalf("expected 5 <= 10 to pass")
	}
	if CheckOfflineVelocity(11, 10) {
		t.Fatalf("expected 11 <= 10 to fail")
	}
}
