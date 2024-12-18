'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button, ButtonGroup, Box } from '@mui/material';
import Image from 'next/image';

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();

  const handleLocaleChange = (newLocale) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    
    const params = searchParams.toString();
    const fullPath = params ? `${newPath}?${params}` : newPath;
    
    router.push(fullPath);
  };

  return (
    <ButtonGroup variant="outlined" size="small" aria-label="language selector">
      <Button
        onClick={() => handleLocaleChange('fr')}
        variant={currentLocale === 'fr' ? 'contained' : 'outlined'}
        sx={{
          minWidth: '40px',
          color: currentLocale === 'fr' ? 'white' : 'primary.main',
          borderColor: 'primary.main',
          '&:hover': {
            borderColor: 'primary.dark',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Image src="/flags/france.png" alt="French flag" width={20} height={20} />
          Fr
        </Box>
      </Button>
      <Button
        onClick={() => handleLocaleChange('en')}
        variant={currentLocale === 'en' ? 'contained' : 'outlined'}
        sx={{
          minWidth: '40px',
          color: currentLocale === 'en' ? 'white' : 'primary.main',
          borderColor: 'primary.main',
          '&:hover': {
            borderColor: 'primary.dark',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Image src="/flags/uk.png" alt="British flag" width={20} height={20} />
          En
        </Box>
      </Button>
    </ButtonGroup>
  );
}