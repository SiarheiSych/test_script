import { getLogger as superGetLogger, levels } from 'log4js';

export function getLogger(loggerName?: string, loggerLevel = 'ALL') {
  const logger = superGetLogger(loggerName);
  logger.level = levels[loggerLevel];
  return logger;
}
