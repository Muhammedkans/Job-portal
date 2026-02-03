export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
}
