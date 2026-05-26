package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"testing"
)

func TestGCMCipher(t *testing.T) {
	key := make([]byte, 32)
	nonce := make([]byte, 12)
	plaintext := []byte("Offline payment intent test")

	block, _ := aes.NewCipher(key)
	aesgcm, _ := cipher.NewGCM(block)
	ciphertext := aesgcm.Seal(nil, nonce, plaintext, nil)

	decrypted, err := DecryptGCM(key, nonce, ciphertext, nil)
	if err != nil || string(decrypted) != string(plaintext) {
		t.Errorf("Decryption failed: %v", err)
	}
}
