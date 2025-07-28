
const TOKEN_KEY = "accessToken";
export const setAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') { 
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeAccessToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export function isValidEmail(email:string):boolean {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}



