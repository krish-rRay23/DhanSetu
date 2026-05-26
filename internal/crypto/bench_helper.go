package crypto

type CryptoBenchResult struct {
	OperationsCount int
	TimeElapsedMs   float64
	OpsPerSec       float64
}

func CalculateThroughput(ops int, timeMs float64) CryptoBenchResult {
	opsPerSec := (float64(ops) / timeMs) * 1000.0
	return CryptoBenchResult{
		OperationsCount: ops,
		TimeElapsedMs:   timeMs,
		OpsPerSec:       opsPerSec,
	}
}
