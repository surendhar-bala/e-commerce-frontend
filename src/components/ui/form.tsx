import type * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import { createContext, useContext, useId, type ComponentProps, type HTMLAttributes } from 'react'
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)

function useFormField() {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...fieldState,
  }
}

function FormItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const id = useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()
  return <Label className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />
}

function FormControl({ ...props }: ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  return (
    <Slot
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } = useFormField()
  return <p id={formDescriptionId} className={cn('text-sm text-muted-foreground', className)} {...props} />
}

function FormMessage({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message) : props.children
  if (!body) {
    return null
  }
  return (
    <p id={formMessageId} className={cn('text-sm text-destructive', className)} {...props}>
      {body}
    </p>
  )
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormField }
