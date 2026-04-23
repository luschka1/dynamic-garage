export type Currency = 'USD' | 'CAD'

export const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
]

/**
 * Format a dollar amount with the vehicle's currency.
 * USD:  $1,234.56
 * CAD:  $1,234.56 CAD
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'USD',
  decimals = true,
): string {
  if (amount == null) return '—'
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  })
  return currency === 'CAD' ? `$${formatted} CAD` : `$${formatted}`
}

/** Same but no decimal places — for large hero numbers */
export function fmtC(amount: number | null | undefined, currency: string = 'USD'): string {
  return formatCurrency(amount, currency, false)
}
