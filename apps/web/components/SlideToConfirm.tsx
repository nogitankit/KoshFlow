"use client"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Loader2, ArrowRight, Check } from "lucide-react"

interface SlideToConfirmProps {
  onConfirm: () => void
  isProcessing: boolean
  isSuccess: boolean
}

export default function SlideToConfirm({ onConfirm, isProcessing, isSuccess }: SlideToConfirmProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [maxDistance, setMaxDistance] = useState(0)
  const startX = useRef(0)

  // Calculate the maximum sliding distance
  const updateMaxDistance = () => {
    if (trackRef.current && knobRef.current) {
      const trackWidth = trackRef.current.clientWidth
      const knobWidth = knobRef.current.clientWidth
      // Padding of 4px on each side of the track
      setMaxDistance(trackWidth - knobWidth - 8)
    }
  }

  useEffect(() => {
    updateMaxDistance()
    window.addEventListener("resize", updateMaxDistance)
    return () => window.removeEventListener("resize", updateMaxDistance)
  }, [isProcessing, isSuccess])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isProcessing || isSuccess) return
    setIsDragging(true)
    startX.current = e.clientX - position
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const currentX = e.clientX - startX.current
    const newPos = Math.max(0, Math.min(currentX, maxDistance))
    setPosition(newPos)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)

    // Trigger if dragged over 88%
    const threshold = maxDistance * 0.88
    if (position >= threshold) {
      // Snap to full right
      setPosition(maxDistance)
      onConfirm()
    } else {
      // Snap back to left
      setPosition(0)
    }
  }

  const progressPercentage = maxDistance > 0 ? (position / maxDistance) * 100 : 0

  return (
    <div className="w-full flex flex-col items-center gap-3 select-none">
      <div
        ref={trackRef}
        className={cn(
          "relative w-full h-16 rounded-full bg-slate-950/60 border border-white/5 p-1 flex items-center overflow-hidden transition-all duration-300",
          isDragging && "border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]",
          isSuccess && "bg-emerald-950/40 border-emerald-500/20"
        )}
      >
        {/* Slid progress background */}
        <div
          className="absolute left-1 top-1 bottom-1 bg-gradient-to-r from-indigo-600/30 to-indigo-500/50 rounded-full transition-all duration-75 pointer-events-none"
          style={{ width: `${progressPercentage}%`, minWidth: position > 0 ? "56px" : "0px" }}
        />

        {/* Action instruction text - fades as you slide */}
        <div
          className="absolute inset-0 flex items-center justify-center font-medium text-14 text-slate-400 pointer-events-none transition-opacity duration-150"
          style={{ opacity: isProcessing || isSuccess ? 0 : maxDistance > 0 ? Math.max(0, 1 - (position / (maxDistance * 0.6))) : 1 }}
        >
          Slide to Confirm Transfer
        </div>

        {/* Processing State Text */}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center font-medium text-14 text-indigo-400 animate-pulse pointer-events-none">
            Processing Transaction...
          </div>
        )}

        {/* Success State Text */}
        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center font-semibold text-14 text-emerald-400 pointer-events-none">
            Transaction Authorized
          </div>
        )}

        {/* Slider Knob */}
        <div
          ref={knobRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            transform: `translateX(${position}px)`,
            transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          className={cn(
            "z-10 flex items-center justify-center size-14 rounded-full shadow-lg cursor-grab transition-all duration-200",
            isDragging ? "cursor-grabbing scale-105" : "",
            isProcessing
              ? "bg-indigo-950 border border-indigo-500/30 text-indigo-400"
              : isSuccess
              ? "bg-emerald-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          )}
        >
          {isProcessing ? (
            <Loader2 className="size-6 animate-spin" />
          ) : isSuccess ? (
            <Check className="size-6 stroke-[3]" />
          ) : (
            <ArrowRight className="size-6 stroke-[2.5]" />
          )}
        </div>
      </div>

      {!isProcessing && !isSuccess && (
        <span className="text-11 text-slate-500 uppercase tracking-widest">
          Drag knob fully to the right
        </span>
      )}
    </div>
  )
}
