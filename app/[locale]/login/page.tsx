import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LoginForm from '@/app/components/auth/LoginForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });
  
  return {
    title: t('login.title'),
    description: t('login.description'),
  };
}

export default async function LoginPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Redirect if already logged in (but allow anonymous users to access login)
  if (user && !user.is_anonymous) {
    redirect(`/${locale}/cvgen`);
  }
  
  return <LoginForm locale={locale} />;
}

