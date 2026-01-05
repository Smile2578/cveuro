'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { resetPassword, type AuthFormState } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ForgotPasswordFormProps {
  locale: string;
}

export default function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const t = useTranslations('auth');
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    resetPassword,
    undefined
  );

  // Show success message
  if (state?.success) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <header className="p-4 sm:p-6">
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-geds-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{t('back')}</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {t('forgotPassword.checkEmail')}
              </h2>
              <p className="text-gray-600 mb-6">{state.message}</p>
              <Link href={`/${locale}/login`}>
                <Button variant="outline" className="w-full">
                  {t('forgotPassword.backToLogin')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <Link
          href={`/${locale}/login`}
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
                {t('forgotPassword.heading')}
              </h1>
              <p className="text-gray-500 mt-2">{t('forgotPassword.subtitle')}</p>
            </div>

            {/* Error message */}
            {state?.message && !state.success && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{state.message}</p>
              </div>
            )}

            {/* Form */}
            <form action={formAction} className="space-y-5">
              <input type="hidden" name="locale" value={locale} />

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  {t('forgotPassword.email')}
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 rounded-lg bg-gradient-to-r from-geds-blue to-geds-cyan text-white font-medium hover:shadow-lg hover:shadow-geds-blue/25 transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {t('forgotPassword.submitting')}
                  </>
                ) : (
                  t('forgotPassword.submit')
                )}
              </Button>
            </form>

            {/* Back to login */}
            <p className="text-center text-gray-600 mt-6">
              <Link
                href={`/${locale}/login`}
                className="text-geds-blue font-medium hover:underline"
              >
                {t('forgotPassword.backToLogin')}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

