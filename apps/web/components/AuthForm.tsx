'use client'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import { Loader2 } from 'lucide-react'
import { Field, FieldGroup } from "@/components/ui/field"
import { authFormSchema } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from "./PlaidLink"
import Form from './Form'

export default function AuthForm({type: initialType} : {type : 'sign-in' | 'sign-up'}) {
  const router = useRouter()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>(initialType)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const signUpFieldsRef = useRef<HTMLDivElement>(null)

  const formSchema = authFormSchema(mode)
  const allDefaults = {
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    dateOfBirth: "",
    email: "",
    password: "",
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: allDefaults,
  })

  // Reset form when mode changes
  const handleModeToggle = () => {
    const newMode = mode === 'sign-in' ? 'sign-up' : 'sign-in'
    setMode(newMode)
    setError(null)
    form.reset(allDefaults)
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    try {
      if (mode === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          email: data.email,
          password: data.password,
        }
        const response = await signUp(userData)
        if (response.user) {
          setUser({
            $id: response.user.id,
            userId: response.user.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: `${userData.firstName} ${userData.lastName}`,
            address1: userData.address1,
            city: userData.city,
            state: userData.state,
            postalCode: userData.postalCode,
            dateOfBirth: userData.dateOfBirth,
          })
        }
      } else if (mode === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password,
        })
        if (response) {
          router.push('/')
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isSignUp = mode === 'sign-up'

  return (
    <section className='auth-form animate-fadeInUp'>
      {/* Logo & Header */}
      <header className='relative z-10 flex flex-col gap-5'>
        <div className='flex items-center gap-2.5'>
          <Image
            src='/icons/logo.svg'
            width={32}
            height={32}
            alt='KoshFlow logo'
          />
          <h1 className='text-24 font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent font-(family-name:--font-dm-sans)'>
            KoshFlow
          </h1>
        </div>
        <div className='flex flex-col gap-1.5'>
          <h2 className='text-24 lg:text-30 font-semibold text-white'>
            {user
              ? "Link Account"
              : isSignUp ? "Create Account" : "Welcome Back"
            }
          </h2>
          <p className='text-14 font-normal text-slate-400'>
            {user
              ? "Link your bank account to get started."
              : isSignUp
                ? "Enter your details to create your account."
                : "Sign in to access your dashboard."
            }
          </p>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className='relative z-10 flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-950/30 px-4 py-3 text-[13px] text-rose-400 animate-fadeInUp'>
          <span className='shrink-0'>⚠</span>
          <p>{error}</p>
        </div>
      )}

      {user ? (
        <div className='relative z-10 flex flex-col gap-4'>
          <PlaidLink user={user} variant='primary'/>
        </div>
      ) : (
        <>
          <form
            id="auth-form"
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('validation errors', errors)
            })}
            className='relative z-10 flex flex-col gap-1'
          >
            {/* Sign Up Fields — animated expand/collapse */}
            <div
              ref={signUpFieldsRef}
              className='auth-fields-enter'
              style={{
                maxHeight: isSignUp ? '600px' : '0px',
                opacity: isSignUp ? 1 : 0,
                pointerEvents: isSignUp ? 'auto' : 'none',
              }}
            >
              <FieldGroup className='mb-4 flex flex-col gap-3'>
                <div className='flex gap-3'>
                  <div className={`flex-1 ${isSignUp ? 'animate-fadeInUp animate-delay-1' : ''}`}>
                    <Form control={form.control} type='firstName' name='First Name' placeholder='e.g. Ankit'/>
                  </div>
                  <div className={`flex-1 ${isSignUp ? 'animate-fadeInUp animate-delay-2' : ''}`}>
                    <Form control={form.control} type='lastName' name='Last Name' placeholder='e.g. Sharma'/>
                  </div>
                </div>

                <div className={isSignUp ? 'animate-fadeInUp animate-delay-2' : ''}>
                  <Form control={form.control} type='address1' name='Address' placeholder='Enter your address'/>
                </div>
                <div className={isSignUp ? 'animate-fadeInUp animate-delay-3' : ''}>
                  <Form control={form.control} type='city' name='City' placeholder='e.g. Mumbai'/>
                </div>
                <div className='flex gap-3'>
                  <div className={`flex-1 ${isSignUp ? 'animate-fadeInUp animate-delay-3' : ''}`}>
                    <Form control={form.control} type='state' name='State' placeholder='e.g. Maharashtra'/>
                  </div>
                  <div className={`flex-1 ${isSignUp ? 'animate-fadeInUp animate-delay-4' : ''}`}>
                    <Form control={form.control} type='postalCode' name='Postal Code' placeholder='e.g. 400001'/>
                  </div>
                </div>

                <div className={isSignUp ? 'animate-fadeInUp animate-delay-4' : ''}>
                  <Form control={form.control} type='dateOfBirth' name='Date of Birth' placeholder='YYYY-MM-DD'/>
                </div>
              </FieldGroup>
            </div>

            {/* Email & Password — always visible */}
            <FieldGroup className='flex flex-col gap-3'>
              <Form control={form.control} type='email' name='Email' placeholder='Enter your email'/>
              <Form control={form.control} type='password' name='Password' placeholder='Enter your password'/>
            </FieldGroup>

            {/* Submit */}
            <div className='mt-6'>
              <Button
                type="submit"
                form="auth-form"
                className='form-btn p-4 w-full h-12'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className='animate-spin mr-2' />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : isSignUp ? 'Create Account' : 'Sign In'
                }
              </Button>
            </div>
          </form>

          {/* Mode Toggle */}
          <footer className='relative z-10 flex justify-center gap-1 pt-2'>
            <p className='text-14 font-normal text-slate-500'>
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account?"
              }
            </p>
            <button
              type='button'
              onClick={handleModeToggle}
              className='form-link'
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </footer>
        </>
      )}
    </section>
  )
}