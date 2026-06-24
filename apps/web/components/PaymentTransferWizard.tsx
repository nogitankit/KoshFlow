"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Loader2, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Copy, 
  User, 
  Mail, 
  FileText, 
  Calendar,
  Building,
  CheckCircle,
  CheckCircle2,
  Share2,
  DollarSign
} from "lucide-react"

import { createTransfer, createTransaction } from "@/lib/actions/bank.actions"
import { getBank, getBankByAccountId, getUserInfo } from "@/lib/actions/user.actions"
import { decryptId, formatAmount } from "@/lib/utils"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { 
  Field, 
  FieldLabel, 
  FieldDescription, 
  FieldError 
} from "@/components/ui/field"
import TransferStepIndicator from "./TransferStepIndicator"
import SlideToConfirm from "./SlideToConfirm"

type WizardStep = "source" | "recipient" | "details" | "review" | "success"

interface PaymentTransferWizardProps {
  accounts: Account[]
}

const RECENT_RECIPIENTS = [
  { name: "Ankit Sharma", shareableId: "bXp5TGV4V3dSamg2NUE5ZTVxMWF1TlpLdjdsMXg5aWdnVmF6UQ==", email: "ankit@gmail.com" },
  { name: "test testtt", shareableId: "Z2dKNU5WVkIxelVtcEs5cW9FeE1GQlBEWjRXNlZXaTlXWkUxYg==", email: "asdasd@gmail.com" },
  { name: "Bleh Bleh", shareableId: "QUVNM0JSZVJhUlRCd0tuNXBFQm9obUFLZ0ttb0RXdEIxekxiSw==", email: "bleh@bleh.com" },
]

export default function PaymentTransferWizard({ accounts = [] }: PaymentTransferWizardProps) {
  const router = useRouter()
  
  // Wizard states
  const [activeStep, setActiveStep] = useState<WizardStep>("source")
  const [selectedSourceAccountId, setSelectedSourceAccountId] = useState<string | null>(
    accounts[0]?.itemId || null
  )
  const [recipientShareableId, setRecipientShareableId] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  
  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Completed transaction details (for receipt)
  const [receipt, setReceipt] = useState<{
    referenceId: string
    amount: number
    date: string
    senderAccountName: string
    senderAccountMask: string
    recipientName: string
    recipientShareableId: string
    note: string
  } | null>(null)

  const selectedAccount = accounts.find((acc) => acc.itemId === selectedSourceAccountId)

  // Step navigations & validation
  const validateStep = (step: WizardStep): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === "source") {
      if (!selectedSourceAccountId) {
        newErrors.source = "Please select a source bank account to proceed"
      }
    }

    if (step === "recipient") {
      if (!recipientShareableId.trim()) {
        newErrors.recipientShareableId = "Shareable ID is required"
      } else if (recipientShareableId.trim().length < 8) {
        newErrors.recipientShareableId = "Shareable ID must be at least 8 characters"
      }
      
      if (!recipientEmail.trim()) {
        newErrors.email = "Recipient email address is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
        newErrors.email = "Invalid email format"
      }
    }

    if (step === "details") {
      const parsedAmount = parseFloat(amount)
      if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
        newErrors.amount = "Please enter a valid transfer amount"
      } else if (selectedAccount) {
        const availableBalanceInr = selectedAccount.availableBalance * 100
        if (parsedAmount > availableBalanceInr) {
          newErrors.amount = "Insufficient funds in your account"
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep(activeStep)) return

    if (activeStep === "source") setActiveStep("recipient")
    else if (activeStep === "recipient") setActiveStep("details")
    else if (activeStep === "details") setActiveStep("review")
  }

  const handleBack = () => {
    if (activeStep === "recipient") setActiveStep("source")
    else if (activeStep === "details") setActiveStep("recipient")
    else if (activeStep === "review") setActiveStep("details")
  }

  const handleRecentSelect = (rec: typeof RECENT_RECIPIENTS[0]) => {
    setRecipientShareableId(rec.shareableId)
    setRecipientEmail(rec.email)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.recipientShareableId
      delete next.email
      return next
    })
  }

  // Handle transfer execution
  const handleConfirmTransfer = async () => {
    setIsSubmitting(true)
    setErrors({})

    try {
      // 1. Decrypt Shareable ID
      let receiverAccountId = ""
      try {
        receiverAccountId = decryptId(recipientShareableId)
      } catch (e) {
        setErrors({ general: "Invalid Shareable ID format. Decryption failed." })
        setIsSubmitting(false)
        return
      }

      // 2. Fetch recipient bank account info
      const receiverBank = await getBankByAccountId({ accountId: receiverAccountId })
      if (!receiverBank) {
        setErrors({ general: "Recipient bank account not found" })
        setIsSubmitting(false)
        return
      }

      // 3. Fetch sender bank account info
      if (!selectedSourceAccountId) {
        setErrors({ general: "Sender bank account selection missing" })
        setIsSubmitting(false)
        return
      }
      const senderBank = await getBank({ documentId: selectedSourceAccountId })
      if (!senderBank) {
        setErrors({ general: "Sender bank details could not be found" })
        setIsSubmitting(false)
        return
      }

      // 4. Fetch sender user profile
      const senderUser = await getUserInfo({ userId: senderBank.userId })
      if (!senderUser) {
        setErrors({ general: "Sender user profile could not be verified" })
        setIsSubmitting(false)
        return
      }

      const senderLegalName = `${senderUser.firstName} ${senderUser.lastName}`

      // 5. Convert INR amount to USD (using the 1 USD = 100 INR rate matching the toInr helper)
      const inrAmount = parseFloat(amount)
      const usdAmount = (inrAmount / 100).toFixed(2)

      // 6. Execute transfer with Plaid authorization
      const transferResult = await createTransfer({
        accessToken: senderBank.access_token,
        accountId: senderBank.accountId,
        amount: usdAmount,
        legalName: senderLegalName,
        description: note || "KoshFlow Funds Transfer",
      })

      if (!transferResult) {
        setErrors({ general: "Transfer authorization rejected by Plaid Sandbox" })
        setIsSubmitting(false)
        return
      }

      // 7. Store Transaction in Database
      const transactionObj = {
        name: note || "KoshFlow Funds Transfer",
        amount: usdAmount,
        senderId: senderBank.userId,
        senderBankId: senderBank.accountId,
        receiverId: receiverBank.userId,
        receiverBankId: receiverBank.accountId,
        email: recipientEmail,
      }

      const newTransaction = await createTransaction(transactionObj)

      if (newTransaction) {
        // Success path
        setIsSuccess(true)
        setReceipt({
          referenceId: newTransaction.id || transferResult.id || `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
          amount: inrAmount,
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          senderAccountName: selectedAccount?.name || "Sender Account",
          senderAccountMask: selectedAccount?.mask || "••••",
          recipientName: receiverBank.userId === senderBank.userId ? "Self Account" : recipientEmail.split("@")[0] || "Recipient",
          recipientShareableId,
          note: note || "No remarks provided",
        })

        // Move to success step after small delay
        setTimeout(() => {
          setActiveStep("success")
          setIsSubmitting(false)
        }, 1200)
      } else {
        setErrors({ general: "Failed to persist transfer logs. Please retry." })
        setIsSubmitting(false)
      }
    } catch (error: any) {
      console.error("Submitting create transfer request failed: ", error)
      setErrors({ general: error.message || "An unexpected error occurred during transfer authorization." })
      setIsSubmitting(false)
    }
  }

  // Reset helper
  const handleResetTransfer = () => {
    setActiveStep("source")
    setRecipientShareableId("")
    setRecipientEmail("")
    setAmount("")
    setNote("")
    setErrors({})
    setReceipt(null)
    setIsSuccess(false)
  }

  return (
    <div className="w-full flex flex-col gap-6 max-w-4xl mx-auto">
      {/* 5-Step Stepper Header */}
      <TransferStepIndicator currentStep={activeStep} />

      {errors.general && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-300 text-14 animate-fadeInUp">
          <AlertCircle className="size-5 shrink-0 stroke-[2]" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* STEP 1: Source Bank Selection */}
      {activeStep === "source" && (
        <div className="flex flex-col gap-6 animate-fadeInUp">
          <div className="payment-transfer_form-details !border-none !pt-0 !pb-2">
            <h2 className="text-18 font-semibold text-white">Select Source Account</h2>
            <p className="text-14 text-slate-400">Choose the linked bank account you wish to transfer funds from.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => {
              const isSelected = selectedSourceAccountId === account.itemId
              return (
                <div
                  key={account.id}
                  onClick={() => {
                    setSelectedSourceAccountId(account.itemId)
                    setErrors({})
                  }}
                  className={`relative p-5 rounded-2xl cursor-pointer border transition-all duration-300 select-none flex items-center justify-between ${
                    isSelected
                      ? "bg-indigo-950/40 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.25)] scale-[1.01]"
                      : "bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-slate-900/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-slate-900/80 flex items-center justify-center border border-white/5 text-indigo-400">
                      <Building className="size-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className="text-16 font-semibold text-white leading-tight">
                        {account.name}
                      </h3>
                      <p className="text-12 text-slate-400 mt-0.5">
                        {account.officialName} •••• {account.mask}
                      </p>
                      <span className="inline-block mt-2 text-10 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-white/5">
                        {account.subtype}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-12 text-slate-400">Available Balance</p>
                    <p className="text-16 font-bold text-white mt-0.5">
                      {formatAmount(account.availableBalance)}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 size-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {errors.source && (
            <p className="text-12 text-rose-400 flex items-center gap-1.5 mt-2">
              <AlertCircle className="size-4" /> {errors.source}
            </p>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!selectedSourceAccountId}
              className="px-6 py-2.5 font-semibold flex items-center gap-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
            >
              Continue <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Recipient Details */}
      {activeStep === "recipient" && (
        <div className="flex flex-col gap-6 animate-fadeInUp">
          <div className="payment-transfer_form-details !border-none !pt-0 !pb-2">
            <h2 className="text-18 font-semibold text-white">Recipient Details</h2>
            <p className="text-14 text-slate-400">Enter the recipient&apos;s unique shareable ID and email address.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Field className="border-none p-0 flex flex-col gap-2">
              <FieldLabel className="text-14 font-medium text-slate-300">
                Plaid Shareable ID
              </FieldLabel>
              <FieldDescription className="text-12 text-slate-400">
                The unique identifier associated with the recipient&apos;s linked account.
              </FieldDescription>
              <div className="relative">
                <Input
                  value={recipientShareableId}
                  onChange={(e) => {
                    setRecipientShareableId(e.target.value)
                    if (errors.recipientShareableId) {
                      setErrors((prev) => {
                        const next = { ...prev }
                        delete next.recipientShareableId
                        return next
                      })
                    }
                  }}
                  placeholder="Enter recipient's public shareable ID"
                  className="input-class pl-10"
                />
                <Copy className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              </div>
              {errors.recipientShareableId && <p className="text-12 text-rose-400">{errors.recipientShareableId}</p>}
            </Field>

            <Field className="border-none p-0 flex flex-col gap-2">
              <FieldLabel className="text-14 font-medium text-slate-300">
                Recipient&apos;s Email Address
              </FieldLabel>
              <FieldDescription className="text-12 text-slate-400">
                Used to verify user identity and send payment confirmation notifications.
              </FieldDescription>
              <div className="relative">
                <Input
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value)
                    if (errors.email) {
                      setErrors((prev) => {
                        const next = { ...prev }
                        delete next.email
                        return next
                      })
                    }
                  }}
                  placeholder="ex: rahul@gmail.com"
                  className="input-class pl-10"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              </div>
              {errors.email && <p className="text-12 text-rose-400">{errors.email}</p>}
            </Field>

            {/* Quick Select Recent Contacts */}
            <div className="mt-4">
              <h4 className="text-13 uppercase tracking-wider font-semibold text-slate-400 mb-3">
                Recent Contacts
              </h4>
              <div className="flex flex-wrap gap-2">
                {RECENT_RECIPIENTS.map((rec) => (
                  <button
                    key={rec.shareableId}
                    type="button"
                    onClick={() => handleRecentSelect(rec)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/40 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-950/10 transition-all text-left group"
                  >
                    <div className="size-7 rounded-full bg-slate-900 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <User className="size-4" />
                    </div>
                    <div>
                      <p className="text-12 font-medium text-slate-200">{rec.name}</p>
                      <p className="text-10 text-slate-500">{rec.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              onClick={handleBack}
              className="px-5 py-2.5 border border-white/5 text-slate-300 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button
              onClick={handleNext}
              className="px-6 py-2.5 font-semibold flex items-center gap-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
            >
              Continue <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Transfer Details */}
      {activeStep === "details" && (
        <div className="flex flex-col gap-6 animate-fadeInUp">
          <div className="payment-transfer_form-details !border-none !pt-0 !pb-2">
            <h2 className="text-18 font-semibold text-white">Transfer Details</h2>
            <p className="text-14 text-slate-400">Specify the amount you wish to transfer and add a memo note.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Field className="border-none p-0 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <FieldLabel className="text-14 font-medium text-slate-300">
                  Transfer Amount
                </FieldLabel>
                {selectedAccount && (
                  <span className="text-12 text-slate-400">
                    Max Available: <span className="font-semibold text-white">{formatAmount(selectedAccount.availableBalance)}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Input
                  value={amount}
                  onChange={(e) => {
                    // Restrict input to digits and decimal point
                    const val = e.target.value.replace(/[^0-9.]/g, "")
                    setAmount(val)
                    if (errors.amount) {
                      setErrors((prev) => {
                        const next = { ...prev }
                        delete next.amount
                        return next
                      })
                    }
                  }}
                  placeholder="0.00"
                  className="input-class pl-10 text-18 font-bold"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-16">
                  ₹
                </span>
              </div>
              {errors.amount && <p className="text-12 text-rose-400">{errors.amount}</p>}
            </Field>

            <Field className="border-none p-0 flex flex-col gap-2">
              <FieldLabel className="text-14 font-medium text-slate-300">
                Remarks / Memo Note (Optional)
              </FieldLabel>
              <div className="relative">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Rent share, Dinner expenses, Split bill"
                  className="input-class min-h-[100px] pl-10 pt-3"
                />
                <FileText className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
              </div>
            </Field>
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              onClick={handleBack}
              className="px-5 py-2.5 border border-white/5 text-slate-300 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button
              onClick={handleNext}
              className="px-6 py-2.5 font-semibold flex items-center gap-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
            >
              Review details <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Review and Confirm (Slide-to-Confirm) */}
      {activeStep === "review" && (
        <div className="flex flex-col gap-6 animate-fadeInUp">
          <div className="payment-transfer_form-details !border-none !pt-0 !pb-2">
            <h2 className="text-18 font-semibold text-white">Review & Confirm</h2>
            <p className="text-14 text-slate-400">Please carefully verify the transaction particulars before authorizing.</p>
          </div>

          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p className="text-11 uppercase tracking-widest text-slate-500 font-semibold">Source Account</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="size-9 rounded-full bg-slate-900 flex items-center justify-center text-indigo-400 border border-white/5">
                    <Building className="size-5" />
                  </div>
                  <div>
                    <p className="text-14 font-semibold text-white">{selectedAccount?.name}</p>
                    <p className="text-12 text-slate-400">•••• {selectedAccount?.mask} ({selectedAccount?.officialName})</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-11 uppercase tracking-widest text-slate-500 font-semibold">Recipient Contact</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="size-9 rounded-full bg-slate-900 flex items-center justify-center text-indigo-400 border border-white/5">
                    <User className="size-5" />
                  </div>
                  <div>
                    <p className="text-14 font-semibold text-white">
                      {recipientEmail.split("@")[0] || "Plaid Recipient"}
                    </p>
                    <p className="text-12 text-slate-400">{recipientEmail}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 border-t border-white/5 pt-4">
                <p className="text-11 uppercase tracking-widest text-slate-500 font-semibold">Recipient ID</p>
                <p className="text-13 font-mono text-indigo-400 mt-1 break-all bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                  {recipientShareableId}
                </p>
              </div>

              <div className="md:col-span-2 border-t border-white/5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-11 uppercase tracking-widest text-slate-500 font-semibold">Transfer Amount</p>
                  <p className="text-24 font-bold text-white mt-1.5">
                    ₹{parseFloat(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-11 uppercase tracking-widest text-slate-500 font-semibold">Memo Remarks</p>
                  <p className="text-14 text-slate-300 mt-2 italic">
                    &ldquo;{note || "No remarks provided"}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Slide to Confirm component */}
            <div className="border-t border-white/5 pt-6 mt-2">
              <SlideToConfirm 
                onConfirm={handleConfirmTransfer} 
                isProcessing={isSubmitting} 
                isSuccess={isSuccess}
              />
            </div>
          </div>

          {!isSubmitting && (
            <div className="flex justify-start">
              <Button
                onClick={handleBack}
                className="px-5 py-2.5 border border-white/5 text-slate-300 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="size-4" /> Edit Transfer Details
              </Button>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: Success Receipt Screen */}
      {activeStep === "success" && receipt && (
        <div className="flex flex-col items-center gap-6 animate-fadeInUp">
          <div className="size-16 rounded-full bg-emerald-950/60 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-bounce">
            <CheckCircle className="size-10 stroke-[2.2]" />
          </div>

          <div className="text-center">
            <h2 className="text-24 font-bold text-white">Transfer Successful!</h2>
            <p className="text-14 text-slate-400 mt-1">Your transaction has been authorized and executed successfully.</p>
          </div>

          {/* Premium Digital Receipt Card */}
          <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-6 shadow-chart relative overflow-hidden">
            {/* Ambient decorations */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="absolute -right-16 -bottom-16 size-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <div>
                <p className="text-11 uppercase tracking-widest text-slate-500 font-semibold">Transaction Receipt</p>
                <p className="text-12 font-mono text-slate-400 mt-0.5">ID: {receipt.referenceId}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-10 font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/25">
                Authorized
              </span>
            </div>

            <div className="flex flex-col items-center py-4 border-b border-white/5 mb-4">
              <span className="text-12 text-slate-400">Total Transferred</span>
              <h3 className="text-30 font-black text-white mt-1">
                ₹{receipt.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h3>
              <span className="text-11 text-slate-500 mt-1">Status: Processed Instantly via Plaid ACH</span>
            </div>

            <div className="flex flex-col gap-3 text-13">
              <div className="flex justify-between">
                <span className="text-slate-400">Sender Account</span>
                <span className="font-semibold text-white">{receipt.senderAccountName} (•••• {receipt.senderAccountMask})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient Contact</span>
                <span className="font-semibold text-white">{receipt.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient ID</span>
                <span className="font-mono text-xs text-indigo-300 max-w-[200px] truncate">{receipt.recipientShareableId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Date</span>
                <span className="font-semibold text-white">{receipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Fee</span>
                <span className="font-semibold text-emerald-400">₹0.00 (Waived)</span>
              </div>
              <div className="flex flex-col border-t border-white/5 pt-3 mt-1.5">
                <span className="text-slate-500 text-11 uppercase tracking-wider font-semibold">Remarks Memo</span>
                <span className="text-slate-300 italic mt-1">&ldquo;{receipt.note}&rdquo;</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mt-2">
            <Button
              onClick={handleResetTransfer}
              className="flex-1 px-5 py-3 border border-white/10 text-slate-200 rounded-xl hover:bg-white/5 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Transfer Again
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="flex-1 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
