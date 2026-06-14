'use client'
import react from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Form from './Form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import { Loader2 } from 'lucide-react'
import { CardFooter } from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { authFormSchema } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'


export default function AuthForm({type} : {type : 'sign-in' | 'sign-up'}) {
  const router = useRouter()
  const formSchema = authFormSchema(type)
  const defaultValues =
    type === 'sign-in'
      ? { email: "", password: "" }
      : {
          firstName: "",
          lastName: "",
          address1: "",
          city: "",
          state: "",
          postalCode: "",
          dateOfBirth: "",
          ssn: "",
          email: "",
          password: "",
        }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    shouldUnregister: true,
  })
  const [user, setUser] = react.useState(null)
  const [isLoading, setIsLoading] = react.useState(false)

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try{
      //configure database first

      if(type === 'sign-up'){
        const newUser = await signUp(data);
        setUser(newUser)
      }
      else if(type === 'sign-in'){
        const response = await signIn({
          email: data.email,
          password: data.password,
        })
        if(response){
          router.push('/')
        }
      }
      
    }
    catch(err){
      console.log(err)
    }
    finally{
      setIsLoading(false)
    }
   
  
  }
  return(
    <section className='auth-form'>
      <header className='flex flex-col gap-5 md:gap-8'>
        <Link href='/' className='cursor-pointer items-center gap-2 flex'>
            <Image
              src='/icons/logo.svg'
              width={34}
              height={34}
              alt='logo'
            />
            <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>KoshFlow</h1>
            </Link>
            <div className='flex flex-col gap-2 md:gap-3'>
              <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                {user 
                ? "Link Account" : type ==='sign-in' ? "Sign In" : "Sign Up"
                }
              </h1>
              <p className='text-16 font-normal text-gray-600'>
                {user 
                ? "Link your account to get started!" 
                : "Please enter your details."
                }
              </p>
            </div>
      </header>
      {
        user ? (
          <div className='flex flex-col gap-4'>
            {/* PLAID LINK */}
          </div>
        )
        : (
          <>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  // Log validation errors to help debug why submit isn't called
                  console.log('validation errors', errors)
                }
              )}
            >
              {type === 'sign-up' && (
                <FieldGroup className='mb-4'>
                  <div className='flex gap-4'>
                    <Form control={form.control} type='firstName' name='First name' placeholder='e.g. Ankit'/>
                    <Form control={form.control} type='lastName' name='Last name' placeholder='e.g. Sharma'/>
                  </div>

                  <Form control={form.control} type='address1' name='Address' placeholder='Enter your specific address'/>
                  <Form control={form.control} type='city' name='City' placeholder='e.g. Mumbai'/>
                  <div className='flex gap-4'>
                    <Form control={form.control} type='state' name='State' placeholder='e.g. Mumbai'/>
                    <Form control={form.control} type='postalCode' name='Postal Code' placeholder='e.g. 11101'/>
                  </div>
                  
                  <Form control={form.control} type='dateOfBirth' name='Date of Birth' placeholder='DD-MM-YYYY'/>
                </FieldGroup>
              )}
              <FieldGroup>
                <Form control={form.control} type='email' name='Email' placeholder='Enter your email'/>
                <Form control={form.control} type='password' name='Password' placeholder='Enter your password'/>
              </FieldGroup>
              <CardFooter className='bg-inherit'>
              <Field orientation="horizontal" className='flex flex-col gap-4 mt-8'>
                <Button type="submit" form="form-rhf-demo" className='form-btn p-4 w-full' disabled={isLoading}> 
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className='animate-spin'/> &nbsp;
                      Loading...
                    </>
                  ): type === 'sign-in' ? 'Sign In' : 'Sign Up'
                  }
                </Button>
              </Field>
            </CardFooter>
            </form>
            <footer className='flex justify-center gap-1'>
              <p className='text-14 font-normal text-gray-600'> 
                {type === 'sign-in'
                ? "Don't have an account?"
                : "Already have an account?"
                }
              </p>
              <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
                {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
              </Link>

            </footer>
          </>
        )
      }

    </section>
  )
}