import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import {
  TextField,
  Grid,
  Typography,
  Divider,
  IconButton,
  Chip,
  Box,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

const proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Langue maternelle'];
const skillLevels = {
  '1': 'Débutant',
  '2': 'Intermédiaire',
  '3': 'Expérimenté',
  '4': 'Avancé',
  '5': 'Maîtrise parfaite',
};
const testOptions = ['ETHS', 'TOEFL', 'IELTS', 'Cambridge', 'Autres'];

const CombinedForm = () => {
  const { values, setFieldValue } = useFormikContext();
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [customTestName, setCustomTestName] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState({ language: '', proficiency: '', testName: '', testScore: '' });
  const [newSkill, setNewSkill] = useState({ skillName: '', level: '' });
  const [newHobby, setNewHobby] = useState('');
  const [languageName, setLanguageName] = useState('');
  const [errors, setErrors] = useState({ skills: {} });


  const handleDialogOpen = () => {
    if (languageName && !languageDialogOpen) {
      setCurrentLanguage({ language: languageName, proficiency: '', testName: '', testScore: '' });
      setLanguageDialogOpen(true);
    }
  };

 const handleAddLanguage = () => {
    if (currentLanguage.language && currentLanguage.proficiency) {
      const newLanguages = [...values.languages, currentLanguage];
      setFieldValue('languages', newLanguages);
      setCurrentLanguage({ language: '', proficiency: '', testName: '', testScore: '' }); // Reset the language fields
      setLanguageName(''); // Clear the TextField for language name
      setLanguageDialogOpen(false); // Close the dialog
    }
  };
  
  // Handles the selection of a proficiency level or a language test
  const handleSelectChange = (field, value) => {
    setCurrentLanguage({ ...currentLanguage, [field]: value });

    // If "Autres" is selected for test, prompt for custom test name
    if (field === 'testName' && value === 'Autres') {
      setLanguageDialogOpen(true);
    }
  };

  // Handles adding a new skill or hobby
  const handleNewItem = (e, item, setItem, fieldName) => {
    e.preventDefault();
    if (item.skillName && item.level) {
      const updatedItems = [...values[fieldName], item];
      setFieldValue(fieldName, updatedItems);
      setItem({ skillName: '', level: '' }); // For skills
    } else if (item.trim()) {
      const updatedItems = [...values[fieldName], item];
      setFieldValue(fieldName, updatedItems);
      setItem(''); // For hobbies
    }
  };

  // Opens the dialog to add a language with its details
  const handleOpenLanguageDialog = () => {
    setLanguageDialogOpen(true);
  };

  // Closes the dialog and resets the current language details
  const handleCloseLanguageDialog = () => {
    setLanguageDialogOpen(false);
    setCurrentLanguage({ language: '', proficiency: '', testName: '', testScore: '' });
    setCustomTestName('');
  };


  const handleAddSkill = () => {
    // Check if both skillName and level have values before adding
    if (newSkill.skillName && newSkill.level) {
      const newSkills = [...values.skills, newSkill];
      setFieldValue('skills', newSkills);
      setNewSkill({ skillName: '', level: '' }); // Reset the skill input
    }
  };

  const isSkillError = (field) => {
    return Boolean(errors.skills && errors.skills[values.skills.length] && errors.skills[values.skills.length][field]);
  };



  // Removes an item from the languages, skills, or hobbies list
  const handleRemoveItem = (fieldName, index) => {
    const updatedItems = values[fieldName].filter((_, i) => i !== index);
    setFieldValue(fieldName, updatedItems);
  };

  return (
    <Grid container spacing={2} component="form" onSubmit={(e) => e.preventDefault()}>
      {/* Languages Section */}
      <Grid item xs={12}>
        <Typography variant="h6">Langues</Typography>
        <Divider style={{ margin: '20px 0' }} />
        <Box display="flex" alignItems="center">
          <TextField
            label="Ajouter Langue"
            variant="outlined"
            size="small"
            value={currentLanguage.language}
            onChange={(e) => setCurrentLanguage({ ...currentLanguage, language: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleAddLanguage(e)}
            style={{ width: '30%' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddLanguage} edge="end">
                    <AddCircleOutlineIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box display="flex" flexWrap="wrap" alignItems="center" ml={2}>
            {values.languages.map((language, index) => (
              <Chip
                key={index}
                label={`${language.language} (${language.proficiency}) ${language.testName ? `- ${language.testName}` : ''} ${language.testScore ? `: ${language.testScore}` : ''}`}
                onDelete={() => handleRemoveItem('languages', index)}
                deleteIcon={<CancelIcon />}
                color="primary"
                variant="outlined"
                style={{ marginRight: '8px', marginBottom: '8px' }}
              />
            ))}
          </Box>
        </Box>
      </Grid>

      {/* Dialog for Adding/Editing Languages */}
      <Dialog open={languageDialogOpen} onClose={handleCloseLanguageDialog}>
        <DialogTitle>Ajouter une langue</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Niveau de maîtrise</InputLabel>
            <Select
              value={currentLanguage.proficiency}
              onChange={(e) => handleSelectChange('proficiency', e.target.value)}
              label="Niveau de maîtrise"
            >
              {proficiencyLevels.map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Test</InputLabel>
            <Select
              value={currentLanguage.testName}
              onChange={(e) => handleSelectChange('testName', e.target.value)}
              label="Test"
            >
              {testOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {currentLanguage.testName === 'Autres' && (
            <TextField
              margin="dense"
              label="Nom du Test Personnalisé"
              type="text"
              fullWidth
              value={customTestName}
              onChange={(e) => setCustomTestName(e.target.value)}
            />
          )}
          <TextField
            margin="dense"
            label="Score du Test"
            type="text"
            fullWidth
            value={currentLanguage.testScore}
            onChange={(e) => setCurrentLanguage({ ...currentLanguage, testScore: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLanguageDialog}>Annuler</Button>
          <Button onClick={handleAddLanguage}>Sauvegarder</Button>
        </DialogActions>
      </Dialog>

      {/* Skills Section */}
      <Grid item xs={12}>
        <Typography variant="h6">Compétences</Typography>
        <Divider style={{ margin: '20px 0' }} />
        <Box display="flex" alignItems="center">
          <TextField
            label="Compétence"
            variant="outlined"
            size="small"
            value={newSkill.skillName}
            onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
            error={isSkillError('skillName')}
            helperText={isSkillError('skillName') && errors.skills[values.skills.length].skillName}
            style={{ width: '30%' }}
          />
          <FormControl variant="outlined" size="small" style={{ width: '30%', marginLeft: '10px' }} error={isSkillError('level')}>
            <InputLabel>Niveau</InputLabel>
            <Select
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
              label="Niveau"
            >
              {Object.entries(skillLevels).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{isSkillError('level') && errors.skills[values.skills.length].level}</FormHelperText>
          </FormControl>
          <IconButton onClick={handleAddSkill} size="large">
            <AddCircleOutlineIcon />
          </IconButton>
          <Box display="flex" flexWrap="wrap" alignItems="center" ml={2}>
            {values.skills.map((skill, index) => (
              <Chip
                key={index}
                label={`${skill.skillName} (${skillLevels[skill.level]})`}
                onDelete={() => handleRemoveItem('skills', index)}
                deleteIcon={<CancelIcon />}
                color="primary"
                variant="outlined"
                style={{ marginRight: '8px', marginBottom: '8px' }}
              />
            ))}
          </Box>
        </Box>
      </Grid>


      {/* Hobbies Section */}
      <Grid item xs={12}>
        <Typography variant="h6">Loisirs</Typography>
        <Divider style={{ margin: '20px 0' }} />
        <Box display="flex" alignItems="center">
          <TextField
            label="Ajouter Loisir"
            variant="outlined"
            size="small"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNewItem(e, newHobby, setNewHobby, 'hobbies')}
            style={{ width: '30%' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={(e) => handleNewItem(e, newHobby, setNewHobby, 'hobbies')} edge="end">
                    <AddCircleOutlineIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box display="flex" flexWrap="wrap" alignItems="center" ml={2}>
            {values.hobbies.map((hobby, index) => (
              <Chip
                key={index}
                label={hobby}
                onDelete={() => handleRemoveItem('hobbies', index)}
                deleteIcon={<CancelIcon />}
                color="primary"
                variant="outlined"
                style={{ marginRight: '8px', marginBottom: '8px' }}
              />
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CombinedForm;