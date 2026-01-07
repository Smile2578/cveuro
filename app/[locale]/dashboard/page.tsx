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
  Briefcase,
  GraduationCap,
  Loader2,
  Calendar,
  AlertTriangle,
  MapPin,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { getLegacyGuestId, clearLegacyGuestIds } from '@/lib/supabase/auth-service';
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
    city?: string;
  };
  has_work_exp: boolean;
  skills: Array<{ name: string }>;
  languages: Array<{ language: string }>;
  created_at: string;
  updated_at: string;
  educations?: Array<{ school_name: string; degree: string; field_of_study?: string }>;
  work_experiences?: Array<{ company_name: string; position: string; location?: string }>;
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
        // Only show dashboard to permanent users (not anonymous)
        if (user.is_anonymous) {
          // Anonymous users should be redirected to login
          router.push(`/${locale}/login`);
          return;
        }
        
        // Migrate legacy guest CVs if any exist
        const legacyGuestId = getLegacyGuestId();
        if (legacyGuestId) {
          await supabase
            .from('cvs')
            .update({ user_id: user.id })
            .eq('user_id', legacyGuestId);
          
          clearLegacyGuestIds();
        }
        
        // Fetch CVs for this user
        const { data: cvsData, error } = await supabase
          .from('cvs')
          .select(`
            *,
            educations (school_name, degree, field_of_study),
            work_experiences (company_name, position, location)
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
  }, [locale, router]);

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
    if (lastName) return lastName;
    return null; // Will use CV index as fallback
  };

  const getCVDisplayName = (cv: CVData, index: number) => {
    const fullName = getFullName(cv);
    if (fullName) return fullName;
    return `CV ${cvs.length - index}`; // CV 1 for the most recent, etc.
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

  // Not logged in or anonymous user
  if (!user || user.is_anonymous) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
        <NavBar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-geds-blue/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-geds-blue" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t('dashboard.loginRequired')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('dashboard.loginRequiredDesc')}
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
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-500 mt-1">
              {cvs.length > 1 
                ? t('dashboard.cvCountPlural', { count: cvs.length })
                : t('dashboard.cvCount', { count: cvs.length })}
            </p>
          </div>
          
          <Link href={`/${locale}/cvgen`}>
            <Button className="bg-geds-blue hover:bg-geds-blue/90 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              {t('dashboard.newCV')}
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
              {t('dashboard.noCVs')}
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {t('dashboard.noCVsDesc')}
            </p>
            <Link href={`/${locale}/cvgen`}>
              <Button className="bg-geds-blue hover:bg-geds-blue/90">
                <Plus className="w-4 h-4 mr-2" />
                {t('dashboard.createFirst')}
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
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* CV Preview - Mini version stylisée */}
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white">
                    {/* Header du mini-CV */}
                    <div className="text-center mb-3 pb-3 border-b border-dashed border-gray-200">
                      <h3 className="font-bold text-gray-900 text-lg truncate">
                        {getFullName(cv) || getCVDisplayName(cv, index)}
                      </h3>
                      {cv.personal_info?.jobTitle && (
                        <p className="text-sm text-geds-blue font-medium truncate mt-0.5">
                          {cv.personal_info.jobTitle}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-500">
                        {cv.personal_info?.email && (
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{cv.personal_info.email}</span>
                          </span>
                        )}
                        {cv.personal_info?.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {cv.personal_info.city}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Sections du mini-CV */}
                    <div className="space-y-2 text-xs">
                      {/* Expérience */}
                      {cv.work_experiences && cv.work_experiences.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-gray-700 font-semibold mb-1">
                            <Briefcase className="w-3 h-3 text-geds-green" />
                            {t('dashboard.experience')}
                          </div>
                          <div className="pl-4 text-gray-600 truncate">
                            {cv.work_experiences[0].position} 
                            {cv.work_experiences[0].company_name && (
                              <span className="text-gray-400"> - {cv.work_experiences[0].company_name}</span>
                            )}
                          </div>
                          {cv.work_experiences.length > 1 && (
                            <p className="pl-4 text-gray-400 italic">
                              +{cv.work_experiences.length - 1} {cv.work_experiences.length - 1 > 1 ? t('dashboard.others') : t('dashboard.other')}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {/* Formation */}
                      {cv.educations && cv.educations.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-gray-700 font-semibold mb-1">
                            <GraduationCap className="w-3 h-3 text-geds-blue" />
                            {t('dashboard.education')}
                          </div>
                          <div className="pl-4 text-gray-600 truncate">
                            {cv.educations[0].degree}
                            {cv.educations[0].school_name && (
                              <span className="text-gray-400"> - {cv.educations[0].school_name}</span>
                            )}
                          </div>
                          {cv.educations.length > 1 && (
                            <p className="pl-4 text-gray-400 italic">
                              +{cv.educations.length - 1} {cv.educations.length - 1 > 1 ? t('dashboard.others') : t('dashboard.other')}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {/* Message si CV vide */}
                      {(!cv.work_experiences || cv.work_experiences.length === 0) && 
                       (!cv.educations || cv.educations.length === 0) && (
                        <p className="text-center text-gray-400 italic py-2">
                          {t('dashboard.cvInProgress')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Date de modification */}
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {t('dashboard.updatedAt')} {formatDate(cv.updated_at)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions - 3 boutons clairs */}
                  <div className="p-3 flex gap-2">
                    <Button 
                      size="sm"
                      className="flex-1 bg-geds-blue hover:bg-geds-blue/90 text-white"
                      onClick={() => router.push(`/${locale}/cvedit?userId=${cv.user_id}`)}
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                      {t('dashboard.actions.viewEdit')}
                    </Button>
                    
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex-1 border-geds-green text-geds-green hover:bg-geds-green hover:text-white"
                      onClick={() => router.push(`/${locale}/cvedit?userId=${cv.user_id}&print=true`)}
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      {t('dashboard.actions.pdf')}
                    </Button>
                    
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                      onClick={() => setCvToDelete(cv)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
              {t('dashboard.deleteDialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.deleteDialog.description', { 
                name: cvToDelete ? (getFullName(cvToDelete) || getCVDisplayName(cvToDelete, cvs.findIndex(c => c.id === cvToDelete.id))) : '' 
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>
              {t('dashboard.deleteDialog.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cvToDelete && handleDeleteCV(cvToDelete)}
              disabled={!!deletingId}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('dashboard.deleteDialog.deleting')}
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('dashboard.deleteDialog.confirm')}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
