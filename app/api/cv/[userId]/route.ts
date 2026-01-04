// app/api/cv/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parse, format } from 'date-fns';
import type { PersonalInfo, Education, WorkExperience, Skill, Language, CVTemplate } from '@/types/cv.types';

// ============================================================================
// TYPES
// ============================================================================

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

interface CVUpdateBody {
  personalInfo?: PersonalInfo;
  educations?: Education[];
  workExperience?: {
    hasWorkExperience: boolean;
    experiences: WorkExperience[];
  };
  skills?: Skill[];
  languages?: Language[];
  hobbies?: string[];
  template?: CVTemplate;
}

// ============================================================================
// GET - Fetch CV by userId
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = await createClient();

    // Find CV by user_id
    const { data: cv, error: cvError } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', userId)
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

    // Transform to app format
    const transformedCV = {
      id: cvRow.id,
      userId: cvRow.user_id,
      personalInfo: cvRow.personal_info,
      education: ((educations || []) as EducationRow[]).map((edu) => ({
        id: edu.id,
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
        id: work.id,
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
      updatedAt: cvRow.updated_at,
    };

    return NextResponse.json(transformedCV);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur lors de la récupération du CV' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT - Update CV by userId
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = await createClient();
    const body: CVUpdateBody = await request.json();

    // Find existing CV
    const { data: existingCV, error: findError } = await supabase
      .from('cvs')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (findError || !existingCV) {
      return NextResponse.json(
        { success: false, error: 'CV non trouvé' },
        { status: 404 }
      );
    }

    const cvId = existingCV.id;

    // Build update object
    const cvUpdate: Record<string, unknown> = {};
    if (body.personalInfo) cvUpdate.personal_info = body.personalInfo;
    if (body.workExperience !== undefined) cvUpdate.has_work_exp = body.workExperience.hasWorkExperience;
    if (body.skills) cvUpdate.skills = body.skills;
    if (body.languages) cvUpdate.languages = body.languages;
    if (body.hobbies) cvUpdate.hobbies = body.hobbies;
    if (body.template) cvUpdate.template = body.template;

    // Update main CV record
    if (Object.keys(cvUpdate).length > 0) {
      const { error: updateError } = await supabase
        .from('cvs')
        .update(cvUpdate)
        .eq('id', cvId);

      if (updateError) {
        return NextResponse.json(
          { success: false, error: `Erreur de mise à jour: ${updateError.message}` },
          { status: 500 }
        );
      }
    }

    // Update educations (replace all)
    if (body.educations) {
      await supabase.from('educations').delete().eq('cv_id', cvId);

      if (body.educations.length > 0) {
        const educationInserts = body.educations.map((edu, index) => {
          let startDate = edu.startDate;
          let endDate = edu.ongoing ? null : edu.endDate;

          try {
            if (startDate) {
              startDate = format(parse(startDate, 'MM/yyyy', new Date()), 'MM/yyyy');
            }
            if (endDate) {
              endDate = format(parse(endDate, 'MM/yyyy', new Date()), 'MM/yyyy');
            }
          } catch {
            // Keep original format
          }

          return {
            cv_id: cvId,
            school_name: edu.schoolName,
            degree: edu.degree,
            custom_degree: edu.customDegree ?? null,
            field_of_study: edu.fieldOfStudy,
            start_date: startDate,
            end_date: endDate,
            ongoing: edu.ongoing,
            achievements: edu.achievements ?? [],
            order_index: index,
          };
        });

        await supabase.from('educations').insert(educationInserts);
      }
    }

    // Update work experiences (replace all)
    if (body.workExperience?.experiences) {
      await supabase.from('work_experiences').delete().eq('cv_id', cvId);

      if (body.workExperience.experiences.length > 0) {
        const workInserts = body.workExperience.experiences.map((exp, index) => {
          let startDate = exp.startDate;
          let endDate = exp.ongoing ? null : exp.endDate;

          try {
            if (startDate) {
              startDate = format(parse(startDate, 'MM/yyyy', new Date()), 'MM/yyyy');
            }
            if (endDate) {
              endDate = format(parse(endDate, 'MM/yyyy', new Date()), 'MM/yyyy');
            }
          } catch {
            // Keep original format
          }

          return {
            cv_id: cvId,
            company_name: exp.companyName,
            position: exp.position,
            location: exp.location ?? null,
            start_date: startDate,
            end_date: endDate,
            ongoing: exp.ongoing ?? false,
            responsibilities: exp.responsibilities ?? [],
            order_index: index,
          };
        });

        await supabase.from('work_experiences').insert(workInserts);
      }
    }

    return NextResponse.json({
      success: true,
      data: { userId, cvId },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du CV' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE - Delete CV by userId
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = await createClient();

    // Find CV
    const { data: cv, error: findError } = await supabase
      .from('cvs')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (findError || !cv) {
      return NextResponse.json(
        { success: false, error: 'CV non trouvé' },
        { status: 404 }
      );
    }

    // Delete CV (cascades to educations and work_experiences via FK)
    const { error: deleteError } = await supabase
      .from('cvs')
      .delete()
      .eq('id', cv.id);

    if (deleteError) {
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur lors de la suppression du CV' },
      { status: 500 }
    );
  }
}

