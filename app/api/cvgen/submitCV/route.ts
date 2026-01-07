// app/api/cvgen/submitCV/route.ts
// Creates a new CV for the authenticated user (anonymous or permanent)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parse, format } from 'date-fns';
import type { PersonalInfo, Education, WorkExperience, Skill, Language, CVTemplate } from '@/types/cv.types';

interface CVRequestBody {
  personalInfo: PersonalInfo;
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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: CVRequestBody = await request.json();

    if (!body.personalInfo) {
      return NextResponse.json(
        { success: false, error: 'Les informations personnelles sont requises' },
        { status: 400 }
      );
    }

    // Get the authenticated user (anonymous or permanent)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non authentifié. Veuillez vous reconnecter.' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Format dates
    const formattedPersonalInfo = { ...body.personalInfo };
    if (formattedPersonalInfo.dateofBirth) {
      try {
        const dobParsed = parse(formattedPersonalInfo.dateofBirth, 'dd/MM/yyyy', new Date());
        formattedPersonalInfo.dateofBirth = format(dobParsed, 'dd/MM/yyyy');
      } catch {
        // Keep original format
      }
    }

    // Create CV record
    const { data: cv, error: cvError } = await supabase
      .from('cvs')
      .insert({
        user_id: userId,
        personal_info: formattedPersonalInfo,
        has_work_exp: body.workExperience?.hasWorkExperience ?? false,
        skills: body.skills ?? [],
        languages: body.languages ?? [],
        hobbies: body.hobbies ?? [],
        template: body.template ?? 'light',
      })
      .select('id, user_id')
      .single();

    if (cvError) {
      console.error('CV creation error:', cvError);
      return NextResponse.json(
        { success: false, error: `Erreur lors de la création du CV: ${cvError.message}` },
        { status: 500 }
      );
    }

    // Create education entries
    if (body.educations && body.educations.length > 0) {
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
          cv_id: cv.id,
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

      const { error: eduError } = await supabase.from('educations').insert(educationInserts);
      if (eduError) {
        console.error('Education creation error:', eduError);
      }
    }

    // Create work experience entries
    if (body.workExperience?.experiences && body.workExperience.experiences.length > 0) {
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
          cv_id: cv.id,
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

      const { error: workError } = await supabase.from('work_experiences').insert(workInserts);
      if (workError) {
        console.error('Work experience creation error:', workError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          userId: cv.user_id,
          cvId: cv.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur lors de la création du CV' },
      { status: 500 }
    );
  }
}
