interface RangeSliderProps {
  min: number
  max: number
  step?: number
  minValue: number
  maxValue: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
}

export function RangeSlider({
  min,
  max,
  step = 10,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: RangeSliderProps) {
  const currentMin = Math.max(min, Math.min(minValue, maxValue))
  const currentMax = Math.min(max, Math.max(maxValue, currentMin))

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMin = Math.min(Number(e.target.value), currentMax)
    onMinChange(nextMin)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMax = Math.max(Number(e.target.value), currentMin)
    onMaxChange(nextMax)
  }

  const minPercent = ((currentMin - min) / (max - min)) * 100
  const maxPercent = ((currentMax - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="range-slider relative h-8">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-gray-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-gray-900"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMin}
          onChange={handleMinChange}
          className="absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent"
          style={{
            zIndex: currentMin >= max - (max - min) / 3 ? 5 : 3,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMax}
          onChange={handleMaxChange}
          className="absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex justify-between text-sm font-medium text-gray-900">
        <span>Min: ${currentMin}</span>
        <span>Max: ${currentMax}</span>
      </div>
    </div>
  )
}
