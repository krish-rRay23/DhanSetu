package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"errors"
)

func DecryptGCM(key, nonce, ciphertext, additionalData []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	if len(nonce) != aesgcm.NonceSize() {
		return nil, errors.New("invalid nonce size")
	}
	return aesgcm.Open(nil, nonce, ciphertext, additionalData)
}
