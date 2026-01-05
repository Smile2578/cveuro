import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ForgotPasswordForm from '@/app/components/auth/ForgotPasswordForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });
  
  return {
    title: t('forgotPassword.title'),
    description: t('forgotPassword.description'),
  };
}

export default async function ForgotPasswordPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Redirect if already logged in
  if (user) {
    redirect(`/${locale}/cvgen`);
  }
  
  return <ForgotPasswordForm locale={locale} />;
}

