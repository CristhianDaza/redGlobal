export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  error?: Error;
}

class LoggerService {
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private isDevelopment: boolean = import.meta.env.DEV;

  constructor() {
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private createLogEntry(level: LogLevel, message: string, context?: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      error
    };
  }

  private addToBuffer(entry: LogEntry): void {
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.substring(11, 23);
    const levelName = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}]` : '';
    
    return `${timestamp} ${levelName} ${context} ${entry.message}`;
  }

  private logToConsole(entry: LogEntry): void {
    const formattedMessage = this.formatMessage(entry);
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.data);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.data);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedMessage, entry.error || entry.data);
        break;
    }
  }

  debug(message: string, context?: string, data?: any): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context, data);
    this.addToBuffer(entry);
    this.logToConsole(entry);
  }

  info(message: string, context?: string, data?: any): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry = this.createLogEntry(LogLevel.INFO, message, context, data);
    this.addToBuffer(entry);
    this.logToConsole(entry);
  }

  warn(message: string, context?: string, data?: any): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry = this.createLogEntry(LogLevel.WARN, message, context, data);
    this.addToBuffer(entry);
    this.logToConsole(entry);
  }

  error(message: string, context?: string, error?: Error | any): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, undefined, error);
    this.addToBuffer(entry);
    this.logToConsole(entry);
  }

  fatal(message: string, context?: string, error?: Error | any): void {
    const entry = this.createLogEntry(LogLevel.FATAL, message, context, undefined, error);
    this.addToBuffer(entry);
    this.logToConsole(entry);
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return this.logs.map(entry => this.formatMessage(entry)).join('\n');
  }
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }

  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }
}

export const logger = new LoggerService();
export default logger;
