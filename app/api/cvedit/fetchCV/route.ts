// app/api/cvedit/fetchCV/route.ts
// Fetches CV for the authenticated user
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { PersonalInfo, Skill, Language, CVTemplate } from '@/types/cv.types';

interface CVRow {
  id: string;
  user_id: string;
  personal_info: PersonalInfo;
  has_work_exp: boolean;
  skills: Skill[];
  languages: Language[];
  hobbies: string[];
  template: string;
  created_at: string;
  updated_at: string;
}

interface EducationRow {
  id: string;
  cv_id: string;
  school_name: string;
  degree: string;
  custom_degree: string | null;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  ongoing: boolean;
  achievements: string[];
  order_index: number;
}

interface WorkExperienceRow {
  id: string;
  cv_id: string;
  company_name: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  ongoing: boolean;
  responsibilities: string[];
  order_index: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const supabase = await createClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    // Determine which user_id to query
    // If userId is provided and matches the authenticated user, use it
    // Otherwise use the authenticated user's id
    const queryUserId = userId && userId === user.id ? userId : user.id;

    // Find CV by user_id
    const { data: cv, error: cvError } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', queryUserId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (cvError) {
      if (cvError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'CV non trouvé' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, error: cvError.message },
        { status: 500 }
      );
    }

    const cvRow = cv as CVRow;

    // Fetch educations
    const { data: educations } = await supabase
      .from('educations')
      .select('*')
      .eq('cv_id', cvRow.id)
      .order('order_index');

    // Fetch work experiences
    const { data: workExperiences } = await supabase
      .from('work_experiences')
      .select('*')
      .eq('cv_id', cvRow.id)
      .order('order_index');

    // Transform to legacy format for compatibility
    const legacyCV = {
      _id: cvRow.id,
      userId: cvRow.user_id,
      personalInfo: cvRow.personal_info,
      education: ((educations || []) as EducationRow[]).map((edu) => ({
        schoolName: edu.school_name,
        degree: edu.degree,
        customDegree: edu.custom_degree,
        fieldOfStudy: edu.field_of_study,
        startDate: edu.start_date,
        endDate: edu.end_date,
        ongoing: edu.ongoing,
        achievements: edu.achievements,
      })),
      hasWorkExp: cvRow.has_work_exp,
      workExperience: ((workExperiences || []) as WorkExperienceRow[]).map((work) => ({
        companyName: work.company_name,
        position: work.position,
        location: work.location,
        startDate: work.start_date,
        endDate: work.end_date,
        ongoing: work.ongoing,
        responsibilities: work.responsibilities,
      })),
      skills: cvRow.skills,
      languages: cvRow.languages,
      hobbies: cvRow.hobbies,
      template: cvRow.template as CVTemplate,
      createdAt: cvRow.created_at,
    };

    return NextResponse.json(legacyCV);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur lors de la récupération du CV' },
      { status: 500 }
    );
  }
}
