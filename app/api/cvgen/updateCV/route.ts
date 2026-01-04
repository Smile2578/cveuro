// app/api/cvgen/updateCV/route.ts
// Compatibility route for updating CV
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parse, format } from 'date-fns';
import type { PersonalInfo, Education, WorkExperience, Skill, Language, CVTemplate } from '@/types/cv.types';

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

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

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
            if (startDate) startDate = format(parse(startDate, 'MM/yyyy', new Date()), 'MM/yyyy');
            if (endDate) endDate = format(parse(endDate, 'MM/yyyy', new Date()), 'MM/yyyy');
          } catch {
            // Keep original
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
            if (startDate) startDate = format(parse(startDate, 'MM/yyyy', new Date()), 'MM/yyyy');
            if (endDate) endDate = format(parse(endDate, 'MM/yyyy', new Date()), 'MM/yyyy');
          } catch {
            // Keep original
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

