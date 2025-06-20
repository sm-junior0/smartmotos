import { API_URL } from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingService } from './bookingService';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'driver' | 'passenger';
}

class AuthService {
  private token: string | null = null;

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      await this.setToken(data.token);
      await this.setUser(data.user);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
    bookingService.setToken(token); // Set token in booking service
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  async setUser(user: User) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  async logout() {
    this.token = null;
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    bookingService.setToken(''); // Clear token in booking service
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const authService = new AuthService(); 