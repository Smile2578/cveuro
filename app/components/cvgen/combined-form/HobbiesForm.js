// app/components/cvgen/combined-form/HobbiesForm.js
"use client";

import React, { useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  SportsEsports as HobbyIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const COMMON_HOBBIES = [
  'hobbies.suggestions.items.reading',
  'hobbies.suggestions.items.sports',
  'hobbies.suggestions.items.music',
  'hobbies.suggestions.items.travel',
  'hobbies.suggestions.items.photography',
  'hobbies.suggestions.items.cooking',
  'hobbies.suggestions.items.gardening',
  'hobbies.suggestions.items.volunteering',
  'hobbies.suggestions.items.arts',
  'hobbies.suggestions.items.theater'
];

const HobbyItem = React.memo(({ index, onRemove, errors }) => {
  const t = useTranslations('cvform');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { register } = useFormContext();

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' },
        position: 'relative',
        borderRadius: 2,
        borderLeft: `4px solid ${theme.palette.secondary.main}`,
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <FormControl 
        fullWidth 
        error={!!errors?.hobbies?.[index]}
        sx={{ flex: 1 }}
      >
        <TextField
          {...register(`hobbies.${index}`)}
          label={t('hobbies.hobby.label')}
          placeholder={t('hobbies.hobby.placeholder')}
          error={!!errors?.hobbies?.[index]}
          helperText={errors?.hobbies?.[index]?.message}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </FormControl>

      <IconButton
        onClick={() => onRemove(index)}
        color="error"
        size={isMobile ? 'small' : 'medium'}
        sx={{ 
          alignSelf: { xs: 'flex-end', sm: 'center' },
          flexShrink: 0
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
});

HobbyItem.displayName = 'HobbyItem';

const HobbiesForm = () => {
  const t = useTranslations('cvform');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    control,
    formState: { errors },
    trigger,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hobbies',
  });

  const handleAddHobby = useCallback(() => {
    if (fields.length < 5) {
      append('');
    }
  }, [fields.length, append]);

  const handleQuickAdd = useCallback((hobby) => {
    if (fields.length < 5) {
      append(t(hobby));
      trigger('hobbies');
    }
  }, [fields.length, append, trigger, t]);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={3}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'center' }, // Changed from flex-start to center
          textAlign: { xs: 'center', sm: 'left' }, // Added text alignment
          gap: 2,
          mb: { xs: 2, sm: 3 }
        }}>
          <HobbyIcon 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.125rem' },
              color: 'secondary.main'
            }}
          />
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}> {/* Added width control */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 600,
                color: 'secondary.main'
              }}
            >
              {t('hobbies.main.title')}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mt: 0.5,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {t('hobbies.main.description')}
            </Typography>
          </Box>
        </Box>

        {errors?.hobbies && (
          <Alert 
            severity="error"
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            {errors.hobbies.message}
          </Alert>
        )}

        <AnimatePresence mode="wait">
          <Stack spacing={2}>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <HobbyItem
                  index={index}
                  onRemove={remove}
                  errors={errors}
                />
              </motion.div>
            ))}
          </Stack>
        </AnimatePresence>

        {fields.length < 5 ? (
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddHobby}
            variant="outlined"
            color="secondary"
            fullWidth
            size={isMobile ? 'large' : 'medium'}
            sx={{ 
              mt: { xs: 1, sm: 2 },
              height: { xs: '48px', sm: '42px' },
              borderRadius: 6
            }}
          >
            {fields.length === 0
              ? t('hobbies.actions.addFirst')
              : t('hobbies.actions.add')}
          </Button>
        ) : (
          <Alert 
            severity="info"
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            {t('hobbies.actions.maxLength')}
          </Alert>
        )}

        {fields.length < 5 && (
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                color: 'secondary.main',
                fontWeight: 600
              }}
            >
              {t('hobbies.suggestions.title')}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1
            }}>
              {COMMON_HOBBIES.map((hobby) => (
                <Chip
                  key={hobby}
                  label={t(hobby)}
                  onClick={() => handleQuickAdd(hobby)}
                  clickable
                  color="secondary"
                  variant="outlined"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ 
                    borderRadius: 3,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default HobbiesForm; 