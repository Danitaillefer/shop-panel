import { api } from './api';

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export function login(email: string, password: string) {
  return api.post<User>('/auth/login', { email, password });
}

export function me(){
    return api.get<User>('/auth/me')
}

export function logout(){
    return api.post<{ message: string }>('/auth/logout')
}