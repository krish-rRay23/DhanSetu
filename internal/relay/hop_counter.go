package relay

// DecrementHop decreases hop TTL and indicates whether the packet may continue forwarding
func DecrementHop(currentHop, maxHops int) (int, bool) {
	if currentHop >= maxHops {
		return currentHop, false // Hop limit reached
	}
	return currentHop + 1, true
}
