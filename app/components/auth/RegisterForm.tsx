'use client';

import { useActionState, useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { register, type AuthFormState } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getErrorKey } from '@/lib/auth/error-messages';
import { useAuth } from '@/app/hooks/useAuth';

interface RegisterFormProps {
  locale: string;
}

export default function RegisterForm({ locale }: RegisterFormProps) {
  const t = useTranslations('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isAnonymous } = useAuth();
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    register,
    undefined
  );

  // Get translated error message
  const errorMessage = useMemo(() => {
    if (state?.errorCode) {
      const key = getErrorKey(state.errorCode);
      return t(key);
    }
    return null;
  }, [state?.errorCode, t]);

  // Show success message
  if (state?.success) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <header className="p-4 sm:p-6">
          <Link
            href={`/${locale}`}
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
                {t('register.checkEmail')}
              </h2>
              <p className="text-gray-600 mb-6">{t('register.confirmationSent')}</p>
              <Link href={`/${locale}/login`}>
                <Button variant="outline" className="w-full">
                  {t('register.backToLogin')}
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
                {t('register.heading')}
              </h1>
              <p className="text-gray-500 mt-2">{t('register.subtitle')}</p>
            </div>

            {/* Error message */}
            {errorMessage && !state?.success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </motion.div>
            )}

            {/* Register Form */}
            <form action={formAction} className="space-y-5">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="isAnonymous" value={isAnonymous ? 'true' : 'false'} />

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">
                  {t('register.fullName')}
                  <span className="text-gray-400 text-sm ml-1">
                    ({t('register.optional')})
                  </span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder={locale === 'fr' ? 'Jean Dupont' : 'John Doe'}
                    className={cn(
                      'pl-10 h-12 rounded-lg',
                      state?.errors?.fullName && 'border-red-500'
                    )}
                  />
                </div>
                {state?.errors?.fullName && (
                  <p className="text-sm text-red-500">
                    {state.errors.fullName[0]}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  {t('register.email')}
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
                <Label htmlFor="password" className="text-gray-700">
                  {t('register.password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={cn(
                      'pl-10 pr-10 h-12 rounded-lg',
                      state?.errors?.password && 'border-red-500'
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">{t('register.passwordHint')}</p>
                {state?.errors?.password && (
                  <p className="text-sm text-red-500">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  {t('register.confirmPassword')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={cn(
                      'pl-10 pr-10 h-12 rounded-lg',
                      state?.errors?.confirmPassword && 'border-red-500'
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {state?.errors?.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {state.errors.confirmPassword[0]}
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
                    {t('register.submitting')}
                  </>
                ) : (
                  t('register.submit')
                )}
              </Button>
            </form>

            {/* Login link */}
            <p className="text-center text-gray-600 mt-6">
              {t('register.hasAccount')}{' '}
              <Link
                href={`/${locale}/login`}
                className="text-geds-blue font-medium hover:underline"
              >
                {t('register.signIn')}
              </Link>
            </p>

            {/* Terms */}
            <p className="text-xs text-gray-400 text-center mt-6">
              {t('register.terms')}{' '}
              <Link href={`/${locale}/terms`} className="underline">
                {t('register.termsLink')}
              </Link>{' '}
              {t('register.and')}{' '}
              <Link href={`/${locale}/privacy`} className="underline">
                {t('register.privacyLink')}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

