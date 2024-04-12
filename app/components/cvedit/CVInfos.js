import React, { useState } from 'react';
import {
  Accordion,
  Button,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Box,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const CVInfos = ({ cvData, setCvData }) => {
  const [editField, setEditField] = useState({});
  const [editValues, setEditValues] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedTemplate, setSelectedTemplate] = useState('template1.pdf'); // Default template

  const onSelectTemplate = async (templatePath) => {
    setSelectedTemplate(templatePath);
    const updatedCvData = { ...cvData, template: templatePath };
  
    // API call to update the CV in the database
    try {
      const userId = localStorage.getItem('cvUserId'); // Ensure you have the correct way to retrieve the user ID
      const response = await fetch(`/api/cvedit/updateCV?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCvData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update CV template');
      }
      // Optionally update local CV data state
      setCvData(updatedCvData);
      console.log('Template updated successfully');
    } catch (error) {
      console.error('Error updating template:', error);
      // Handle error (e.g., show a notification)
    }
  };


  const theme = useTheme();

  const templates = [
    { id: 'template1', name: 'Template 1', path: 'template1.pdf' },
  ];

  const formatDate = (date, isOngoing) => {
    if (isOngoing) return 'En Cours';
    const parts = date.split('-');
  
    // Check how many parts the date has to handle different formats
    if (parts.length === 3) {
      // Assuming format is YYYY-MM-DD
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    } else if (parts.length === 2) {
      // Assuming format is YYYY-MM
      const [year, month] = parts;
      return `${month}/${year}`;
    } else if (parts.length === 1) {
      // Assuming format is just YYYY or any single part
      return parts[0];
    } else {
      // If date format is unexpected or empty
      return date;
    }
  };
  
  const renderPeriodField = (section, index, startDate, endDate, ongoing) => {
    const period = `${formatDate(startDate, false)} - ${formatDate(endDate, ongoing)}`;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <Typography variant="body1" sx={{ minWidth: '150px', color: theme.palette.text.primary }}>Période:</Typography>
        <Typography variant="body1" sx={{ flexGrow: 1, color: theme.palette.primary.main }}>{period}</Typography>
      </Box>
    );
  };

  const handleEditClick = (section, key, value) => {
    setEditField({ ...editField, [`${section}.${key}`]: true });
    setEditValues({ ...editValues, [`${section}.${key}`]: value });
  };

  const handleSave = async (section, key) => {
    const value = editValues[`${section}.${key}`];
    // Prepare updated data for submission
    let updatedSectionData = cvData[section];
    if (section === 'personalInfo') {
      updatedSectionData = { ...cvData.personalInfo, [key]: value };
    } else {
      updatedSectionData = cvData[section].map((item, index) =>
        index.toString() === key ? { ...item, ...value } : item
      );
    }

    const updatedCvData = { ...cvData, [section]: updatedSectionData };

    try {
      const userId = localStorage.getItem('cvUserId');
      const response = await fetch(`/api/cvedit/updateCV?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCvData),
      });

      if (!response.ok) throw new Error('Failed to update CV');
      
      setCvData(updatedCvData);
      setEditField({ ...editField, [`${section}.${key}`]: false }); // Turn off editing for this field
      setSnackbar({ open: true, message: 'Modification enregistrée avec succès!', severity: 'success' });
    } catch (error) {
      console.error('Save error:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la connexion au serveur.', severity: 'error' });
    }
  };

  const renderEditableField = (section, key, label, value, isDate = false) => {
    const fieldKey = `${section}.${key}`;
  
    // Function to handle saving or closing the field on blur
    const handleBlur = () => {
      // Use a timeout to delay execution until after the save button click is processed
      setTimeout(() => {
        // Ensure we only proceed if the editField corresponds to the current field
        if (editField[fieldKey]) {
          setEditField((prev) => ({ ...prev, [fieldKey]: false }));
        }
      }, 100); // A delay of 100ms should be enough to catch the save click event
    };
  
    return (
      <Box key={fieldKey} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px', '&:hover svg': { visibility: 'visible' } }}>
        <Typography variant="body1" sx={{ minWidth: '150px', color: theme.palette.text.primary }}>{label}:</Typography>
        {editField[fieldKey] ? (
          <TextField
            fullWidth
            variant="outlined"
            type={isDate ? 'date' : 'text'}
            value={editValues[fieldKey]}
            onChange={(e) => setEditValues({ ...editValues, [fieldKey]: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission on enter
                handleSave(section, key);
              }
            }}
            InputLabelProps={isDate ? { shrink: true } : undefined}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <Typography variant="body1" sx={{ flexGrow: 1, color: theme.palette.primary.main }}>{value}</Typography>
        )}
        <IconButton
          size="small"
          sx={{ ml: 1, visibility: editField[fieldKey] ? 'visible' : 'hidden' }}
          onClick={() => handleSave(section, key)}
        >
          <SaveIcon />
        </IconButton>
        {!editField[fieldKey] && (
          <IconButton
            size="small"
            sx={{ ml: 1, visibility: 'hidden' }}
            onMouseEnter={(e) => e.currentTarget.style.visibility = 'visible'}
            onMouseLeave={(e) => e.currentTarget.style.visibility = 'hidden'}
            onClick={() => handleEditClick(section, key, value)}
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>
    );
  };
  

  if (!cvData) return <CircularProgress />;

  return (
    <Box>
      {/* Personal Information Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Informations Personnelles</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: theme.palette.primary.main }}>
          {renderEditableField('personalInfo', 'firstname', 'Prénom', cvData.personalInfo.firstname)}
          {renderEditableField('personalInfo', 'lastname', 'Nom', cvData.personalInfo.lastname)}
          {renderEditableField('personalInfo', 'birthdate', 'Date de naissance', cvData.personalInfo.dateofBirth, true)}
          {renderEditableField('personalInfo', 'sex', 'Sexe', cvData.personalInfo.sex)}
          {renderEditableField('personalInfo', 'nationality', 'Nationalité', cvData.personalInfo.nationality)}
          {renderEditableField('personalInfo', 'placeofBirth', 'Lieu de naissance', cvData.personalInfo.placeofBirth)}  
          {renderEditableField('personalInfo', 'address', 'Adresse', cvData.personalInfo.address)}
          {renderEditableField('personalInfo', 'city', 'Ville', cvData.personalInfo.city)}
          {renderEditableField('personalInfo', 'zip', 'Code Postal', cvData.personalInfo.zip)}
          {renderEditableField('personalInfo', 'email', 'Email', cvData.personalInfo.email)}  
          {renderEditableField('personalInfo', 'phoneNumber', 'Téléphone', cvData.personalInfo.phoneNumber)}
          {renderEditableField('personalInfo', 'linkedin', 'LinkedIn', cvData.personalInfo.linkedin)}
          {renderEditableField('personalInfo', 'personalWebsite', 'Site Web', cvData.personalInfo.personalWebsite)}
        </AccordionDetails>
      </Accordion>

      {/* Education Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Éducation</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: theme.palette.primary.main }}>
          {cvData.education.map((edu, index) => (
           <Box key={`edu-${index}`} sx={{ border: '1px solid lightgray', borderRadius: '8px', padding: '16px', marginBottom: '8px' }}>
              {renderEditableField('education', `${index}.schoolName`, 'Établissement', edu.schoolName)}
              {renderEditableField('education', `${index}.degree`, 'Diplôme', edu.degree)}
              {renderEditableField('education', `${index}.fieldOfStudy`, 'Spécialité', edu.fieldOfStudy)}
              {renderPeriodField('education', index, edu.startDate, edu.endDate, edu.ongoing)}
              {renderEditableField('education', `${index}.achievements`, 'Réalisations', edu.achievements.join(', '))}
              </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Work Experience Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Expérience Professionnelle</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: theme.palette.primary.main }}>
          {cvData.workExperience.map((work, index) =>
            <Box key={`work-${index}`} sx={{ border: '1px solid lightgray', borderRadius: '8px', padding: '16px', marginBottom: '8px' }}>
              {renderEditableField('workExperience', `${index}.companyName`, 'Entreprise', work.companyName)}
              {renderEditableField('workExperience', `${index}.position`, 'Poste', work.position)}
              {renderEditableField('workExperience', `${index}.location`, 'Lieu', work.location)}
              {renderPeriodField('workExperience', index, work.startDate, work.endDate, work.ongoing)}
              {renderEditableField('workExperience', `${index}.responsibilities`, 'Responsabilités', work.responsibilities.join(', '))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

   {/* Languages Section */}
   <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Langues</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: theme.palette.primary.main }}>
          {cvData.languages.map((lang, index) =>
            <Box key={`lang-${index}`} sx={{ marginBottom: '8px' }}>
              {renderEditableField('languages', `${index}.language`, 'Langue', lang.language)}
              {renderEditableField('languages', `${index}.proficiency`, 'Niveau de maîtrise', lang.proficiency)}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Skills Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Compétences</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: theme.palette.primary.main }}>
          {cvData.skills.map((skill, index) =>
            <Box key={`skill-${index}`} sx={{ marginBottom: '8px' }}>
              <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
                {renderEditableField('skills', `${index}.skillName`, 'Compétence', skill.skillName)}
                {renderEditableField('skills', `${index}.proficiency`, 'Niveau de maîtrise', skill.proficiency)}
              </Typography>
            </Box>
          )}
          {/* Assuming skills are just a list of strings, if more detail is needed, adjust accordingly */}
        </AccordionDetails>
      </Accordion>

      {/* Hobbies Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Loisirs</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: theme.palette.primary.main }}>
          {cvData.hobbies.map((hobby, index) =>
            <Box key={`hobby-${index}`} sx={{ marginBottom: '8px' }}>
              <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
                {hobby}
              </Typography>
            </Box>
          )}
          {/* Assuming hobbies are just a list of strings, if more detail is needed, adjust accordingly */}
        </AccordionDetails>
      </Accordion>

      {/* Template Selection Section */}
     <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Sélection de modèle</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {templates.map((template) => (
              <Button
                key={template.id}
                variant={selectedTemplate === template.path ? 'outlined' : 'outlined'}
                onClick={() => onSelectTemplate(template.path)}
              >
                {template.name}
              </Button>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CVInfos;