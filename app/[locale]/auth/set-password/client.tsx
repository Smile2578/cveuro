'use client';

import { useState, useRef, useCallback, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

interface SetPasswordClientProps {
  locale: string;
}

export default function SetPasswordClient({ locale }: SetPasswordClientProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const hasTriedAutoSet = useRef(false);
  
  const handleSetPassword = useCallback(async (passwordToSet: string) => {
    setIsLoading(true);
    setError(null);
    
    const supabase = createClient();
    
    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordToSet,
    });
    
    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }
    
    // Clear the pending password from localStorage
    localStorage.removeItem('pendingPassword');
    
    setSuccess(true);
    
    // Redirect to dashboard after a short delay
    startTransition(() => {
      setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 1500);
    });
  }, [locale, router]);

  // Check for pending password and auto-apply (only once)
  // Using a ref + condition instead of useEffect
  if (!hasTriedAutoSet.current && typeof window !== 'undefined') {
    const pendingPassword = localStorage.getItem('pendingPassword');
    if (pendingPassword && !isLoading && !success) {
      hasTriedAutoSet.current = true;
      // Schedule the async operation to run after render
      queueMicrotask(() => handleSetPassword(pendingPassword));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }
    
    if (password.length < 8) {
      setError(t('register.passwordTooShort'));
      return;
    }
    
    await handleSetPassword(password);
  };

  // Success state
  if (success) {
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
                {t('setPassword.success')}
              </h2>
              <p className="text-gray-600 mb-4">{t('setPassword.redirecting')}</p>
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-geds-blue" />
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Loading state (auto-setting password)
  if (isLoading && hasTriedAutoSet.current) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-geds-blue mb-4" />
            <p className="text-gray-600">{t('setPassword.settingUp')}</p>
          </motion.div>
        </main>
      </div>
    );
  }

  // Manual password form (if no pending password or if there was an error)
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-geds-blue to-geds-cyan mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('setPassword.title')}
              </h1>
              <p className="text-gray-500 mt-2">{t('setPassword.subtitle')}</p>
            </div>

            {/* Error message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100"
              >
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  {t('register.password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pl-10 pr-10 h-12 rounded-lg"
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pl-10 pr-10 h-12 rounded-lg"
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
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-lg bg-gradient-to-r from-geds-blue to-geds-cyan text-white font-medium hover:shadow-lg hover:shadow-geds-blue/25 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {t('setPassword.setting')}
                  </>
                ) : (
                  t('setPassword.submit')
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

