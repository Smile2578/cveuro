// app/utils/validators.ts

import { z } from 'zod';

// Regular expressions
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
const monthYearRegex = /^\d{2}\/\d{4}$/;
const phoneRegex = /^[+]?[\d\s-]{1,30}$/;
const nameRegex = /^[a-zA-ZÀ-ÿ\s-]+$/;
const zipRegex = /^(\d{5}|\d{4}-\d{3,4})$/;

export type TranslationFunction = (key: string) => string;

export const createValidators = (t: TranslationFunction) => {
  // Base validators with translation
  const nameValidator = z.string()
    .min(2, { message: t('name.minLength') })
    .max(50, { message: t('name.maxLength') })
    .regex(nameRegex, { message: t('name.format') });

  const lastNameValidator = z.string()
    .min(2, { message: t('name.minLength') })
    .max(50, { message: t('name.maxLength') })
    .regex(nameRegex, { message: t('name.format') });

  const emailValidator = z.string()
    .min(1, { message: t('email.required') })
    .email({ message: t('email.format') })
    .max(100, { message: t('personalInfo.email.maxLength') });

  const phoneValidator = z.string()
    .min(1, { message: t('phone.required') })
    .regex(phoneRegex, { message: t('phone.format') });

  const dateOfBirthValidator = z.string()
    .min(1, { message: t('personalInfo.dateOfBirth.required') })
    .refine((value) => dateRegex.test(value), { message: t('personalInfo.dateOfBirth.format') });

  const urlValidator = z.string()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => {
        if (!value) return true;
        try {
          new URL(value.startsWith('http') ? value : `https://${value}`);
          return true;
        } catch {
          return false;
        }
      },
      { message: t('url.invalid') }
    );

  const zipValidator = z.string()
    .min(1, { message: t('personalInfo.zip.required') })
    .regex(zipRegex, { message: t('personalInfo.zip.format') });

  const addressValidator = z.string()
    .min(1, { message: t('personalInfo.address.required') })
    .max(200, { message: t('personalInfo.address.maxLength') });

  const cityValidator = z.string()
    .min(1, { message: t('personalInfo.city.required') })
    .max(100, { message: t('personalInfo.city.maxLength') });

  // Personal info schema
  const personalInfoSchema = z.object({
    firstname: nameValidator,
    lastname: lastNameValidator,
    email: emailValidator,
    phoneNumber: phoneValidator,
    dateofBirth: dateOfBirthValidator,
    nationality: z.array(z.object({
      code: z.string(),
      label: z.string()
    })).min(1, { message: t('personalInfo.nationality.required') }),
    sex: z.string().min(1, { message: t('personalInfo.sex.required') }),
    address: addressValidator,
    city: cityValidator,
    zip: zipValidator,
    linkedIn: urlValidator,
    personalWebsite: urlValidator
  });

  // Education schema
  const educationSchema = z.array(z.object({
    schoolName: z.string()
      .min(2, { message: t('education.school.minLength') })
      .max(100, { message: t('education.school.maxLength') }),
    degree: z.string()
      .min(2, { message: t('education.degree.minLength') })
      .max(100, { message: t('education.degree.maxLength') }),
    startDate: z.string()
      .min(1, { message: t('education.startDate.required') })
      .refine(
        (value) => monthYearRegex.test(value),
        { message: t('education.startDate.format') }
      ),
    endDate: z.string().nullable(),
    ongoing: z.boolean().default(false),
    fieldOfStudy: z.string()
      .min(2, { message: t('education.fieldOfStudy.minLength') })
      .max(100, { message: t('education.fieldOfStudy.maxLength') }),
    customDegree: z.string()
      .nullable()
      .optional()
      .superRefine((val, ctx) => {
        if (val && val.trim() !== '') {
          if (val.length < 2) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              minimum: 2,
              type: "string",
              inclusive: true,
              message: t('education.customDegree.minLength')
            });
          }
          if (val.length > 100) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              maximum: 100,
              type: "string",
              inclusive: true,
              message: t('education.customDegree.maxLength')
            });
          }
        }
      }),
    achievements: z.array(
      z.string()
        .max(500, { message: t('education.achievements.maxLength') })
    ).optional().default([])
  }))
  .min(1, { message: t('education.required') })
  .superRefine((educations, ctx) => {
    educations.forEach((education, index) => {
      // Achievements validation - check for empty strings
      if (education.achievements && education.achievements.length > 0) {
        education.achievements.forEach((achievement, achievementIdx) => {
          if (!achievement || achievement.trim() === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('education.achievements.required'),
              path: [`${index}.achievements.${achievementIdx}`]
            });
          }
        });
      }

      // Custom degree validation
      if (education.degree === 'other') {
        if (!education.customDegree || education.customDegree.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('education.customDegree.required'),
            path: [`${index}.customDegree`]
          });
        }
      }

      // End date validation
      if (!education.ongoing) {
        if (!education.endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('education.endDate.required'),
            path: [`${index}.endDate`]
          });
          return;
        }

        if (!monthYearRegex.test(education.endDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('education.endDate.format'),
            path: [`${index}.endDate`]
          });
          return;
        }

        // Chronology validation
        if (monthYearRegex.test(education.startDate) && monthYearRegex.test(education.endDate)) {
          const [startMonth, startYear] = education.startDate.split('/').map(Number);
          const [endMonth, endYear] = education.endDate.split('/').map(Number);
          
          if (endYear < startYear || (endYear === startYear && endMonth < startMonth)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('education.dates.chronology'),
              path: [`${index}.endDate`]
            });
          }
        }
      }
    });
  });

  // Work experience schema
  const workExperienceSchema = z.object({
    hasWorkExperience: z.boolean(),
    experiences: z.array(z.object({
      companyName: z.string()
        .min(2, { message: t('experience.company.minLength') })
        .max(100, { message: t('experience.company.maxLength') }),
      position: z.string()
        .min(2, { message: t('experience.position.minLength') })
        .max(100, { message: t('experience.position.maxLength') }),
      location: z.string()
        .min(2, { message: t('experience.location.minLength') })
        .max(100, { message: t('experience.location.maxLength') })
        .optional(),
      startDate: z.string()
        .min(1, { message: t('date.required') })
        .refine((value) => monthYearRegex.test(value), { message: t('date.format') }),
      endDate: z.string()
        .optional()
        .nullable(),
      ongoing: z.boolean().optional(),
      responsibilities: z.array(z.string()
        .min(10, { message: t('experience.responsibilities.minLength') })
        .max(500, { message: t('experience.responsibilities.maxLength') })
      ).optional().default([])
    })).superRefine((experiences, ctx) => {
      if (experiences.length > 0) {
        experiences.forEach((exp, idx) => {
          // End date validation when ongoing is false
          if (!exp.ongoing) {
            if (!exp.endDate) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('date.required'),
                path: [`${idx}.endDate`]
              });
            } else if (!monthYearRegex.test(exp.endDate)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('date.format'),
                path: [`${idx}.endDate`]
              });
            }
          }

          // Date validation
          if (!exp.ongoing && exp.startDate && exp.endDate) {
            const [startMonth, startYear] = exp.startDate.split('/').map(Number);
            const [endMonth, endYear] = exp.endDate.split('/').map(Number);
            if (endYear < startYear || (endYear === startYear && endMonth < startMonth)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('date.endBeforeStart'),
                path: [`${idx}.endDate`]
              });
            }
          }

          // Non-empty responsibilities validation
          if (exp.responsibilities && exp.responsibilities.length > 0) {
            exp.responsibilities.forEach((resp, respIdx) => {
              if (!resp || resp.trim() === '') {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t('experience.responsibilities.required'),
                  path: [`${idx}.responsibilities.${respIdx}`]
                });
              }
            });
          }
        });
      }
    })
  }).superRefine((data, ctx) => {
    if (data.hasWorkExperience && (!data.experiences || data.experiences.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('experience.required'),
        path: ['experiences']
      });
    }
  });

  // Combined validation schema for skills, languages and hobbies
  const combinedValidationSchema = z.object({
    skills: z.array(z.object({
      skillName: z.string()
        .min(1, { message: t('skills.name.minLength') })
        .max(50, { message: t('skills.name.maxLength') }),
      level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
        required_error: t('skills.level.required'),
        invalid_type_error: t('skills.level.invalid')
      }).optional()
    }))
    .optional()
    .default([]),

    languages: z.array(z.object({
      language: z.string()
        .min(2, { message: t('combined.languages.name.minLength') })
        .max(50, { message: t('combined.languages.name.maxLength') }),
      proficiency: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'], {
        required_error: t('combined.languages.proficiency.required'),
        invalid_type_error: t('combined.languages.proficiency.invalid')
      }),
      testName: z.string().optional(),
      testScore: z.string().optional()
    }))
    .min(1, { message: t('combined.languages.required') })
    .default([]),

    hobbies: z.array(z.string()
      .min(2, { message: t('combined.hobbies.minLength') })
      .max(50, { message: t('combined.hobbies.maxLength') })
    )
    .optional()
    .default([])
  });

  // Complete CV schema
  const cvSchema = z.object({
    personalInfo: personalInfoSchema,
    educations: educationSchema,
    workExperience: workExperienceSchema,
    ...combinedValidationSchema.shape
  });

  return {
    cvSchema,
    personalInfoSchema,
    educationSchema,
    workExperienceSchema,
    combinedValidationSchema
  };
};

// Date utility validators
export const dateValidators = {
  isValidDate: (dateStr: string): boolean => dateRegex.test(dateStr),
  isValidMonthYear: (dateStr: string): boolean => monthYearRegex.test(dateStr),
  isDateInRange: (dateStr: string, minYears = 16, maxYears = 100): boolean => {
    if (!dateRegex.test(dateStr)) return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    return age >= minYears && age <= maxYears;
  },
  isStartDateBeforeEndDate: (startDate: string, endDate: string): boolean => {
    if (!monthYearRegex.test(startDate) || !monthYearRegex.test(endDate)) return false;
    const [startMonth, startYear] = startDate.split('/').map(Number);
    const [endMonth, endYear] = endDate.split('/').map(Number);
    if (startYear > endYear) return false;
    if (startYear === endYear && startMonth > endMonth) return false;
    return true;
  }
};

