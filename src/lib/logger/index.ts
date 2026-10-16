type LogContext = Record<string, unknown>;

function write(level: string, message: string, context?: LogContext) {
  const payload = context ? { ...context } : undefined;
  console[level as "info" | "warn" | "error" | "debug"](message, payload ?? "");
}

export const logger = {
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, context?: LogContext) => write("error", message, context),
  debug: (message: string, context?: LogContext) => write("debug", message, context),
};
