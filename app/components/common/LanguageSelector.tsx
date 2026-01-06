'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'fr', label: 'Français', flag: '/flags/france.png' },
  { code: 'en', label: 'English', flag: '/flags/uk.png' },
  { code: 'it', label: 'Italiano', flag: '/flags/italy.webp' },
];

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();

  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  const handleLocaleChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    const params = searchParams.toString();
    const fullPath = params ? `${newPath}?${params}` : newPath;
    router.push(fullPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 px-3 border-geds-blue/30 text-geds-blue hover:bg-geds-blue/10"
        >
          <Image
            src={currentLanguage.flag}
            alt={currentLanguage.label}
            width={16}
            height={16}
            className="rounded-sm"
          />
          <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLocaleChange(lang.code)}
            className={currentLocale === lang.code ? 'bg-geds-blue/10' : ''}
          >
            <Image
              src={lang.flag}
              alt={lang.label}
              width={16}
              height={16}
              className="rounded-sm mr-2"
            />
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
