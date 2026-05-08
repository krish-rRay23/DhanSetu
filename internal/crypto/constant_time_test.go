package crypto

import "testing"

func TestSecureCompare(t *testing.T) {
	tag1 := []byte("f6e8d2c1b0a9")
	tag2 := []byte("f6e8d2c1b0a9")
	tag3 := []byte("f6e8d2c1b0a0")

	if !SecureCompare(tag1, tag2) {
		t.Fatalf("expected tags to match")
	}
	if SecureCompare(tag1, tag3) {
		t.Fatalf("expected tags to differ")
	}
}
