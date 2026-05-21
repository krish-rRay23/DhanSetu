package observability

import "fmt"

// FormatIntentLog constructs a sanitized operational log message for intent forwarding
func FormatIntentLog(intentID, payerID, status string) string {
	maskedPayer := "[MASKED]"
	if len(payerID) > 4 {
		maskedPayer = payerID[:2] + "***" + payerID[len(payerID)-2:]
	}
	return fmt.Sprintf("intent_id=%s payer=%s status=%s", intentID, maskedPayer, status)
}
