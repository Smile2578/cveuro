"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardMedia, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button  } from '@mui/material';
import theme from '@/app/theme';

const templates = [
  { id: 'light', name: 'Modèle Clair', description: 'A modern layout with a light theme.', imageUrl: '/template/lighttemplate.png' },
  { id: 'dark', name: 'Modèle Sombre', description: 'A sleek layout with a dark theme.', imageUrl: '/template/darktemplate.png' },
  { id: 'mixed', name: 'Modèle Mixte', description: 'A mixed theme layout for versatility.', imageUrl: '/template/mixtemplate.png' }
];

const TemplateSelection = ({ onSelect, currentTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tempTemplateId, setTempTemplateId] = useState('');

  useEffect(() => {
    if (currentTemplate) {
      setSelectedTemplate(currentTemplate);
    }
  }, [currentTemplate]);

const handleOpenDialog = (templateId) => {
  setTempTemplateId(templateId);
  setOpenDialog(true);
};

const handleConfirmTemplate = async () => {
  setSelectedTemplate(tempTemplateId);
  onSelect(tempTemplateId);
  setOpenDialog(false);

  const userId = localStorage.getItem('cvUserId');
  if (!userId) {
    console.error('No userId found');
    return;
  }

  try {
    await fetch(`/api/cvedit/updateCV?userId=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: tempTemplateId }),
    });
    console.log('Template updated successfully', tempTemplateId);
  } catch (error) {
    console.error('Error updating template:', error);
  }
};

if (selectedTemplate) {
  return null;
}

  return (
<>
    <Box sx={{ pt: 2, pb: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" color={theme.palette.primary.main} gutterBottom>
        Choisissez votre modèle
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ maxWidth: 345, height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '16px', boxShadow: '4'}}>
            <CardActionArea onClick={() => handleOpenDialog(template.id)} sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                image={template.imageUrl}
                alt={template.name}
                sx={{ height: 240 }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {template.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {template.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        
        ))}
      </Grid>
    </Box>

     {/* Confirmation Dialog */}
     <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirmer la séléction du modèle</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Voulez-vous choisir ce modèle pour votre CV ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Non</Button>
                    <Button onClick={handleConfirmTemplate} autoFocus>
                        Je confirme
                    </Button>
                </DialogActions>
            </Dialog>
    </>
  );
};

export default TemplateSelection;
