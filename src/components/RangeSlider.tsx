import { useState, useEffect } from 'react'

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
  const [localMin, setLocalMin] = useState(minValue)
  const [localMax, setLocalMax] = useState(maxValue)

  useEffect(() => {
    setLocalMin(minValue)
    setLocalMax(maxValue)
  }, [minValue, maxValue])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value)
    if (newMin <= localMax) {
      setLocalMin(newMin)
      onMinChange(newMin)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value)
    if (newMax >= localMin) {
      setLocalMax(newMax)
      onMaxChange(newMax)
    }
  }

  // Calculate percentages for visual feedback
  const minPercent = ((localMin - min) / (max - min)) * 100
  const maxPercent = ((localMax - min) / (max - min)) * 100

  return (
    <div className="space-y-4">
      <div className="relative pt-2">
        {/* Track background */}
        <div className="absolute h-1 w-full bg-gray-200 rounded top-1/2 transform -translate-y-1/2" />

        {/* Active range highlight */}
        <div
          className="absolute h-1 bg-gray-900 rounded top-1/2 transform -translate-y-1/2"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer pointer-events-none"
          style={{
            zIndex: localMin > max - (max - min) / 2 ? 5 : 3,
          }}
        />

        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer pointer-events-none"
          style={{
            zIndex: 4,
          }}
        />
      </div>

      {/* Display values */}
      <div className="flex justify-between text-sm font-medium text-gray-900">
        <span>${localMin}</span>
        <span>${localMax}</span>
      </div>

      {/* Input fields for manual entry */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Min</label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => {
              const value = Math.max(min, Math.min(Number(e.target.value), localMax))
              setLocalMin(value)
              onMinChange(value)
            }}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            min={min}
            max={localMax}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Max</label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => {
              const value = Math.min(max, Math.max(Number(e.target.value), localMin))
              setLocalMax(value)
              onMaxChange(value)
            }}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            min={localMin}
            max={max}
          />
        </div>
      </div>
    </div>
  )
}
