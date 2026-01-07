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
  
  // Check if user is fully authenticated (not anonymous AND has email identity with password)
  // Users who confirmed email but haven't set password should still access register
  const hasEmailIdentity = user?.identities?.some(
    (identity) => identity.provider === 'email'
  );
  
  // Only redirect if user is fully authenticated (non-anonymous with email identity)
  if (user && !user.is_anonymous && hasEmailIdentity) {
    redirect(`/${locale}/dashboard`);
  }
  
  return <RegisterForm locale={locale} />;
}

