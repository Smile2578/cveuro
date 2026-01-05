'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Globe,
  Trash2,
  Loader2,
  Save,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { createClient } from '@/lib/supabase/client';
import NavBar from '@/app/components/common/NavBar';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function SettingsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');
  
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        setFullName(user.user_metadata?.full_name || '');
      }
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-geds-blue" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <NavBar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'fr' ? 'Connexion requise' : 'Login required'}
            </h1>
            <p className="text-gray-600 mb-6">
              {locale === 'fr' 
                ? 'Vous devez être connecté pour accéder aux paramètres.' 
                : 'You need to be logged in to access settings.'}
            </p>
            <Link href={`/${locale}/login`}>
              <Button className="bg-geds-blue hover:bg-geds-blue/90">
                {t('navigation.login')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/cvgen`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-geds-blue transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{tAuth('back')}</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {t('navigation.settings')}
          </h1>
          <p className="text-gray-500 mt-2">
            {locale === 'fr' 
              ? 'Gérez votre compte et vos préférences' 
              : 'Manage your account and preferences'}
          </p>
        </div>

        {/* Success message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700">
              {locale === 'fr' ? 'Modifications enregistrées !' : 'Changes saved!'}
            </p>
          </motion.div>
        )}

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-geds-blue/10 flex items-center justify-center">
                <User className="w-5 h-5 text-geds-blue" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {locale === 'fr' ? 'Profil' : 'Profile'}
                </h2>
                <p className="text-sm text-gray-500">
                  {locale === 'fr' ? 'Vos informations personnelles' : 'Your personal information'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">
                  {locale === 'fr' ? 'Nom complet' : 'Full name'}
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {locale === 'fr' 
                    ? "L'email ne peut pas être modifié" 
                    : 'Email cannot be changed'}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-geds-blue hover:bg-geds-blue/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {locale === 'fr' ? 'Enregistrement...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {locale === 'fr' ? 'Enregistrer' : 'Save changes'}
                  </>
                )}
              </Button>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {locale === 'fr' ? 'Sécurité' : 'Security'}
                </h2>
                <p className="text-sm text-gray-500">
                  {locale === 'fr' ? 'Mot de passe et authentification' : 'Password and authentication'}
                </p>
              </div>
            </div>

            <Link href={`/${locale}/forgot-password`}>
              <Button variant="outline">
                <Lock className="w-4 h-4 mr-2" />
                {locale === 'fr' ? 'Changer le mot de passe' : 'Change password'}
              </Button>
            </Link>
          </section>

          {/* Preferences Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {locale === 'fr' ? 'Préférences' : 'Preferences'}
                </h2>
                <p className="text-sm text-gray-500">
                  {locale === 'fr' ? 'Notifications et langue' : 'Notifications and language'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {locale === 'fr' ? 'Notifications par email' : 'Email notifications'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {locale === 'fr' 
                      ? 'Recevoir des mises à jour par email' 
                      : 'Receive updates via email'}
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {locale === 'fr' ? 'Langue' : 'Language'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {locale === 'fr' ? 'Français' : 'English'}
                  </p>
                </div>
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="font-semibold text-red-900">
                  {locale === 'fr' ? 'Zone de danger' : 'Danger zone'}
                </h2>
                <p className="text-sm text-red-500">
                  {locale === 'fr' ? 'Actions irréversibles' : 'Irreversible actions'}
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {locale === 'fr' ? 'Supprimer mon compte' : 'Delete my account'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {locale === 'fr' 
                      ? 'Êtes-vous sûr ?' 
                      : 'Are you sure?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {locale === 'fr'
                      ? 'Cette action est irréversible. Tous vos CV et données seront supprimés définitivement.'
                      : 'This action cannot be undone. All your CVs and data will be permanently deleted.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {locale === 'fr' ? 'Annuler' : 'Cancel'}
                  </AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    {locale === 'fr' ? 'Supprimer' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </section>
        </div>
      </main>
    </div>
  );
}

