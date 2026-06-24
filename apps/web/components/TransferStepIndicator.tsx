"use client"

import { cn } from "@/lib/utils"
import { Check, Wallet, UserCheck, Banknote, ShieldCheck, CheckCircle2 } from "lucide-react"

type WizardStep = "source" | "recipient" | "details" | "review" | "success"

interface StepItem {
  key: WizardStep
  label: string
  icon: React.ComponentType<any>
}

const STEPS: StepItem[] = [
  { key: "source", label: "Source", icon: Wallet },
  { key: "recipient", label: "Recipient", icon: UserCheck },
  { key: "details", label: "Details", icon: Banknote },
  { key: "review", label: "Review", icon: ShieldCheck },
  { key: "success", label: "Success", icon: CheckCircle2 },
]

interface TransferStepIndicatorProps {
  currentStep: WizardStep
}

export default function TransferStepIndicator({ currentStep }: TransferStepIndicatorProps) {
  const getStepIndex = (step: WizardStep) => STEPS.findIndex((s) => s.key === step)
  const currentIndex = getStepIndex(currentStep)

  return (
    <div className="w-full py-6 px-4 mb-8 border border-white/5 bg-slate-950/40 rounded-2xl backdrop-blur-md relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto">
        {/* Step Connector Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/5 z-0" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 transition-all duration-500 ease-out z-0"
          style={{ 
            width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {STEPS.map((step, idx) => {
          const Icon = step.icon
          const isCompleted = idx < currentIndex
          const isActive = step.key === currentStep
          const isFuture = idx > currentIndex

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              <div
                className={cn(
                  "flex items-center justify-center size-10 rounded-full border-2 transition-all duration-500 ease-in-out bg-slate-900 shadow-lg",
                  isCompleted && "border-emerald-500 bg-emerald-950/80 text-emerald-400 shadow-emerald-950/50",
                  isActive && "border-indigo-500 bg-indigo-950/80 text-indigo-400 shadow-indigo-500/30 scale-110 ring-4 ring-indigo-500/15 ring-offset-2 ring-offset-slate-950",
                  isFuture && "border-white/10 text-slate-500 bg-slate-950"
                )}
              >
                {isCompleted ? (
                  <Check className="size-5 stroke-[2.5]" />
                ) : (
                  <Icon className={cn("size-5", isActive ? "stroke-[2.2]" : "stroke-[1.8]")} />
                )}
              </div>
              
              <span
                className={cn(
                  "mt-2.5 text-12 font-medium tracking-wide uppercase transition-all duration-300 hidden md:block",
                  isCompleted && "text-emerald-400/80",
                  isActive && "text-indigo-400 font-semibold drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]",
                  isFuture && "text-slate-500"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
