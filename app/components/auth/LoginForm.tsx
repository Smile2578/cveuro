'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { login, type AuthFormState } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  locale: string;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const errorFromUrl = searchParams.get('error');
  
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    login,
    undefined
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-geds-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t('back')}</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-geds-blue to-geds-cyan mb-4">
                <span className="text-2xl font-bold text-white">CV</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('login.heading')}
              </h1>
              <p className="text-gray-500 mt-2">{t('login.subtitle')}</p>
            </div>

            {/* Error messages */}
            {(errorFromUrl || state?.message) && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  {errorFromUrl || state?.message}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form action={formAction} className="space-y-5">
              <input type="hidden" name="locale" value={locale} />

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  {t('login.email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className={cn(
                      'pl-10 h-12 rounded-lg',
                      state?.errors?.email && 'border-red-500'
                    )}
                    required
                  />
                </div>
                {state?.errors?.email && (
                  <p className="text-sm text-red-500">{state.errors.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">
                    {t('login.password')}
                  </Label>
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="text-sm text-geds-blue hover:underline"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                      'pl-10 h-12 rounded-lg',
                      state?.errors?.password && 'border-red-500'
                    )}
                    required
                  />
                </div>
                {state?.errors?.password && (
                  <p className="text-sm text-red-500">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 rounded-lg bg-gradient-to-r from-geds-blue to-geds-cyan text-white font-medium hover:shadow-lg hover:shadow-geds-blue/25 transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {t('login.submitting')}
                  </>
                ) : (
                  t('login.submit')
                )}
              </Button>
            </form>

            {/* Register link */}
            <p className="text-center text-gray-600 mt-6">
              {t('login.noAccount')}{' '}
              <Link
                href={`/${locale}/register`}
                className="text-geds-blue font-medium hover:underline"
              >
                {t('login.signUp')}
              </Link>
            </p>

            {/* Guest mode */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <Link
                href={`/${locale}/cvgen`}
                className="text-sm text-gray-500 hover:text-geds-blue transition-colors"
              >
                {t('login.continueAsGuest')}
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

