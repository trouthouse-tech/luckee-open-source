/**
 * API Configuration
 * Manages different API endpoints for development and production
 */

const isProductionEnvironment = (): boolean => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return false;
    }
  }
  
  const isVercelProduction = process.env.VERCEL_ENV === 'production';
  const isNodeProduction = process.env.NODE_ENV === 'production';
  
  return isVercelProduction || isNodeProduction;
};

const getDefaultUrl = (): string => {
  if (isProductionEnvironment()) {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('NEXT_PUBLIC_API_URL must be set in production environment.');
    }
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
};

const getServerUrl = (): string => {
  // mentorai-server URL (different from Next.js API routes)
  if (isProductionEnvironment()) {
    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      throw new Error('NEXT_PUBLIC_SERVER_URL must be set in production environment.');
    }
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }
  
  // Default to localhost:3005 for mentorai-server (dev)
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3005';
};

export const API_CONFIG = {
  LOCAL: 'http://localhost:3005',
  DEFAULT: getDefaultUrl(),
  SERVER_URL: getServerUrl(), // mentorai-server base URL
} as const;

export type ApiEnvironment = 'local' | 'production';

export const getApiUrl = (environment?: ApiEnvironment): string => {
  if (!environment) {
    return API_CONFIG.DEFAULT;
  }
  
  if (environment === 'local') {
    return API_CONFIG.LOCAL;
  }
  
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL must be set for production environment.');
  }
  
  return process.env.NEXT_PUBLIC_API_URL;
};
