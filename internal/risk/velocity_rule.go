package risk

// CheckOfflineVelocity verifies whether an offline payer has exceeded maximum permitted offline velocity
func CheckOfflineVelocity(currentCount, maxAllowed int) bool {
	if maxAllowed <= 0 {
		maxAllowed = 10 // Safe default
	}
	return currentCount <= maxAllowed
}
