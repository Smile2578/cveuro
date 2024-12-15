// app/components/cvgen/HobbiesForm.js

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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';


const HobbyItem = React.memo(({ index, onRemove, errors }) => {
  const t = useTranslations('cvform');
  const { register } = useFormContext();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <FormControl fullWidth error={!!errors?.hobbies?.[index]}>
        <TextField
          {...register(`hobbies.${index}`)}
          label={t('hobbies.hobby.label')}
          placeholder={t('hobbies.hobby.placeholder')}
          error={!!errors?.hobbies?.[index]}
          helperText={errors?.hobbies?.[index]?.message}
          fullWidth
        />
      </FormControl>

      <IconButton
        onClick={() => onRemove(index)}
        color="error"
        sx={{ flexShrink: 0 }}
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
});

HobbyItem.displayName = 'HobbyItem';

const HobbiesForm = () => {
  const t = useTranslations('cvform');
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
      append(hobby);
      trigger('hobbies');
    }
  }, [fields.length, append, trigger]);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            {t('hobbies.main.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('hobbies.main.description')}
          </Typography>
        </Box>

        {errors?.hobbies && (
          <Alert severity="error">
            {errors.hobbies.message}
          </Alert>
        )}

        <AnimatePresence>
          <Stack spacing={2}>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
            fullWidth
          >
            {fields.length === 0
              ? t('hobbies.actions.addFirst')
              : t('hobbies.actions.add')}
          </Button>
        ) : (
          <Alert severity="info">
            {t('hobbies.actions.maxLength')}
          </Alert>
        )}

        {fields.length < 5 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('hobbies.suggestions.title')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {COMMON_HOBBIES.map((hobby) => (
                <Chip
                  key={hobby}
                  label={hobby}
                  onClick={() => handleQuickAdd(hobby)}
                  clickable
                  color="primary"
                  variant="outlined"
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