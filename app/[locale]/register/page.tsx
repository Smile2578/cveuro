import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import RegisterForm from '@/app/components/auth/RegisterForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });
  
  return {
    title: t('register.title'),
    description: t('register.description'),
  };
}

export default async function RegisterPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Redirect if already logged in (but allow anonymous users to access register)
  if (user && !user.is_anonymous) {
    redirect(`/${locale}/cvgen`);
  }
  
  return <RegisterForm locale={locale} />;
}

