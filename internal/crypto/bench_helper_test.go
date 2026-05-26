package crypto

import "testing"

func TestBenchHelper(t *testing.T) {
	res := CalculateThroughput(1000, 500.0)
	if res.OpsPerSec != 2000.0 {
		t.Errorf("Expected 2000 ops/sec, got %f", res.OpsPerSec)
	}
}
