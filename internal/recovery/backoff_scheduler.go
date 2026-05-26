package recovery

import (
	"math"
	"time"
)

// CalculateBackoff computes exponential backoff duration based on retry attempt
func CalculateBackoff(attempt int, base time.Duration, max time.Duration) time.Duration {
	if attempt <= 0 {
		return base
	}
	multiplier := math.Pow(2, float64(attempt))
	dur := time.Duration(multiplier) * base
	if dur > max {
		return max
	}
	return dur
}
