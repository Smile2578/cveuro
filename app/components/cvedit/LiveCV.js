import React, { useCallback } from 'react';
import { Typography, Box, Divider, Grid, Paper } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import theme from '@/app/theme';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const LiveCV = ({ cvData, setCvData }) => {
  const onDragEnd = useCallback((result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    // Handle reordering of sections or items within sections
    if (source.droppableId === destination.droppableId) {
      // Reordering items within the same section
      const section = source.droppableId;
      const items = reorder(cvData[section], source.index, destination.index);
      setCvData({ ...cvData, [section]: items });
    }
  }, [cvData, setCvData]);

  return (
    <Box padding={3} boxShadow={2} minHeight={'100%'} maxWidth={'210mm'} style={{ margin: 'auto', backgroundColor: 'white' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ color: theme.palette.primary.main }}>
        Curriculum Vitae
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Informations personnelles</Typography>
          <Typography>{cvData.personalInfo.firstname} {cvData.personalInfo.lastname}</Typography>
          <Typography>{cvData.personalInfo.dateofBirth}</Typography>
          <Typography>Sexe: {cvData.personalInfo.sex}</Typography>
          <Typography>{cvData.personalInfo.nationality}</Typography>
          {cvData.personalInfo.linkedIn && <Typography>LinkedIn: {cvData.personalInfo.linkedIn}</Typography>}
          {cvData.personalInfo.personalWebsite && <Typography>Site Web: {cvData.personalInfo.personalWebsite}</Typography>}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Contact</Typography>
          <Typography>{cvData.personalInfo.email}</Typography>
          <Typography>{cvData.personalInfo.phoneNumber}</Typography>
          <Typography>{cvData.personalInfo.address}</Typography>
          <Typography>{cvData.personalInfo.city}</Typography>
          <Typography>{cvData.personalInfo.zip}</Typography>
        </Grid>
      </Grid>
      
      <Divider style={{ margin: '20px 0' }} />

      {/* Education Section */}
      <Typography variant="h6">Éducation</Typography>
      {cvData.education.map((edu, index) => (
        <Box key={index} marginBottom={2}>
          <Typography>{edu.startDate} - {edu.endDate || "En cours"}: {edu.schoolName}, {edu.degree}, {edu.fieldOfStudy}</Typography>
          {edu.achievements.length > 0 && <Typography>Réalisations: {edu.achievements.join(', ')}</Typography>}
        </Box>
      ))}

      {/* Work Experience Section */}
      <Typography variant="h6">Expérience professionnelle</Typography>
      {cvData.workExperience.map((work, index) => (
        <Box key={index} marginBottom={2}>
          <Typography>{work.startDate} - {work.endDate || "En cours"}: {work.companyName}, {work.position}, {work.location}</Typography>
          <Typography>Responsabilités: {work.responsibilities.join(', ')}</Typography>
        </Box>
      ))}

      {/* Skills, Languages, and Hobbies */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Box>
          <Typography variant="h6">Langues</Typography>
          {cvData.languages.map((lang, index) => (
            <Typography key={index}>{lang.language}: {lang.proficiency} {lang.testName && `(${lang.testName}: ${lang.testScore})`}</Typography>
          ))}
        </Box>
        <Box>
          <Typography variant="h6">Compétences</Typography>
          {cvData.skills.map((skill, index) => (
            <Typography key={index}>{skill.skillName}: {skill.level}</Typography>
          ))}
        </Box>
      </Box>

      <Typography variant="h6" marginTop={2}>Loisirs</Typography>
      {cvData.hobbies.map((hobby, index) => (
        <Typography key={index}>{hobby}</Typography>
      ))}
    </Box>
  );
};

export default LiveCV;