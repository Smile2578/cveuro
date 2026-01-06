'use client';

import { useTranslations } from 'next-intl';
import { 
  GraduationCap, 
  Briefcase, 
  Globe, 
  Wrench,
  Heart
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CVData {
  personalInfo?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    zip?: string;
    sex?: string;
    dateofBirth?: string;
    nationality?: { code: string; label: string }[];
    linkedIn?: string;
    personalWebsite?: string;
    [key: string]: unknown;
  };
  education?: Array<{
    schoolName: string;
    degree: string;
    customDegree?: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    ongoing?: boolean;
    achievements?: string[];
  }>;
  workExperience?: Array<{
    companyName: string;
    position: string;
    location: string;
    startDate: string;
    endDate?: string;
    ongoing?: boolean;
    responsibilities?: string[];
  }>;
  skills?: Array<{
    skillName: string;
    level: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
    testName?: string;
    testScore?: string;
  }>;
  hobbies?: string[];
  [key: string]: unknown;
}

interface LiveCVProps {
  data: CVData;
  locale: string;
}

export default function LiveCV({ data, locale }: LiveCVProps) {
  const t = useTranslations('cvedit');

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    if (dateString === 'En cours') return t('common.ongoing');
    
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return new Intl.DateTimeFormat(locale, { 
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      }).format(date);
    } else if (parts.length === 2) {
      const [month, year] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return new Intl.DateTimeFormat(locale, { 
        year: 'numeric', 
        month: 'long'
      }).format(date);
    }
    return dateString;
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    if (phone.match(/^0[67]/)) {
      return phone.replace(/^0/, '+33 ');
    }
    return phone;
  };

  const formatNationality = (nationality: string, sex: string) => {
    if (sex === 'male' && locale === 'fr') {
      return nationality.replace(/e$/, '');
    }
    return nationality;
  };

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-red-100 text-red-700 border-red-300';
      case 'advanced': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'intermediate': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'Native':
      case 'C2': return 'bg-red-100 text-red-700 border-red-300';
      case 'C1': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'B2': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const renderPersonalInfo = () => {
    if (!data?.personalInfo) return null;
    const { personalInfo } = data;

    return (
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {personalInfo.firstname} {personalInfo.lastname}
        </h1>
        <p className="text-muted-foreground mb-1">
          {personalInfo.email} • {formatPhoneNumber(personalInfo.phoneNumber || '')}
        </p>
        <p className="text-foreground font-medium mb-1">
          {personalInfo.address}, {personalInfo.city} {personalInfo.zip}
        </p>
        
        {(personalInfo.linkedIn || personalInfo.personalWebsite) && (
          <div className="flex gap-4 justify-center mt-2">
            {personalInfo.linkedIn && (
              <a
                href={personalInfo.linkedIn.startsWith('http') ? personalInfo.linkedIn : `https://linkedin.com/in/${personalInfo.linkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                LinkedIn
              </a>
            )}
            {personalInfo.personalWebsite && (
              <a
                href={personalInfo.personalWebsite.startsWith('http') ? personalInfo.personalWebsite : `https://${personalInfo.personalWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                {personalInfo.personalWebsite}
              </a>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center mt-2 text-sm text-muted-foreground">
          {personalInfo.dateofBirth && (
            <span>{formatDate(personalInfo.dateofBirth)}</span>
          )}
          {personalInfo.sex && (
            <span>{t(`personalInfo.sex.${personalInfo.sex}`)}</span>
          )}
        </div>

        {personalInfo.nationality && personalInfo.nationality.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {personalInfo.nationality.map((nat, index) => (
              <Badge
                key={index}
                className="bg-gradient-to-r from-primary to-primary/70 text-white"
              >
                {formatNationality(nat.label, personalInfo.sex || '')}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderEducation = () => {
    if (!data?.education?.length) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5" /> {t('sections.education')}
        </h2>
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={index} className={cn(index < data.education!.length - 1 && "border-b pb-4")}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {edu.degree === 'other' ? edu.customDegree : t(`education.degree.options.${edu.degree}`)}
                  </h3>
                  <p className="text-primary">{edu.schoolName}</p>
                  <p className="text-sm text-muted-foreground">{edu.fieldOfStudy}</p>
                </div>
                <span className="text-sm text-muted-foreground font-medium min-w-[120px] text-right">
                  {formatDate(edu.startDate)} - {edu.ongoing ? t('common.ongoing') : formatDate(edu.endDate || '')}
                </span>
              </div>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul className="mt-2 space-y-1 pl-4">
                  {edu.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-muted-foreground relative before:content-['•'] before:absolute before:-left-3 before:text-primary">
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkExperience = () => {
    if (!data?.workExperience?.length) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5" /> {t('sections.experience')}
        </h2>
        <div className="space-y-4">
          {data.workExperience.map((exp, index) => (
            <div key={index} className={cn(index < data.workExperience!.length - 1 && "border-b pb-4")}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{exp.position}</h3>
                  <p className="text-primary">{exp.companyName}</p>
                  <p className="text-sm text-muted-foreground">{exp.location}</p>
                </div>
                <span className="text-sm text-muted-foreground font-medium min-w-[120px] text-right">
                  {formatDate(exp.startDate)} - {exp.ongoing ? t('common.ongoing') : formatDate(exp.endDate || '')}
                </span>
              </div>
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="mt-2 space-y-1 pl-4">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="text-sm text-muted-foreground relative before:content-['•'] before:absolute before:-left-3 before:text-primary">
                      {resp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (!data?.skills?.length) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2 mb-4">
          <Wrench className="w-5 h-5" /> {t('sections.skills')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className={cn("px-3 py-1", getSkillColor(skill.level))}
            >
              {skill.skillName} ({t(`skills.levels.${skill.level}`)})
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    if (!data?.languages?.length) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5" /> {t('sections.languages')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.languages.map((lang, index) => (
            <Badge
              key={index}
              variant="outline"
              className={cn("px-3 py-1", getProficiencyColor(lang.proficiency))}
            >
              {lang.language} - {lang.proficiency}
              {lang.testName && lang.testScore && ` (${lang.testName}: ${lang.testScore})`}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderHobbies = () => {
    if (!data?.hobbies?.length) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5" /> {t('sections.hobbies')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.hobbies.map((hobby, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-3 py-1 bg-primary/10 text-primary border-primary/30"
            >
              {hobby}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  if (!data) return null;

  return (
    <Card className="p-6 md:p-8 max-w-[210mm] mx-auto bg-white" id="live-cv-container">
      {renderPersonalInfo()}
      
      <div className="border-t border-primary/30 my-4" />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Colonne gauche - Compétences, Langues, Hobbies */}
        <div className="w-full md:w-1/3 space-y-6">
          {renderLanguages()}
          {renderSkills()}
          {renderHobbies()}
        </div>
        
        {/* Colonne droite - Formation, Expérience */}
        <div className="w-full md:w-2/3 md:border-l md:pl-6 space-y-6">
          {renderEducation()}
          {renderWorkExperience()}
        </div>
      </div>
    </Card>
  );
}

