package domain

import "testing"

func TestGeofence(t *testing.T) {
	dist := CalculateDistanceMeters(12.9716, 77.5946, 12.9716, 77.5946)
	if dist != 0.0 {
		t.Errorf("Expected 0 distance for identical coords, got %f", dist)
	}
}
