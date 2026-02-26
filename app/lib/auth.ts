// Authentication utilities
export const AUTH_TOKEN_KEY = 'auth_token';

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=86400; secure; samesite=strict`;
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth_token_client') {
        return value;
      }
    }
  }
  return null;
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0; secure; samesite=strict`;
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
