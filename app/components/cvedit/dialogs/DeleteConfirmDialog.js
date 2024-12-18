"use client";
import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

const DeleteConfirmDialog = ({ open, onClose, onConfirm }) => {
  const t = useTranslations('cvedit');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('common.confirmDelete')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('common.deleteWarning')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('common.cancel')}
        </Button>
        <Button onClick={onConfirm} color="error">
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog; 