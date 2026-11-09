import { useEffect, useState, type ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister,  me, type User } from '../lib/auth';
import { AuthContext } from './auth-context';



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const loggedUser = await apiLogin(email, password);
    setUser(loggedUser);
  }

  async function register(email: string, password: string, name?: string) {
    const registerUser = await apiRegister(email, password, name);
    await login(registerUser.email, password);
  }

  async function logout() {
    await apiLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register,  logout }}>
      {children}
    </AuthContext.Provider>
  );
}

