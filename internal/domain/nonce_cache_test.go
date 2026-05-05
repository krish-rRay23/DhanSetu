package domain

import "testing"

func TestNonceCache(t *testing.T) {
	cache := NewNonceCache()
	if !cache.Add("nonce-1", 1000) {
		t.Errorf("Expected first add to succeed")
	}
	if cache.Add("nonce-1", 1000) {
		t.Errorf("Expected duplicate add to fail")
	}
	if !cache.Exists("nonce-1") {
		t.Errorf("Expected nonce to exist")
	}
}
