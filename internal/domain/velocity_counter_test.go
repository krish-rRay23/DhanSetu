package domain

import "testing"

func TestVelocityCounter(t *testing.T) {
	vc := NewVelocityCounter(2)
	if !vc.RecordTransaction() {
		t.Errorf("First tx should succeed")
	}
	if !vc.RecordTransaction() {
		t.Errorf("Second tx should succeed")
	}
	if vc.RecordTransaction() {
		t.Errorf("Third tx should exceed limit")
	}
}
