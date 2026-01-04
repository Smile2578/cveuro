'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    
    const params = searchParams.toString();
    const fullPath = params ? `${newPath}?${params}` : newPath;
    
    router.push(fullPath);
  };

  return (
    <div className="flex gap-1">
      <Button
        variant={currentLocale === 'fr' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLocaleChange('fr')}
        className={cn(
          "gap-2 px-3",
          currentLocale === 'fr' 
            ? "bg-sage hover:bg-sage-dark text-white" 
            : "border-sage/30 text-sage hover:bg-sage/10 hover:text-sage-dark"
        )}
      >
        <Image src="/flags/france.png" alt="French flag" width={16} height={16} className="rounded-sm" />
        <span className="hidden sm:inline">FR</span>
      </Button>
      <Button
        variant={currentLocale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLocaleChange('en')}
        className={cn(
          "gap-2 px-3",
          currentLocale === 'en' 
            ? "bg-sage hover:bg-sage-dark text-white" 
            : "border-sage/30 text-sage hover:bg-sage/10 hover:text-sage-dark"
        )}
      >
        <Image src="/flags/uk.png" alt="British flag" width={16} height={16} className="rounded-sm" />
        <span className="hidden sm:inline">EN</span>
      </Button>
    </div>
  );
}

