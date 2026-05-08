package crypto

import "crypto/subtle"

// SecureCompare performs a constant-time comparison of two byte slices to mitigate timing attacks
func SecureCompare(a, b []byte) bool {
	return subtle.ConstantTimeCompare(a, b) == 1
}
