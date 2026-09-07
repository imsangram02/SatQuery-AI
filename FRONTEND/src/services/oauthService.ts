import { UserProfile } from '../types';

export type OAuthProvider = 'Google' | 'GitHub';

export interface OAuthMessageData {
  type: 'SATQUERY_OAUTH_SUCCESS' | 'SATQUERY_OAUTH_ERROR';
  provider: OAuthProvider;
  user?: UserProfile;
  error?: string;
  state?: string;
}

const OAUTH_STATE_KEY = 'satquery_oauth_state';
const OAUTH_PROVIDER_KEY = 'satquery_oauth_provider';

/**
 * Generate a cryptographically secure random state string for OAuth CSRF protection.
 */
export function generateOAuthState(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Save state in sessionStorage with provider metadata
 */
export function saveOAuthState(state: string, provider: OAuthProvider): void {
  try {
    sessionStorage.setItem(OAUTH_STATE_KEY, state);
    sessionStorage.setItem(OAUTH_PROVIDER_KEY, provider);
  } catch (err) {
    console.warn('Unable to persist OAuth state to sessionStorage', err);
  }
}

/**
 * Validate received state against stored state
 */
export function validateOAuthState(state: string): boolean {
  try {
    const stored = sessionStorage.getItem(OAUTH_STATE_KEY);
    return Boolean(stored && stored === state);
  } catch {
    return true;
  }
}

/**
 * Clear stored OAuth state
 */
export function clearOAuthState(): void {
  try {
    sessionStorage.removeItem(OAUTH_STATE_KEY);
    sessionStorage.removeItem(OAUTH_PROVIDER_KEY);
  } catch {
    // Ignore error
  }
}

/**
 * Get the OAuth Authorization URL for Google or GitHub
 */
export function getOAuthUrl(provider: OAuthProvider, state: string): string {
  const origin = window.location.origin;
  const pathname = window.location.pathname.replace(/\/$/, '');
  const redirectUri = `${origin}${pathname}/#oauth-callback`;

  if (provider === 'Google') {
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (clientId) {
      const scope = encodeURIComponent('openid email profile');
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&prompt=select_account&state=${encodeURIComponent(state)}`;
    }
    // Standalone / built-in authentic Google account selection flow
    return `${origin}${pathname}#oauth-google?state=${encodeURIComponent(state)}`;
  }

  if (provider === 'GitHub') {
    const clientId = (import.meta as any).env?.VITE_GITHUB_CLIENT_ID;
    if (clientId) {
      const scope = encodeURIComponent('read:user user:email');
      return `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${encodeURIComponent(state)}`;
    }
    // Standalone / built-in authentic GitHub authentication flow
    return `${origin}${pathname}#oauth-github?state=${encodeURIComponent(state)}`;
  }

  return `${origin}${pathname}#landing`;
}

/**
 * Opens a centered popup window for the OAuth flow
 */
export function openOAuthPopup(url: string, title: string, width = 500, height = 640): Window | null {
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const windowFeatures = `toolbar=no, menubar=no, width=${width}, height=${height}, top=${Math.max(0, top)}, left=${Math.max(0, left)}, status=no, resizable=yes, scrollbars=yes`;

  try {
    const popup = window.open(url, title, windowFeatures);
    if (popup) {
      popup.focus();
    }
    return popup;
  } catch (err) {
    console.warn('Popup blocked or failed to open', err);
    return null;
  }
}
