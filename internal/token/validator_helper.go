package token

import "time"

// IsTokenValidWindow checks if the token timestamp falls within the allowed offline drift window
func IsTokenValidWindow(issuedAt, expiresAt, evaluatedAt time.Time) bool {
	if issuedAt.After(evaluatedAt) {
		return false // Future-dated token
	}
	if evaluatedAt.After(expiresAt) {
		return false // Expired token
	}
	return true
}
