// app/i18n/settings.ts

export type Locale = 'fr' | 'en';

export const locales: Locale[] = ['fr', 'en'];
export const defaultLocale: Locale = 'en';
export const timeZone = 'Europe/Paris';

export interface DateTimeFormatOptions {
  day?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'short' | 'long';
  year?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  timeZoneName?: 'short' | 'long';
}

export interface Formats {
  dateTime: {
    short: DateTimeFormatOptions;
    long: DateTimeFormatOptions;
  };
  date: {
    short: DateTimeFormatOptions;
    long: DateTimeFormatOptions;
  };
  time: {
    short: DateTimeFormatOptions;
    long: DateTimeFormatOptions;
  };
}

export interface Settings {
  locales: Locale[];
  defaultLocale: Locale;
  timeZone: string;
  now: Date;
  formats: Formats;
}

export const getSettings = (): Settings => ({
  locales,
  defaultLocale,
  timeZone,
  now: new Date(),
  formats: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      },
      long: {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    date: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      },
      long: {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    },
    time: {
      short: {
        hour: 'numeric',
        minute: 'numeric'
      },
      long: {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      }
    }
  }
});

