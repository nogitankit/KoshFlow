'use client'
import { Control, Controller, FieldPath } from "react-hook-form"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'

const formSchema = authFormSchema('sign-up')
type FormFieldName = FieldPath<z.infer<typeof formSchema>>

interface FormProps {
  control: Control<z.infer<typeof formSchema>>,
  type: FormFieldName,
  name: string
  placeholder: string,
}

export default function Form({control, type, name, placeholder}: FormProps) {
  return(
    <>
    <Controller
              name={type}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='form-item'>
                  <FieldLabel className='form-label'>
                    {name}
                  </FieldLabel>
                  <div className='flex w-full flex-col'>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder={placeholder}
                      type={type === 'password' ? 'password' : 'text'}
                      autoComplete="off"
                      className='input-class'
                  />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
    </>
  )
}