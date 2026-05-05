package domain

import "sync"

type NonceCache struct {
	mu     sync.RWMutex
	nonces map[string]int64
}

func NewNonceCache() *NonceCache {
	return &NonceCache{
		nonces: make(map[string]int64),
	}
}

func (c *NonceCache) Add(nonce string, timestamp int64) bool {
	c.mu.Lock()
	defer c.mu.Unlock()
	if _, exists := c.nonces[nonce]; exists {
		return false
	}
	c.nonces[nonce] = timestamp
	return true
}

func (c *NonceCache) Exists(nonce string) bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	_, exists := c.nonces[nonce]
	return exists
}
