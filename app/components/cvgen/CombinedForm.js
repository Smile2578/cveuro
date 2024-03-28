import React from 'react';
import { useFormikContext, FieldArray } from 'formik';
import {
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  FormHelperText
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import theme from '@/app/theme';


const proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const skillLevels = {
  '1': 'Débutant',
  '2': 'Capable',
  '3': 'Intermédiaire',
  '4': 'Efficace',
  '5': 'Expérimenté',
  '6': 'Avancé',
  '7': 'Distingué',
  '8': 'Maître',
};

const CombinedForm = () => {
  const { values, setFieldValue, touched, errors } = useFormikContext();

  const handleAddField = (fieldName, newItem) => {
    setFieldValue(fieldName, [...values[fieldName], newItem]);
  };

  const handleRemoveField = (fieldName, index) => {
    const updatedItems = values[fieldName].filter((_, i) => i !== index);
    setFieldValue(fieldName, updatedItems);
  };

  return (
    <Grid container spacing={2}>
      {/* Languages Section */}
      <Grid item xs={12}>
        <Typography variant="h6" color={theme.palette.text.primary}>Langues</Typography>
      </Grid>
      <Grid item xs={12}><Divider /></Grid>
      <FieldArray name="languages">
        {() => (
          <>
            {values.languages.map((language, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name={`languages[${index}].language`}
                    label="Langue"
                    value={language.language}
                    onChange={(e) => setFieldValue(`languages[${index}].language`, e.target.value)}
                    fullWidth
                    error={touched.languages?.[index]?.language && Boolean(errors.languages?.[index]?.language)}
                    helperText={touched.languages?.[index]?.language && errors.languages?.[index]?.language}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={touched.languages?.[index]?.proficiency && Boolean(errors.languages?.[index]?.proficiency)}>
                    <InputLabel>Niveau de compétence</InputLabel>
                    <Select
                      name={`languages[${index}].proficiency`}
                      value={language.proficiency}
                      onChange={(e) => setFieldValue(`languages[${index}].proficiency`, e.target.value)}
                      displayEmpty
                    >
                      {proficiencyLevels.map((level) => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{touched.languages?.[index]?.proficiency && errors.languages?.[index]?.proficiency}</FormHelperText>
                  </FormControl>
                </Grid>
                {values.languages.length > 1 && (
                  <Grid item xs={12}>
                    <Button onClick={() => handleRemoveField('languages', index)} startIcon={<RemoveCircleOutlineIcon />}>
                      Supprimer la langue
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button onClick={() => handleAddField('languages', { language: '', proficiency: '' })} startIcon={<AddCircleOutlineIcon />}>
                    Ajouter une langue
                  </Button>
                </Grid>
              </React.Fragment>
            ))}
          </>
        )}
      </FieldArray>

       {/* Skills Section */}
       <Grid item xs={12}><Divider style={{ margin: '20px 0' }} /></Grid>
      <Grid item xs={12}>
        <Typography variant="h6" color={theme.palette.text.primary}>Compétences</Typography>
      </Grid>
      <FieldArray name="skills">
        {() => (
          <>
            {values.skills.map((skill, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name={`skills[${index}].skillName`}
                    label="Compétence"
                    value={skill.skillName}
                    onChange={(e) => setFieldValue(`skills[${index}].skillName`, e.target.value)}
                    fullWidth
                    error={touched.skills?.[index]?.skillName && Boolean(errors.skills?.[index]?.skillName)}
                    helperText={touched.skills?.[index]?.skillName && errors.skills?.[index]?.skillName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={touched.skills?.[index]?.level && Boolean(errors.skills?.[index]?.level)}>
                    <InputLabel>Niveau</InputLabel>
                    <Select
                      name={`skills[${index}].level`}
                      value={skill.level}
                      onChange={(e) => setFieldValue(`skills[${index}].level`, e.target.value)}
                      displayEmpty
                    >
                      {Object.entries(skillLevels).map(([key, value]) => (
                        <MenuItem key={key} value={value}>{value}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{touched.skills?.[index]?.level && errors.skills?.[index]?.level}</FormHelperText>
                  </FormControl>
                </Grid>
                {values.skills.length > 1 && (
                  <Grid item xs={12}>
                    <Button onClick={() => handleRemoveField('skills', index)} startIcon={<RemoveCircleOutlineIcon />}>
                      Supprimer la compétence
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button onClick={() => handleAddField('skills', { skillName: '', level: '' })} startIcon={<AddCircleOutlineIcon />}>
                    Ajouter une compétence
                  </Button>
                </Grid>
              </React.Fragment>
            ))}
          </>
        )}
      </FieldArray>

       {/* Hobbies Section */}
       <Grid item xs={12}><Divider style={{ margin: '20px 0' }} /></Grid>
      <Grid item xs={12}>
        <Typography variant="h6" color={theme.palette.text.primary}>Loisirs</Typography>
      </Grid>
      <FieldArray name="hobbies">
        {() => (
          <>
            {values.hobbies.map((hobby, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  name={`hobbies[${index}]`}
                  label="Loisir"
                  value={hobby}
                  onChange={(e) => setFieldValue(`hobbies[${index}]`, e.target.value)}
                  fullWidth
                />
                {values.hobbies.length > 1 && (
                  <Button onClick={() => handleRemoveField('hobbies', index)} startIcon={<RemoveCircleOutlineIcon />}>
                    Supprimer le loisir
                  </Button>
                )}
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddField('hobbies', '')} startIcon={<AddCircleOutlineIcon />}>
                Ajouter un loisir
              </Button>
            </Grid>
          </>
        )}
      </FieldArray>
      </Grid>
  );
};

export default CombinedForm;
