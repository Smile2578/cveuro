import { getSupabaseClient } from './client';
import type { 
  CV, 
  Education, 
  WorkExperience, 
  PersonalInfo,
  Skill,
  Language,
  CVTemplate 
} from '@/types/cv.types';

// ============================================================================
// TYPES
// ============================================================================

export interface CreateCVData {
  userId: string;
  personalInfo: PersonalInfo;
  education: Education[];
  hasWorkExp: boolean;
  workExperience: WorkExperience[];
  skills: Skill[];
  languages: Language[];
  hobbies: string[];
  template: CVTemplate;
}

export interface UpdateCVData extends Partial<Omit<CreateCVData, 'userId'>> {
  id: string;
}

// ============================================================================
// CV CRUD OPERATIONS
// ============================================================================

export async function createCV(data: CreateCVData): Promise<CV> {
  const supabase = getSupabaseClient();
  
  // 1. Create main CV record
  const { data: cv, error: cvError } = await supabase
    .from('cvs')
    .insert({
      user_id: data.userId,
      personal_info: data.personalInfo,
      has_work_exp: data.hasWorkExp,
      skills: data.skills,
      languages: data.languages,
      hobbies: data.hobbies,
      template: data.template,
    })
    .select()
    .single();

  if (cvError) throw new Error(`Failed to create CV: ${cvError.message}`);

  // 2. Create education entries
  if (data.education.length > 0) {
    const educationInserts = data.education.map((edu, index) => ({
      cv_id: cv.id,
      school_name: edu.schoolName,
      degree: edu.degree,
      custom_degree: edu.customDegree,
      field_of_study: edu.fieldOfStudy,
      start_date: edu.startDate,
      end_date: edu.endDate,
      ongoing: edu.ongoing,
      achievements: edu.achievements || [],
      order_index: index,
    }));

    const { error: eduError } = await supabase
      .from('educations')
      .insert(educationInserts);

    if (eduError) throw new Error(`Failed to create education: ${eduError.message}`);
  }

  // 3. Create work experience entries
  if (data.workExperience.length > 0) {
    const workInserts = data.workExperience.map((work, index) => ({
      cv_id: cv.id,
      company_name: work.companyName,
      position: work.position,
      location: work.location,
      start_date: work.startDate,
      end_date: work.endDate,
      ongoing: work.ongoing,
      responsibilities: work.responsibilities || [],
      order_index: index,
    }));

    const { error: workError } = await supabase
      .from('work_experiences')
      .insert(workInserts);

    if (workError) throw new Error(`Failed to create work experience: ${workError.message}`);
  }

  // 4. Fetch complete CV with relations
  return fetchCV(cv.id);
}

export async function fetchCV(cvId: string): Promise<CV> {
  const supabase = getSupabaseClient();

  // Fetch CV with education and work experience
  const { data: cv, error: cvError } = await supabase
    .from('cvs')
    .select('*')
    .eq('id', cvId)
    .single();

  if (cvError) throw new Error(`Failed to fetch CV: ${cvError.message}`);

  const { data: educations } = await supabase
    .from('educations')
    .select('*')
    .eq('cv_id', cvId)
    .order('order_index');

  const { data: workExperiences } = await supabase
    .from('work_experiences')
    .select('*')
    .eq('cv_id', cvId)
    .order('order_index');

  // Transform database format to app format
  return {
    id: cv.id,
    userId: cv.user_id,
    personalInfo: cv.personal_info as PersonalInfo,
    education: (educations || []).map(transformEducation),
    hasWorkExp: cv.has_work_exp,
    workExperience: (workExperiences || []).map(transformWorkExperience),
    skills: cv.skills as Skill[],
    languages: cv.languages as Language[],
    hobbies: cv.hobbies as string[],
    template: cv.template as CVTemplate,
    createdAt: cv.created_at,
    updatedAt: cv.updated_at,
  };
}

export async function fetchCVByUserId(userId: string): Promise<CV | null> {
  const supabase = getSupabaseClient();

  const { data: cv, error } = await supabase
    .from('cvs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw new Error(`Failed to fetch CV: ${error.message}`);
  }

  return fetchCV(cv.id);
}

export async function updateCV(data: UpdateCVData): Promise<CV> {
  const supabase = getSupabaseClient();
  const { id, ...updates } = data;

  // 1. Update main CV record
  const cvUpdate: Record<string, unknown> = {};
  if (updates.personalInfo) cvUpdate.personal_info = updates.personalInfo;
  if (updates.hasWorkExp !== undefined) cvUpdate.has_work_exp = updates.hasWorkExp;
  if (updates.skills) cvUpdate.skills = updates.skills;
  if (updates.languages) cvUpdate.languages = updates.languages;
  if (updates.hobbies) cvUpdate.hobbies = updates.hobbies;
  if (updates.template) cvUpdate.template = updates.template;

  if (Object.keys(cvUpdate).length > 0) {
    const { error: cvError } = await supabase
      .from('cvs')
      .update(cvUpdate)
      .eq('id', id);

    if (cvError) throw new Error(`Failed to update CV: ${cvError.message}`);
  }

  // 2. Update education (replace all)
  if (updates.education) {
    // Delete existing
    await supabase.from('educations').delete().eq('cv_id', id);
    
    // Insert new
    if (updates.education.length > 0) {
      const educationInserts = updates.education.map((edu, index) => ({
        cv_id: id,
        school_name: edu.schoolName,
        degree: edu.degree,
        custom_degree: edu.customDegree,
        field_of_study: edu.fieldOfStudy,
        start_date: edu.startDate,
        end_date: edu.endDate,
        ongoing: edu.ongoing,
        achievements: edu.achievements || [],
        order_index: index,
      }));

      const { error } = await supabase.from('educations').insert(educationInserts);
      if (error) throw new Error(`Failed to update education: ${error.message}`);
    }
  }

  // 3. Update work experience (replace all)
  if (updates.workExperience) {
    // Delete existing
    await supabase.from('work_experiences').delete().eq('cv_id', id);
    
    // Insert new
    if (updates.workExperience.length > 0) {
      const workInserts = updates.workExperience.map((work, index) => ({
        cv_id: id,
        company_name: work.companyName,
        position: work.position,
        location: work.location,
        start_date: work.startDate,
        end_date: work.endDate,
        ongoing: work.ongoing,
        responsibilities: work.responsibilities || [],
        order_index: index,
      }));

      const { error } = await supabase.from('work_experiences').insert(workInserts);
      if (error) throw new Error(`Failed to update work experience: ${error.message}`);
    }
  }

  return fetchCV(id);
}

export async function deleteCV(cvId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('cvs')
    .delete()
    .eq('id', cvId);

  if (error) throw new Error(`Failed to delete CV: ${error.message}`);
}

// ============================================================================
// HELPERS
// ============================================================================

interface EducationRow {
  id: string;
  school_name: string;
  degree: string;
  custom_degree: string | null;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  ongoing: boolean;
  achievements: string[];
}

interface WorkExperienceRow {
  id: string;
  company_name: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  ongoing: boolean;
  responsibilities: string[];
}

function transformEducation(row: EducationRow): Education {
  return {
    id: row.id,
    schoolName: row.school_name,
    degree: row.degree,
    customDegree: row.custom_degree,
    fieldOfStudy: row.field_of_study,
    startDate: row.start_date,
    endDate: row.end_date,
    ongoing: row.ongoing,
    achievements: row.achievements,
  };
}

function transformWorkExperience(row: WorkExperienceRow): WorkExperience {
  return {
    id: row.id,
    companyName: row.company_name,
    position: row.position,
    location: row.location ?? undefined,
    startDate: row.start_date,
    endDate: row.end_date,
    ongoing: row.ongoing,
    responsibilities: row.responsibilities,
  };
}

