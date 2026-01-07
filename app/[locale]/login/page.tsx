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
  
  // Check if user is fully authenticated (not anonymous AND has email identity with password)
  // Users who confirmed email but haven't set password should still access login
  const hasEmailIdentity = user?.identities?.some(
    (identity) => identity.provider === 'email'
  );
  
  // Only redirect if user is fully authenticated (non-anonymous with email identity)
  if (user && !user.is_anonymous && hasEmailIdentity) {
    redirect(`/${locale}/dashboard`);
  }
  
  return <LoginForm locale={locale} />;
}

