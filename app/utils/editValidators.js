import { z } from 'zod';

// Expressions régulières
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
const monthYearRegex = /^\d{2}\/\d{4}$/;
const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{8,14}$/;
const nameRegex = /^[a-zA-ZÀ-ÿ\s-]+$/;
const zipRegex = /^(\d{5}|\d{4}-\d{3})$/;

export const createEditValidators = (t) => {
  // Validateurs de base avec traduction pour personalInfo
  // Identity Form
  const firstNameValidator = z.string()
    .min(2, { message: t('personalInfo.firstName.required') })
    .regex(nameRegex, { message: t('personalInfo.firstName.format') })
    .max(50, { message: t('personalInfo.firstName.maxLength') });

  const lastNameValidator = z.string()
    .min(2, { message: t('personalInfo.lastName.required') })
    .regex(nameRegex, { message: t('personalInfo.lastName.format') })
    .max(50, { message: t('personalInfo.lastName.maxLength') });

  // Contact Form
  const emailValidator = z.string()
    .min(1, { message: t('personalInfo.email.required') })
    .email({ message: t('personalInfo.email.format') });

  const phoneValidator = z.string()
    .min(1, { message: t('personalInfo.phone.required') })
    .regex(phoneRegex, { message: t('personalInfo.phone.format') });

  // Info Form
  const dateOfBirthValidator = z.string()
    .min(1, { message: t('personalInfo.dateOfBirth.required') })
    .refine((value) => dateRegex.test(value), { message: t('personalInfo.dateOfBirth.format') });

  const nationalityValidator = z.array(z.object({
    code: z.string(),
    label: z.string()
  }))
  .min(1, { message: t('personalInfo.nationality.required') });

  // Address Form
  const addressValidator = z.string()
    .min(1, { message: t('personalInfo.address.required') });

  const cityValidator = z.string()
    .min(1, { message: t('personalInfo.city.required') });

  const zipValidator = z.string()
    .min(1, { message: t('personalInfo.zip.required') })
    .regex(zipRegex, { message: t('personalInfo.zip.format') });

  // Social Form
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
      { message: t('personalInfo.url.invalid') }
    );

  // Autres validateurs
  const dateValidator = z.string()
    .min(1, { message: t('date.required') })
    .refine((value) => monthYearRegex.test(value), { message: t('date.format') });

  // Schémas de validation par section
  const personalInfoValidators = {
    // Identity Form
    firstname: firstNameValidator,
    lastname: lastNameValidator,
    sex: z.string().optional(),

    // Contact Form
    email: emailValidator,
    phoneNumber: phoneValidator,

    // Info Form
    dateofBirth: dateOfBirthValidator,
    nationality: nationalityValidator,

    // Address Form
    address: addressValidator,
    city: cityValidator,
    zip: zipValidator,

    // Social Form
    linkedIn: urlValidator,
    personalWebsite: urlValidator
  };

  const educationValidators = {
    schoolName: z.string()
      .min(2, { message: t('education.school.required') }),
    degree: z.string()
      .min(2, { message: t('education.degree.required') }),
    startDate: dateValidator,
    endDate: z.string()
      .nullable()
      .optional(),
    ongoing: z.boolean().default(false),
    fieldOfStudy: z.string()
      .min(2, { message: t('education.fieldOfStudy.required') }),
    achievements: z.array(z.string()
      .min(1, { message: t('education.achievements.required') }))
      .optional()
      .transform(val => val || [])
  };

  const workExperienceValidators = {
    companyName: z.string()
      .min(2, { message: t('experience.company.required') }),
    position: z.string()
      .min(2, { message: t('experience.position.required') }),
    location: z.string()
      .min(2, { message: t('experience.location.required') }),
    startDate: dateValidator,
    endDate: z.string()
      .nullable()
      .optional(),
    ongoing: z.boolean().default(false),
    responsibilities: z.array(z.string()
      .min(1, { message: t('experience.responsibilities.required') }))
      .optional()
      .transform(val => val || [])
  };

  const skillValidators = {
    skillName: z.string()
      .min(1, { message: t('skills.name.required') }),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
      required_error: t('skills.level.required'),
      invalid_type_error: t('skills.level.required')
    })
  };

  const languageValidators = {
    language: z.string()
      .min(2, { message: t('languages.name.required') }),
    proficiency: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'], {
      required_error: t('languages.proficiency.required'),
      invalid_type_error: t('languages.proficiency.required')
    })
  };

  // Fonction pour créer un schéma de validation partiel basé sur les champs modifiés
  const createPartialSchema = (section) => {
    let validators;
    switch (section) {
      case 'personalInfo':
        validators = personalInfoValidators;
        break;
      case 'education':
        return z.array(z.object(educationValidators))
          .min(1, { message: t('education.required') })
          .superRefine((educations, ctx) => {
            educations.forEach((education, index) => {
              if (!education.ongoing) {
                if (!education.endDate) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('education.endDate.required'),
                    path: [`${index}.endDate`]
                  });
                }
              }
            });
          });
      case 'workExperience':
        return z.array(z.object(workExperienceValidators))
          .min(1, { message: t('experience.required') })
          .superRefine((experiences, ctx) => {
            experiences.forEach((exp, index) => {
              if (!exp.ongoing) {
                if (!exp.endDate) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('experience.endDate.required'),
                    path: [`${index}.endDate`]
                  });
                }
              }
            });
          });
      case 'skills':
        return z.array(z.object(skillValidators))
          .min(1, { message: t('combined.skills.required') });
      case 'languages':
        return z.array(z.object(languageValidators))
          .min(1, { message: t('combined.languages.required') });
      case 'hobbies':
        return z.array(z.string()
          .min(2, { message: t('combined.hobbies.required') }))
          .min(1, { message: t('combined.hobbies.required') });
      default:
        return z.any();
    }

    return z.object(validators);
  };

  return {
    createPartialSchema,
    personalInfoValidators,
    educationValidators,
    workExperienceValidators,
    skillValidators,
    languageValidators
  };
};