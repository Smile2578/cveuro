'use client';

import { memo } from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@alexandernanberg/react-pdf-renderer';
import { useTranslations } from 'next-intl';
import './fonts';
import { registerFonts } from './fonts';

// S'assurer que les polices sont bien enregistrées
registerFonts();

// Types
interface PersonalInfo {
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
}

interface Education {
  schoolName: string;
  degree: string;
  customDegree?: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  ongoing?: boolean;
  achievements?: string[];
}

interface WorkExperience {
  companyName: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  ongoing?: boolean;
  responsibilities?: string[];
}

interface Skill {
  skillName: string;
  level: string;
}

interface Language {
  language: string;
  proficiency: string;
  testName?: string;
  testScore?: string;
}

interface CVData {
  personalInfo?: PersonalInfo;
  education?: Education[];
  workExperience?: WorkExperience[];
  skills?: Skill[];
  languages?: Language[];
  hobbies?: string[];
}

interface CVDocumentProps {
  data: CVData;
  locale: string;
}

// Créer des styles qui imitent Material UI
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontWeight: 400,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
    position: 'relative',
    paddingTop: 8,
  },
  logo: {
    position: 'absolute',
    top: 2,
    left: 0,
    width: '10%',
    height: '14%',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Roboto',
    fontWeight: 700,
    marginBottom: 3,
    color: '#1976d2',
    letterSpacing: 0.5,
  },
  contactInfo: {
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: 500,
    marginBottom: 3,
    color: '#424242',
  },
  section: {
    marginBottom: 15,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  },
  sectionContent: {
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 500,
    color: '#1976d2',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  languageChip: {
    borderRadius: 12,
    padding: '8 12',
    margin: '4 4',
    fontSize: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  skillChip: {
    borderRadius: 12,
    padding: '8 12',
    margin: '4 4',
    fontSize: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  chipMainText: {
    marginBottom: 2,
    textAlign: 'center',
  },
  chipSubText: {
    fontSize: 9,
    textAlign: 'center',
    opacity: 0.9,
  },
  hobbyChip: {
    borderRadius: 12,
    padding: '6 12',
    margin: '3 3',
    fontSize: 10,
    backgroundColor: '#f3e5f5',
    color: '#9c27b0',
  },
  gridContainer: {
    flexDirection: 'row',
    marginTop: 10,
    flexGrow: 1,
  },
  leftColumn: {
    width: '30%',
    paddingRight: 20,
    alignItems: 'center',
  },
  rightColumn: {
    width: '70%',
    paddingLeft: 20,
    borderLeft: 1,
    borderColor: '#e0e0e0',
  },
  experienceItem: {
    marginBottom: 12,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  experienceContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#000',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#1976d2',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
    textAlign: 'right',
    minWidth: 150,
  },
  bulletPoint: {
    fontSize: 10,
    color: '#666',
    marginLeft: 8,
    marginTop: 2,
    lineHeight: 1.4,
  },
  divider: {
    borderBottom: 0.5,
    borderColor: '#e0e0e0',
    marginVertical: 8,
    width: '50%',
    alignSelf: 'center',
  },
  link: {
    fontSize: 10,
    textDecoration: 'none',
    marginHorizontal: 6,
    fontWeight: 500,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 3,
  },
  personalDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  personalDetailText: {
    fontSize: 10,
    color: '#424242',
    marginHorizontal: 4,
    fontWeight: 500,
  },
  nationalityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 3,
    marginBottom: 4,
  },
  nationalityChip: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: '2 8',
    margin: '1 3',
    fontSize: 9,
    color: '#1976d2',
    fontWeight: 500,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const CVDocument = memo(function CVDocument({ data, locale }: CVDocumentProps) {
  const t = useTranslations('cvedit');

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    if (dateString === 'En cours') return t('common.ongoing');
    
    try {
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
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const getLanguageChipStyle = (proficiency: string) => {
    const baseStyle = { ...styles.languageChip };
    switch (proficiency) {
      case 'Native':
      case 'C2':
        return { ...baseStyle, backgroundColor: '#ffebee', color: '#d32f2f' };
      case 'C1':
        return { ...baseStyle, backgroundColor: '#fff3e0', color: '#ed6c02' };
      case 'B2':
        return { ...baseStyle, backgroundColor: '#e3f2fd', color: '#1976d2' };
      default:
        return { ...baseStyle, backgroundColor: '#f5f5f5', color: '#757575' };
    }
  };

  const getSkillChipStyle = (level: string) => {
    const baseStyle = { ...styles.skillChip };
    switch (level) {
      case 'expert':
        return { ...baseStyle, backgroundColor: '#ffebee', color: '#d32f2f' };
      case 'advanced':
        return { ...baseStyle, backgroundColor: '#fff3e0', color: '#ed6c02' };
      case 'intermediate':
        return { ...baseStyle, backgroundColor: '#e3f2fd', color: '#1976d2' };
      default:
        return { ...baseStyle, backgroundColor: '#f5f5f5', color: '#757575' };
    }
  };

  if (!data) {
    return null;
  }

  try {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* En-tête avec informations personnelles */}
          <View style={styles.header}>
            <Image
              src="/logo.png"
              style={styles.logo}
            />
            <Text style={styles.name}>
              {data?.personalInfo?.firstname || ''}{' '}{data?.personalInfo?.lastname || ''}
            </Text>

            {/* Date de naissance et Sexe */}
            {(data?.personalInfo?.dateofBirth || data?.personalInfo?.sex) && (
              <View style={styles.personalDetails}>
                {data?.personalInfo?.dateofBirth && (
                  <Text style={styles.personalDetailText}>
                    {formatDate(data.personalInfo.dateofBirth)}
                  </Text>
                )}
                {data?.personalInfo?.dateofBirth && data?.personalInfo?.sex && (
                  <Text style={styles.personalDetailText}>•</Text>
                )}
                {data?.personalInfo?.sex && (
                  <Text style={styles.personalDetailText}>
                    {t(`personalInfo.sex.${data.personalInfo.sex}`)}
                  </Text>
                )}
              </View>
            )}

            {/* Email et Téléphone */}
            {(data?.personalInfo?.email || data?.personalInfo?.phoneNumber) && (
              <Text style={styles.contactInfo}>
                {data?.personalInfo?.email || ''}{data?.personalInfo?.email && data?.personalInfo?.phoneNumber ? ' • ' : ''}{data?.personalInfo?.phoneNumber || ''}
              </Text>
            )}

            {/* Adresse */}
            {(data?.personalInfo?.address || data?.personalInfo?.city || data?.personalInfo?.zip) && (
              <Text style={styles.contactInfo}>
                {[
                  data?.personalInfo?.address,
                  data?.personalInfo?.city,
                  data?.personalInfo?.zip
                ].filter(Boolean).join(', ')}
              </Text>
            )}

            {/* Nationalité */}
            {data?.personalInfo?.nationality && data.personalInfo.nationality.length > 0 && (
              <View style={styles.nationalityContainer}>
                {data.personalInfo.nationality.map((nat, index) => (
                  <Text key={index} style={styles.nationalityChip}>
                    {nat.label}
                  </Text>
                ))}
              </View>
            )}

            {/* Liens */}
            {(data?.personalInfo?.linkedIn || data?.personalInfo?.personalWebsite) && (
              <View style={styles.linksContainer}>
                {data?.personalInfo?.linkedIn && (
                  <Text style={styles.link}>
                    {data.personalInfo.linkedIn}
                  </Text>
                )}
                {data?.personalInfo?.personalWebsite && (
                  <Text style={styles.link}>
                    {data.personalInfo.personalWebsite}
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.gridContainer}>
            <View style={styles.leftColumn}>
              {/* Languages */}
              {data?.languages && data.languages.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitle}>
                    <Image src="/icons/language.png" style={styles.sectionIcon} />
                    <Text>{t('sections.languages')}</Text>
                  </View>
                  <View style={styles.chipsContainer}>
                    {data.languages.map((lang, index) => (
                      <View key={index} style={getLanguageChipStyle(lang.proficiency)}>
                        <Text style={styles.chipMainText}>
                          {`${lang.language} - ${lang.proficiency}`}
                        </Text>
                        {lang.testName && lang.testScore && (
                          <Text style={styles.chipSubText}>
                            {`${lang.testName}: ${lang.testScore}`}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Skills */}
              {data?.skills && data.skills.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitle}>
                    <Image src="/icons/skill.png" style={styles.sectionIcon} />
                    <Text>{t('sections.skills')}</Text>
                  </View>
                  <View style={styles.chipsContainer}>
                    {data.skills.map((skill, index) => (
                      <View key={index} style={getSkillChipStyle(skill.level)}>
                        <Text style={styles.chipMainText}>
                          {skill.skillName}
                        </Text>
                        <Text style={styles.chipSubText}>
                          {t(`skills.levels.${skill.level}`)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Hobbies */}
              {data?.hobbies && data.hobbies.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionContent}>
                    <View style={styles.sectionTitle}>
                      <Image src="/icons/hobby.png" style={styles.sectionIcon} />
                      <Text>{t('sections.hobbies')}</Text>
                    </View>
                    <View style={styles.chipsContainer}>
                      {data.hobbies.map((hobby, index) => (
                        <View key={index} style={styles.hobbyChip}>
                          <Text>{hobby}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.rightColumn}>
              {/* Education */}
              {data?.education && data.education.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitle}>
                    <Image src="/icons/education.png" style={styles.sectionIcon} />
                    <Text>{t('sections.education')}</Text>
                  </View>
                  {data.education.map((edu, index) => (
                    <View key={index} style={styles.experienceItem}>
                      <View style={styles.experienceHeader}>
                        <View style={styles.experienceContent}>
                          <Text style={styles.itemTitle}>
                            {edu.degree === 'other' ? edu.customDegree : t(`education.degree.options.${edu.degree}`)}
                          </Text>
                          <Text style={styles.itemSubtitle}>{edu.schoolName}</Text>
                          <Text style={styles.bulletPoint}>{edu.fieldOfStudy}</Text>
                        </View>
                        <Text style={styles.itemDate}>
                          {formatDate(edu.startDate)} - {edu.ongoing ? t('common.ongoing') : formatDate(edu.endDate)}
                        </Text>
                      </View>
                      {edu.achievements?.map((achievement, i) => (
                        <Text key={i} style={styles.bulletPoint}>• {achievement}</Text>
                      ))}
                      {index < data.education!.length - 1 && <View style={styles.divider} />}
                    </View>
                  ))}
                </View>
              )}

              {/* Work Experience */}
              {data?.workExperience && data.workExperience.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionContent}>
                    <View style={styles.sectionTitle}>
                      <Image src="/icons/work.png" style={styles.sectionIcon} />
                      <Text>{t('sections.experience')}</Text>
                    </View>
                    {data.workExperience.map((exp, index) => (
                      <View key={index} style={styles.experienceItem}>
                        <View style={styles.experienceHeader}>
                          <View style={styles.experienceContent}>
                            <Text style={styles.itemTitle}>{exp.position}</Text>
                            <Text style={styles.itemSubtitle}>{exp.companyName}</Text>
                            <Text style={styles.bulletPoint}>{exp.location}</Text>
                          </View>
                          <Text style={styles.itemDate}>
                            {formatDate(exp.startDate)} - {exp.ongoing ? t('common.ongoing') : formatDate(exp.endDate)}
                          </Text>
                        </View>
                        {exp.responsibilities?.map((responsibility, i) => (
                          <Text key={i} style={styles.bulletPoint}>• {responsibility}</Text>
                        ))}
                        {index < data.workExperience!.length - 1 && <View style={styles.divider} />}
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </Page>
      </Document>
    );
  } catch (error) {
    console.error('Error rendering PDF:', error);
    return null;
  }
});

export default CVDocument;

