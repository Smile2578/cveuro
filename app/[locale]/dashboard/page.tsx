'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Edit3, 
  Trash2, 
  Download,
  Clock,
  User,
  Briefcase,
  GraduationCap,
  Loader2,
  MoreVertical,
  Eye,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { createClient } from '@/lib/supabase/client';
import NavBar from '@/app/components/common/NavBar';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface CVData {
  id: string;
  user_id: string;
  personal_info: {
    firstName?: string;
    lastName?: string;
    email?: string;
    jobTitle?: string;
  };
  has_work_exp: boolean;
  skills: Array<{ name: string }>;
  languages: Array<{ language: string }>;
  created_at: string;
  updated_at: string;
  educations?: Array<{ school_name: string; degree: string }>;
  work_experiences?: Array<{ company_name: string; position: string }>;
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const t = useTranslations('common');
  
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cvToDelete, setCvToDelete] = useState<CVData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch CVs for this user
        const { data: cvsData, error } = await supabase
          .from('cvs')
          .select(`
            *,
            educations (school_name, degree),
            work_experiences (company_name, position)
          `)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (!error && cvsData) {
          setCvs(cvsData);
        }
      }
      
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const handleDeleteCV = async (cv: CVData) => {
    setDeletingId(cv.id);
    
    try {
      const supabase = createClient();
      
      // Delete related records first (due to foreign keys)
      await supabase.from('educations').delete().eq('cv_id', cv.id);
      await supabase.from('work_experiences').delete().eq('cv_id', cv.id);
      
      // Delete the CV
      const { error } = await supabase.from('cvs').delete().eq('id', cv.id);
      
      if (!error) {
        setCvs(prev => prev.filter(c => c.id !== cv.id));
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
    } finally {
      setDeletingId(null);
      setCvToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getFullName = (cv: CVData) => {
    const { firstName, lastName } = cv.personal_info || {};
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return locale === 'fr' ? 'Sans nom' : 'Unnamed';
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
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-geds-blue/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-geds-blue" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'fr' ? 'Connexion requise' : 'Login required'}
            </h1>
            <p className="text-gray-600 mb-6">
              {locale === 'fr' 
                ? 'Connectez-vous pour accéder à votre tableau de bord et gérer vos CV.' 
                : 'Sign in to access your dashboard and manage your CVs.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${locale}/login`}>
                <Button className="bg-geds-blue hover:bg-geds-blue/90 w-full sm:w-auto">
                  {t('navigation.login')}
                </Button>
              </Link>
              <Link href={`/${locale}/register`}>
                <Button variant="outline" className="w-full sm:w-auto">
                  {t('navigation.register')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {locale === 'fr' ? 'Mes CV' : 'My CVs'}
            </h1>
            <p className="text-gray-500 mt-1">
              {locale === 'fr' 
                ? `${cvs.length} CV${cvs.length > 1 ? 's' : ''} enregistré${cvs.length > 1 ? 's' : ''}`
                : `${cvs.length} CV${cvs.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>
          
          <Link href={`/${locale}/cvgen`}>
            <Button className="bg-geds-blue hover:bg-geds-blue/90 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              {locale === 'fr' ? 'Nouveau CV' : 'New CV'}
            </Button>
          </Link>
        </div>

        {/* Empty state */}
        {cvs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {locale === 'fr' ? 'Aucun CV pour le moment' : 'No CVs yet'}
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {locale === 'fr' 
                ? 'Commencez à créer votre premier CV professionnel en quelques minutes.'
                : 'Start creating your first professional CV in just a few minutes.'}
            </p>
            <Link href={`/${locale}/cvgen`}>
              <Button className="bg-geds-blue hover:bg-geds-blue/90">
                <Plus className="w-4 h-4 mr-2" />
                {locale === 'fr' ? 'Créer mon premier CV' : 'Create my first CV'}
              </Button>
            </Link>
          </motion.div>
        )}

        {/* CV Grid */}
        {cvs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {cvs.map((cv, index) => (
                <motion.div
                  key={cv.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Card Header */}
                  <div className="p-5 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {getFullName(cv)}
                        </h3>
                        {cv.personal_info?.jobTitle && (
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {cv.personal_info.jobTitle}
                          </p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/${locale}/cvedit?userId=${cv.user_id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            {locale === 'fr' ? 'Voir' : 'View'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/${locale}/cvgen?edit=${cv.id}`)}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            {locale === 'fr' ? 'Modifier' : 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/${locale}/cvedit?userId=${cv.user_id}`)}>
                            <Download className="w-4 h-4 mr-2" />
                            {locale === 'fr' ? 'Télécharger' : 'Download'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setCvToDelete(cv)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {locale === 'fr' ? 'Supprimer' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Card Stats */}
                  <div className="px-5 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {(cv.educations?.length ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                          <GraduationCap className="w-3 h-3" />
                          {cv.educations?.length} {locale === 'fr' ? 'formation' : 'education'}
                          {(cv.educations?.length ?? 0) > 1 ? 's' : ''}
                        </span>
                      )}
                      {(cv.work_experiences?.length ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs">
                          <Briefcase className="w-3 h-3" />
                          {cv.work_experiences?.length} {locale === 'fr' ? 'expérience' : 'experience'}
                          {(cv.work_experiences?.length ?? 0) > 1 ? 's' : ''}
                        </span>
                      )}
                      {(cv.skills?.length ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-xs">
                          {cv.skills?.length} {locale === 'fr' ? 'compétence' : 'skill'}
                          {(cv.skills?.length ?? 0) > 1 ? 's' : ''}
                        </span>
                      )}
                      {(cv.languages?.length ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 text-orange-700 text-xs">
                          {cv.languages?.length} {locale === 'fr' ? 'langue' : 'language'}
                          {(cv.languages?.length ?? 0) > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {locale === 'fr' ? 'Modifié le' : 'Updated'} {formatDate(cv.updated_at)}
                      </span>
                    </div>
                    
                    <Link href={`/${locale}/cvedit?userId=${cv.user_id}`}>
                      <Button size="sm" variant="ghost" className="h-7 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        {locale === 'fr' ? 'Voir' : 'View'}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!cvToDelete} onOpenChange={() => setCvToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {locale === 'fr' ? 'Supprimer ce CV ?' : 'Delete this CV?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {locale === 'fr'
                ? `Êtes-vous sûr de vouloir supprimer le CV de "${cvToDelete ? getFullName(cvToDelete) : ''}" ? Cette action est irréversible.`
                : `Are you sure you want to delete the CV for "${cvToDelete ? getFullName(cvToDelete) : ''}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>
              {locale === 'fr' ? 'Annuler' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cvToDelete && handleDeleteCV(cvToDelete)}
              disabled={!!deletingId}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {locale === 'fr' ? 'Suppression...' : 'Deleting...'}
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {locale === 'fr' ? 'Supprimer' : 'Delete'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

