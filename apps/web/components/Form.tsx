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
  // Determine the HTML input type based on the field
  const inputType = type === 'password'
    ? 'password'
    : type === 'email'
      ? 'email'
      : type === 'dateOfBirth'
        ? 'date'
        : 'text'

  return(
    <Controller
      name={type}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined} className='form-item'>
          <FieldLabel className='form-label'>
            {name}
          </FieldLabel>
          <div className='flex w-full flex-col'>
            <Input
              {...field}
              value={field.value ?? ""}
              id={`auth-field-${type}`}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              type={inputType}
              autoComplete="off"
              className='input-class focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all duration-200'
            />
          </div>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}