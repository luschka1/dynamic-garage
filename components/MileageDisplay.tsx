'use client'

import { useMileageUnit, MI_TO_KM } from './MileageToggle'

interface Props {
  value: number
  /** If true, omit the unit suffix (useful when you render the unit separately) */
  noUnit?: boolean
}

export default function MileageDisplay({ value, noUnit }: Props) {
  const unit = useMileageUnit()
  const converted = unit === 'km' ? Math.round(value * MI_TO_KM) : value
  const label = noUnit ? '' : ` ${unit}`
  return <>{converted.toLocaleString()}{label}</>
}
