package settlement

import "testing"

func TestValidateDoubleEntry(t *testing.T) {
	if !ValidateDoubleEntry(10000, 10000) {
		t.Fatalf("expected equal debit and credit to validate")
	}
	if ValidateDoubleEntry(10000, 9999) {
		t.Fatalf("expected unequal debit and credit to fail")
	}
	if ValidateDoubleEntry(0, 0) {
		t.Fatalf("expected zero amounts to fail")
	}
}
