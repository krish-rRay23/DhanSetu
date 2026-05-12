package domain

type VelocityCounter struct {
	limitPerWindow int
	currentCount   int
}

func NewVelocityCounter(limit int) *VelocityCounter {
	return &VelocityCounter{limitPerWindow: limit}
}

func (v *VelocityCounter) RecordTransaction() bool {
	if v.currentCount >= v.limitPerWindow {
		return false
	}
	v.currentCount++
	return true
}

func (v *VelocityCounter) Reset() {
	v.currentCount = 0
}
