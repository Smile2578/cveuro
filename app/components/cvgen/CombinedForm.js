import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import {
  TextField, Grid, Typography, Divider, IconButton, Chip, Box, Select,
  MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormControl, InputLabel, InputAdornment, FormHelperText, Checkbox, FormControlLabel, useTheme, useMediaQuery,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import theme from '@/app/theme';


const proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Langue maternelle'];
const skillLevels = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert', 'Maîtrise complète'];


const CombinedForm = () => {
  const { values, setFieldValue } = useFormikContext();
  const [isTestTaken, setIsTestTaken] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({ language: '', proficiency: '', testName: '', testScore: '' });
  const [newSkill, setNewSkill] = useState({ skillName: '', level: '' });
  const [newHobby, setNewHobby] = useState('');
  const [errors, setErrors] = useState({ skills: {} });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));



  const addValidItem = (item, arrayName) => {
    if (arrayName === 'languages') {
      // Only check for language and proficiency for languages
      if (item.language && item.proficiency) {
        const newArray = [...values[arrayName], item];
        setFieldValue(arrayName, newArray);
        resetItemState(arrayName);
      }
    } else if (arrayName === 'skills') {
      // Ensure both skillName and level are provided for skills
      if (item.skillName && item.level) {
        const newArray = [...values[arrayName], item];
        setFieldValue(arrayName, newArray);
        resetItemState(arrayName);
      } else if (!item.level) {
        setErrors({ skills: { ...errors.skills, level: 'Veuillez sélectionner un niveau' } });
      }
    } else if (arrayName === 'hobbies' && item.trim()) {
      // For hobbies, just check if the item is not empty
      const newArray = [...values[arrayName], item];
      setFieldValue(arrayName, newArray);
      resetItemState(arrayName);
    }
  };
  
  const resetItemState = (arrayName) => {
    if (arrayName === 'languages') {
      setCurrentLanguage({ language: '', proficiency: '', testName: '', testScore: '' }); // Reset after adding
      setCustomTestName(''); // Clear the custom test name as well
    } else if (arrayName === 'skills') {
      setNewSkill({ skillName: '', level: '' }); // Reset skill input fields
      setErrors({ skills: {} }); // Clear skill errors
    } else if (arrayName === 'hobbies') {
      setNewHobby(''); // Reset the hobby input field
    }
  };



const handleAddSkill = () => {
  addValidItem(newSkill, 'skills');
};

const handleNewItem = (e, item, setItem, fieldName) => {
  e.preventDefault();
  addValidItem(item, fieldName);
};

const handleLanguageSubmit = () => {
  if (!currentLanguage.language || !currentLanguage.proficiency) {
    setErrors({
      ...errors,
      languages: 'La langue et le niveau de maîtrise sont obligatoires',
    });
  } else {
    finalizeLanguageAddition();
  }
};

const finalizeLanguageAddition = () => {
  const newArray = [...values.languages, currentLanguage];
  setFieldValue('languages', newArray);
  resetLanguageForm();
  setErrors({...errors, languages: ''});
};

const resetLanguageForm = () => {
  setCurrentLanguage({ language: '', proficiency: '', testName: '', testScore: '' });
  setIsTestTaken(false);
  setTestDialogOpen(false);
};

const handleTestDialogSave = () => {
  // Save the language along with test details
  finalizeLanguageAddition();
  setTestDialogOpen(false);
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
    <Grid container spacing={2} onSubmit={(e) => e.preventDefault()}>
      {/* Languages Section */}
      <Grid item xs={12}>
        <Typography variant="h6" color={theme.palette.primary.main}>Langues* (min. 1)</Typography>
        <Divider style={{ margin: '1px 0 40px 0', width: '180px' }} />
         <Box flexDirection={isMobile ? 'column' : 'row'} display="flex" gap={2} alignItems="center">
          <TextField
            label="Langue"
            variant="outlined"
            size="small"
            style={{ width: '30%' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                handleLanguageSubmit(); // Add language
              }
            }}
            value={currentLanguage.language}
            onChange={(e) => setCurrentLanguage({ ...currentLanguage, language: e.target.value })}
            error={Boolean(errors.languages)}
            helperText={errors.languages}
          />
          <FormControl size="small" style={{ width: '30%' }}>
            <InputLabel>Niveau de maîtrise</InputLabel>
            <Select
              value={currentLanguage.proficiency}
              onChange={(e) => setCurrentLanguage({ ...currentLanguage, proficiency: e.target.value })}
              label="Niveau de maîtrise"
              error={Boolean(errors.languages)}
              style={{ width: '105%' }}
            >
              {proficiencyLevels.map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.languages}</FormHelperText>
          </FormControl>
          <FormControlLabel
            control={<Checkbox checked={isTestTaken} onChange={(e) => { setIsTestTaken(e.target.checked); setTestDialogOpen(e.target.checked); }} />}
            label="J'ai passé un test pour cette langue"
          />
         <IconButton onClick={handleLanguageSubmit} size="small">
            Ajouter la langue
            <AddCircleOutlineIcon  style={{ marginLeft: '10px' }}/>
          </IconButton>
        </Box>
        {values.languages.map((language, index) => (
          <Chip
            key={index}
            label={`${language.language} (${language.proficiency}) ${language.testName ? `- ${language.testName}` : ''} ${language.testScore ? `: ${language.testScore}` : ''}`}
            onDelete={() => { handleRemoveItem('languages', index) }}
            color="primary"
            variant="outlined"
            style={{ margin: '5px' }}
          />
        ))}
      </Grid>

      {/* Test Details Dialog */}
      <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)}>
        <DialogTitle>Test de compétence</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du test"
            type="text"
            fullWidth
            value={currentLanguage.testName}
            onChange={(e) => setCurrentLanguage({ ...currentLanguage, testName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Score du test"
            type="text"
            fullWidth
            value={currentLanguage.testScore}
            onChange={(e) => setCurrentLanguage({ ...currentLanguage, testScore: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleTestDialogSave}>Sauvegarder</Button>
        </DialogActions>
      </Dialog>
  
      {/* Skills Section */}
      <Grid item xs={12}>
        <Divider style={{ margin: '20px 0' }} />
        <Typography variant="h6" color={theme.palette.primary.main}>Compétences</Typography>
        <Divider style={{ margin: '1px 0 40px 0', width: '140px' }} />
        <Box flexDirection={isMobile ? 'column' : 'row'} display="flex" gap={2} alignItems="center">
          <TextField
            label="Compétence (ex: Word, Excel, Photoshop, etc.)"
            variant="outlined"
            size="small"
            value={newSkill.skillName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                handleAddSkill(); // Add the skill
              }
            }}
            onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
            error={isSkillError('skillName')}
            helperText={isSkillError('skillName') && errors.skills[values.skills.length].skillName}
            style={{ width: '50%' }} // Adjust width accounting for the gap
          />
          <FormControl variant="outlined" size="small" style={{ width: 'calc(30% - 10px)' }} error={isSkillError('level')}>
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
          <IconButton onClick={handleAddSkill} size="small">
            Ajouter la compétence
            <AddCircleOutlineIcon style={{ marginLeft: '10px' }}/>
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
        <Divider style={{ margin: '20px 0' }} />
        <Typography variant="h6" color={theme.palette.primary.main}>Loisirs</Typography>
        <Divider style={{ margin: '1px 0 40px 0', width: '70px' }} />
        <Box flexDirection={isMobile ? 'column' : 'row'} display="flex" gap={2} alignItems="center">
          <TextField
            label="Loisir(s) (ex: Lecture, Musique, Sport, etc.)"
            variant="outlined"
            size="small"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNewItem(e, newHobby, setNewHobby, 'hobbies')}
            style={{ width: '50%' }}
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