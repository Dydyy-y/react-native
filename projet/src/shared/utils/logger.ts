/* eslint-disable no-console */
export const logger = {
  log: (...args: unknown[]) => __DEV__ && console.log('[LOG]', ...args),
  error: (...args: unknown[]) => __DEV__ && console.error('[ERROR]', ...args),
  warn: (...args: unknown[]) => __DEV__ && console.warn('[WARN]', ...args),
};
