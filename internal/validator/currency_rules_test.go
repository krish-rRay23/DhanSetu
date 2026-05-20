package validator

import "testing"

func TestIsSupportedCurrency(t *testing.T) {
	if !IsSupportedCurrency("INR") {
		t.Fatalf("expected INR to be supported")
	}
	if !IsSupportedCurrency("USD") {
		t.Fatalf("expected USD to be supported")
	}
	if IsSupportedCurrency("XYZ") {
		t.Fatalf("expected XYZ to be unsupported")
	}
}
