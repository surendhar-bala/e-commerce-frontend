import { zodResolver } from '@hookform/resolvers/zod'

import { Link, useNavigate } from '@tanstack/react-router'

import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { z } from 'zod'

import { Alert, AlertDescription } from '@/components/ui/alert'

import { Button } from '@/components/ui/button'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Input } from '@/components/ui/input'

import { PasswordInput } from '@/components/ui/password-input'

import { useDocumentTitle } from '@/hooks/use-document-title'

import { authService } from '@/services'

import { ServiceError } from '@/services/http'

import { useAuthStore } from '@/store/auth-store'

import { UserRole } from '@/types/user'

import { toast } from 'sonner'



const schema = z

  .object({

    name: z.string().min(2, 'Please enter your name.'),

    phone: z

      .string()

      .transform((value) => value.replace(/\D/g, ''))

      .pipe(z.string().regex(/^\d{10}$/, 'Enter a 10-digit phone number.')),

    email: z.string().email('Enter a valid email address.'),

    password: z.string().min(8, 'Use at least 8 characters.'),

  })



type Values = z.infer<typeof schema>



export function RegisterPage() {

  useDocumentTitle('Create account')

  const navigate = useNavigate()

  const setSession = useAuthStore((state) => state.setSession)

  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<Values>({

    resolver: zodResolver(schema),

    defaultValues: {

      name: '',

      phone: '',

      email: '',

      password: '',

    },

  })



  return (

    <div>

      <p className="text-caption">Join Velora</p>

      <h1 className="text-page mt-2">Create account</h1>

      <p className="mt-2 text-small">Sign up with your phone, email, and a password to start shopping.</p>

      {serverError ? (

        <Alert variant="info" className="mt-6">

          <AlertDescription>{serverError}</AlertDescription>

        </Alert>

      ) : null}

      <Form {...form}>

        <form

          className="mt-8 space-y-5"

          onSubmit={form.handleSubmit(async (values) => {

            setServerError(null)

            try {

              const session = await authService.register({

                name: values.name,

                phone: values.phone,

                email: values.email,

                password: values.password,

                role: UserRole.Customer,

              })

              setSession(session.user, session.accessToken)

              toast.success('Welcome to Velora.')

              await navigate({ to: '/products' })

            } catch (error) {

              setServerError(

                error instanceof ServiceError ? error.message : 'Unable to create an account right now.',

              )

            }

          })}

        >

          <FormField

            control={form.control}

            name="name"

            render={({ field }) => (

              <FormItem>

                <FormLabel>Name</FormLabel>

                <FormControl>

                  <Input autoComplete="name" placeholder="Your name" {...field} />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}

          />

          <FormField

            control={form.control}

            name="phone"

            render={({ field }) => (

              <FormItem>

                <FormLabel>Phone number</FormLabel>

                <FormControl>

                  <Input type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" {...field} />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}

          />

          <FormField

            control={form.control}

            name="email"

            render={({ field }) => (

              <FormItem>

                <FormLabel>Email address</FormLabel>

                <FormControl>

                  <Input type="email" autoComplete="email" placeholder="you@gmail.com" {...field} />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}

          />

          <FormField

            control={form.control}

            name="password"

            render={({ field }) => (

              <FormItem>

                <FormLabel>Password</FormLabel>

                <FormControl>

                  <PasswordInput autoComplete="new-password" placeholder="At least 8 characters" {...field} />

                </FormControl>

                <FormMessage />

              </FormItem>

            )}

          />

          <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>

            {form.formState.isSubmitting ? 'Creating…' : 'Create account'}

          </Button>

        </form>

      </Form>

      <p className="mt-6 text-sm text-muted-foreground">

        Already have an account?{' '}

        <Link to="/login" className="text-foreground underline-offset-4 hover:underline">

          Sign in

        </Link>

      </p>

    </div>

  )

}

