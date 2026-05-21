package observability

import (
	"strings"
	"testing"
)

func TestFormatIntentLog(t *testing.T) {
	log := FormatIntentLog("int_1001", "user_987654321", "SETTLED")
	if !strings.Contains(log, "intent_id=int_1001") {
		t.Fatalf("expected intent_id in log")
	}
	if strings.Contains(log, "user_987654321") {
		t.Fatalf("expected payer ID to be masked")
	}
	if !strings.Contains(log, "us***21") {
		t.Fatalf("expected masked pattern in log")
	}
}
