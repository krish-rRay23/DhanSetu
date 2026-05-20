package validator

var supportedCurrencies = map[string]int{
	"INR": 2, // 1 INR = 100 paise
	"USD": 2, // 1 USD = 100 cents
	"EUR": 2, // 1 EUR = 100 cents
}

// IsSupportedCurrency returns true if the currency code is recognized
func IsSupportedCurrency(code string) bool {
	_, exists := supportedCurrencies[code]
	return exists
}
