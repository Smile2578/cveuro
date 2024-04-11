import React from 'react';
import { Box, Grid, Paper, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Chip  } from '@mui/material';
import Image from 'next/image';
import theme from '@/app/theme';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WebIcon from '@mui/icons-material/Web';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import PublicIcon from '@mui/icons-material/Public';
import PlaceIcon from '@mui/icons-material/Place';
import useMediaQuery from '@mui/material/useMediaQuery';



  // Maps skill level numbers to labels
  const skillLevelLabels = {
    '1': 'Débutant',
    '2': 'Intermédiaire',
    '3': 'Expérimenté',
    '4': 'Avancé',
    '5': 'Maîtrise parfaite',
  };

  // Renders a chip for skill level
  const renderSkillChip = (skill) => {
    const label = skillLevelLabels[skill.level] || 'Non défini';
    return (
      <Chip
        label={`${skill.skillName}: ${label}`}
        size="small"
        variant="outlined"
        sx={{ marginRight: '5px', marginBottom: '5px' }}
      />
    );
  };

  // Renders a chip for language proficiency
  const renderLanguageChip = (lang) => {
    let additionalText = lang.testName ? ` (${lang.testName} - ${lang.testScore})` : '';
    return (
      <Chip
        label={`${lang.language}: ${lang.proficiency}${additionalText}`}
        color="primary"
        variant="outlined"
        size="small"
        sx={{ margin: '5px' }}
      />
    );
  };

const sex = {
  'M': 'Homme',
  'F': 'Femme'
};

const formatUrl = (url) => {
  if (!url) return ""; // Return an empty string if the URL is undefined or not provided
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
};

const LiveCV = ({ cvData }) => {

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!cvData || !cvData.personalInfo) {
    return <Typography>Chargement...</Typography>; // or any other loading state you prefer
  }


  return (
    <Paper elevation={3} sx={{ p: 4, margin: 'auto', maxWidth: 1000, flexGrow: 1}} id="live-cv">
      {/* Top Bar */}
      <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={4}>
      {/* Personal Information with Icons */}
      <Typography variant="h6" align='center' sx={{ color: theme.palette.primary.main, mb: 1 }}>Informations personnelles</Typography>
      <List dense>
        <ListItem sx={{ py: 0.25 }}>
          <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{cvData.personalInfo.firstname} {cvData.personalInfo.lastname}</Typography>} />
        </ListItem>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: '40px' }}>
            <CakeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body2">{cvData.personalInfo.dateofBirth}</Typography>} />
        </ListItem>
        <ListItem sx={{ py: 0.25 }}>
          <ListItemIcon sx={{ minWidth: '40px' }}>
            <WcIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body2">{sex[cvData.personalInfo.sex]}</Typography>} />
        </ListItem>
        <ListItem sx={{ py: 0.25 }}>
          <ListItemIcon sx={{ minWidth: '40px' }}>
            <PublicIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body2">{cvData.personalInfo.nationality}</Typography>} />
        </ListItem>
        <ListItem sx={{ py: 0.25 }}>
          <ListItemIcon sx={{ minWidth: '40px' }}>
            <PlaceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body2">{cvData.personalInfo.placeofBirth}</Typography>} />
        </ListItem>
      </List>
    </Grid>

        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          {/* Logo */}
          <Image src="/logo.png" alt="GEDS Logo" width={150} height={150} />
        </Grid>

         {/* Contact Section with Icons */}
         <Grid item xs={12} md={4}>
          <Typography variant="h6" align='center' sx={{ color: theme.palette.primary.main, mb: 1 }}>Contact</Typography>
          <List dense>
            <ListItem sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body2">{cvData.personalInfo.email}</Typography>} />
            </ListItem>
            <ListItem sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <PhoneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body2">{cvData.personalInfo.phoneNumber}</Typography>} />
            </ListItem>
            <ListItem sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body2">{`${cvData.personalInfo.address}, ${cvData.personalInfo.city}, ${cvData.personalInfo.zip}`}</Typography>} />
            </ListItem>
            {cvData.personalInfo.linkedIn && (
              <ListItem sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <LinkedInIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body2">{formatUrl(cvData.personalInfo.linkedIn)}</Typography>} />
              </ListItem>
            )}
            {cvData.personalInfo.personalWebsite && (
              <ListItem sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <WebIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body2">{formatUrl(cvData.personalInfo.personalWebsite)}</Typography>} />
              </ListItem>
            )}
          </List>
        </Grid>
      </Grid>

      <Divider variant='fullWidth' sx={{ my: 2 }} />

      <Grid container spacing={2} direction={isMobile ? 'column-reverse' : 'row'} wrap="nowrap">
       {/* Left Sidebar for Languages, Skills, & Hobbies */}
       <Grid item xs={12} md={3}>
          <Box sx={{ paddingRight: 2 }}>
            {/* Languages */}
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>Langues</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {cvData.languages.map(renderLanguageChip)}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Skills */}
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>Compétences</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {cvData.skills.map(renderSkillChip)}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Hobbies */}
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>Loisirs</Typography>
            <Typography>{cvData.hobbies.join(', ')}</Typography>
          </Box>
        </Grid>


        <Divider orientation="vertical" flexItem sx={{ height: 'auto' }} />

        {/* Right Content for Education & Work Experience */}
        <Grid item xs={12} md={9} sx={{ overflow: 'hidden', paddingLeft: isMobile ? 0 : 2 }}>
          <Box sx={{ overflow: 'hidden', paddingLeft: 2 }}>
            {/* Education */}
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>Éducation</Typography>
            {cvData.education.map((edu, index) => (
              <List key={`edu-${index}`}>
                <ListItem sx={{ paddingLeft: 4, position: 'relative' }}>
                  <ListItemIcon sx={{ position: 'absolute', left: -25, top: '50%', transform: 'translateY(-50%)' }}>
                    <FiberManualRecordIcon fontSize="small" sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{edu.schoolName}</Typography>
                    <Typography variant="body2">{edu.degree} en {edu.fieldOfStudy}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'light' }}>{edu.startDate} - {edu.ongoing ? "En cours" : edu.endDate}</Typography>
                  </Box>
                </ListItem>
                <Divider sx={{ marginLeft: 4}} />
              </List>
            ))}

            {/* Work Experience */}
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, marginTop: 2 }}>Expérience Professionnelle</Typography>
            {cvData.workExperience.map((work, index) => (
              <List key={`work-${index}`}>
                <ListItem sx={{ paddingLeft: 4, position: 'relative' }}>
                  <ListItemIcon sx={{ position: 'absolute', left: -25, top: '50%', transform: 'translateY(-50%)' }}>
                    <FiberManualRecordIcon fontSize="small" sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{work.companyName}, {work.location}</Typography>
                    <Typography variant="body2">{work.position}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'light' }}>{work.startDate} - {work.ongoing ? "En cours" : work.endDate}</Typography>
                  </Box>
                </ListItem>
                <Divider sx={{ marginLeft: 4 }} />
              </List>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>

    
  );
};

export default LiveCV;
