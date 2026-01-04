// types/cv.types.ts
// Types centraux pour le CV - compatible avec Zod, React Hook Form et Supabase

// ============================================================================
// PERSONAL INFO
// ============================================================================

export interface Nationality {
  code: string;
  label: string;
}

export interface PersonalInfo {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  dateofBirth: string; // Format: DD/MM/YYYY
  nationality: Nationality[];
  sex: string;
  address: string;
  city: string;
  zip: string;
  linkedIn?: string;
  personalWebsite?: string;
}

// ============================================================================
// EDUCATION
// ============================================================================

export interface Education {
  id?: string;
  schoolName: string;
  degree: string;
  customDegree?: string | null;
  fieldOfStudy: string;
  startDate: string; // Format: MM/YYYY
  endDate?: string | null; // Format: MM/YYYY
  ongoing: boolean;
  achievements?: string[];
}

// ============================================================================
// WORK EXPERIENCE
// ============================================================================

export interface WorkExperience {
  id?: string;
  companyName: string;
  position: string;
  location?: string;
  startDate: string; // Format: MM/YYYY
  endDate?: string | null; // Format: MM/YYYY
  ongoing?: boolean;
  responsibilities?: string[];
}

export interface WorkExperienceForm {
  hasWorkExperience: boolean;
  experiences: WorkExperience[];
}

// ============================================================================
// SKILLS, LANGUAGES, HOBBIES
// ============================================================================

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  id?: string;
  skillName: string;
  level?: SkillLevel;
}

export type LanguageProficiency = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';

export interface Language {
  id?: string;
  language: string;
  proficiency: LanguageProficiency;
  testName?: string;
  testScore?: string;
}

export interface CombinedFormData {
  skills: Skill[];
  languages: Language[];
  hobbies: string[];
}

// ============================================================================
// CV COMPLETE
// ============================================================================

export type CVTemplate = 'light' | 'dark' | 'mix';

export interface CV {
  id?: string;
  userId: string;
  personalInfo: PersonalInfo;
  education: Education[];
  hasWorkExp: boolean;
  workExperience: WorkExperience[];
  skills: Skill[];
  languages: Language[];
  hobbies: string[];
  template: CVTemplate;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ============================================================================
// FORM DATA (for React Hook Form)
// ============================================================================

export interface CVFormData {
  personalInfo: PersonalInfo;
  educations: Education[];
  workExperience: WorkExperienceForm;
  skills: Skill[];
  languages: Language[];
  hobbies: string[];
}

// ============================================================================
// STORE STATE (for Zustand)
// ============================================================================

export type FormStep = 
  | 'welcome'
  | 'personal-info' 
  | 'education' 
  | 'work-experience' 
  | 'combined';

export interface CVStore {
  // Navigation state
  currentStep: FormStep;
  currentSubStep: number;
  
  // Form data (stored by step)
  formData: Partial<CVFormData>;
  
  // CV state
  currentCV: CV | null;
  cvId: string | null;
  
  // Template
  template: CVTemplate;
  
  // Actions
  setStep: (step: FormStep) => void;
  setSubStep: (subStep: number) => void;
  setFormData: <K extends keyof CVFormData>(key: K, data: CVFormData[K]) => void;
  setCurrentCV: (cv: CV | null) => void;
  setCvId: (id: string | null) => void;
  setTemplate: (template: CVTemplate) => void;
  resetStore: () => void;
}

// ============================================================================
// API TYPES (for Supabase)
// ============================================================================

export interface CreateCVInput {
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

export interface UpdateCVInput extends Partial<Omit<CV, 'id' | 'userId' | 'createdAt'>> {
  id: string;
}

// ============================================================================
// SUPABASE DATABASE TYPES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      cvs: {
        Row: {
          id: string;
          user_id: string;
          personal_info: PersonalInfo;
          has_work_exp: boolean;
          skills: Skill[];
          languages: Language[];
          hobbies: string[];
          template: CVTemplate;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cvs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['cvs']['Insert']>;
      };
      educations: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['educations']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['educations']['Insert']>;
      };
      work_experiences: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['work_experiences']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['work_experiences']['Insert']>;
      };
    };
  };
}

