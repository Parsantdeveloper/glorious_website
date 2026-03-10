import type React from "react"

interface SpotlightProps {
  className?: string
  size?: number
  position?: {
    x: number
    y: number
  }
}

export const Spotlight: React.FC<SpotlightProps> = ({
  className = "from-blue-500 via-blue-400 to-blue-300",
  size = 300,
  position = { x: 0, y: 0 },
}) => {
  return (
    <div
      className={`absolute pointer-events-none blur-3xl opacity-30 bg-gradient-to-r ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  )
}
