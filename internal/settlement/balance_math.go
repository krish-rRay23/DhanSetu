package settlement

// ValidateDoubleEntry verifies that sum of debits equals sum of credits
func ValidateDoubleEntry(debits, credits int64) bool {
	return debits > 0 && credits > 0 && debits == credits
}
