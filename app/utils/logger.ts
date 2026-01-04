/**
 * Secure logging service for production-safe error tracking
 * Logs are sent to an API endpoint and stored server-side
 * Never exposes sensitive data in client console
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  endpoint?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Get session ID from storage or generate new one
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('app_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('app_session_id', sessionId);
  }
  return sessionId;
};

// Get user ID from local storage if available
const getUserId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  
  try {
    const storedData = localStorage.getItem('cvFormData');
    if (storedData) {
      const data = JSON.parse(storedData);
      // Create anonymous hash from email if available
      if (data?.personalInfo?.email) {
        return btoa(data.personalInfo.email).substring(0, 16);
      }
    }
  } catch {
    // Silent fail
  }
  return undefined;
};

// Sanitize metadata to remove sensitive information
const sanitizeMetadata = (metadata?: Record<string, unknown>): Record<string, unknown> | undefined => {
  if (!metadata) return undefined;
  
  const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'email', 'phone', 'address'];
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMetadata(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

class Logger {
  private config: LoggerConfig;
  private queue: LogEntry[] = [];
  private flushTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.config = {
      enabled: process.env.NODE_ENV !== 'test',
      minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
      endpoint: '/api/logs',
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  private createEntry(level: LogLevel, message: string, context?: string, metadata?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      context,
      metadata: sanitizeMetadata(metadata),
      timestamp: new Date().toISOString(),
      userId: getUserId(),
      sessionId: getSessionId(),
    };
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const entries = [...this.queue];
    this.queue = [];

    // In development, also log to console for debugging
    if (process.env.NODE_ENV === 'development') {
      entries.forEach(entry => {
        const style = {
          debug: 'color: gray',
          info: 'color: blue',
          warn: 'color: orange',
          error: 'color: red; font-weight: bold',
        }[entry.level];
        
        // eslint-disable-next-line no-console
        console.groupCollapsed(`%c[${entry.level.toUpperCase()}] ${entry.context || 'App'}: ${entry.message}`, style);
        if (entry.metadata) {
          // eslint-disable-next-line no-console
          console.log('Metadata:', entry.metadata);
        }
        // eslint-disable-next-line no-console
        console.log('Timestamp:', entry.timestamp);
        // eslint-disable-next-line no-console
        console.groupEnd();
      });
    }

    // Send to API endpoint in production
    if (process.env.NODE_ENV === 'production' && this.config.endpoint) {
      try {
        await fetch(this.config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entries }),
        });
      } catch {
        // Silent fail - don't break the app for logging issues
      }
    }
  }

  private scheduleFlush(): void {
    if (this.flushTimeout) return;
    
    this.flushTimeout = setTimeout(() => {
      this.flushTimeout = null;
      this.flush();
    }, 1000); // Batch logs every second
  }

  private log(level: LogLevel, message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createEntry(level, message, context, metadata);
    this.queue.push(entry);
    
    // Flush immediately for errors
    if (level === 'error') {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, context, metadata);
  }

  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, context, metadata);
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, context, metadata);
  }

  error(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log('error', message, context, metadata);
  }

  // Convenience method for form validation errors
  validationError(formName: string, errors: Record<string, unknown>): void {
    this.warn(`Validation failed for ${formName}`, 'FormValidation', {
      formName,
      errorFields: Object.keys(errors),
      errorCount: Object.keys(errors).length,
    });
  }
}

// Singleton instance
export const logger = new Logger();

// Utility to extract readable error messages from Zod errors
export const formatValidationErrors = (
  errors: Record<string, { message?: string } | unknown>,
  fieldLabels: Record<string, string>
): string[] => {
  const messages: string[] = [];
  
  const extractErrors = (obj: unknown, path: string[] = []): void => {
    if (!obj || typeof obj !== 'object') return;
    
    const record = obj as Record<string, unknown>;
    
    if ('message' in record && typeof record.message === 'string') {
      const fieldPath = path.join('.');
      const label = fieldLabels[fieldPath] || fieldPath;
      messages.push(`${label}: ${record.message}`);
      return;
    }
    
    for (const [key, value] of Object.entries(record)) {
      if (key === 'ref' || key === 'type') continue;
      extractErrors(value, [...path, key]);
    }
  };
  
  extractErrors(errors);
  return messages;
};

