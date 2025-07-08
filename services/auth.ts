import * as SecureStore from 'expo-secure-store'
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase config object (replace with your actual config)
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();

const API_URL = 'http://192.168.8.100:5000/api';

interface LoginResponse {
  token: string;
  passenger: {
    id: number;
    name: string;
    phone: string;
  };
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface VerificationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AccountDetails {
  name: string;
  email: string;
  phone: string;
}

export interface DriverOnboardingData {
  name: string;
  phone: string;
  service_provider: 'MTN' | 'Airtel';
  vehicle_type: 'bike' | 'car';
  license_number: string;
  password: string;
  confirm_password: string;
}

const getAuthHeaders = async () => {
  const token = await SecureStore.getItemAsync('userToken'); // <-- fix here
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const signup = async (data: SignupData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.message || 'Signup failed',
      };
    }

    return {
      success: true,
      message: responseData.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during signup',
    };
  }
};

export const login = async (phone: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Login failed',
      };
    }

    if (data.token) {
      await SecureStore.setItemAsync('userToken', data.token);
      await SecureStore.setItemAsync('userData', JSON.stringify(data.passenger));
      
      return {
        success: true,
        data: data,
      };
    }
    
    return {
      success: false,
      error: 'Invalid response from server',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during login',
    };
  }
};

export const driverLogin = async (phone: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/driver/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }
    if (data.token) {
      await SecureStore.setItemAsync('driverToken', data.token);
      await SecureStore.setItemAsync('driverData', JSON.stringify(data.driver));
      return { success: true, data: data.driver };
    }
    return { success: false, error: 'Invalid response from server' };
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const verifyPhone = async (phone: string, code: string): Promise<VerificationResponse> => {
  try {
    const response = await fetch(`${API_URL}/verify/phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Verification failed',
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during verification',
    };
  }
};

export const forgotPassword = async (phone: string) => {
  try {
    const response = await fetch(`${API_URL}/password/forgot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message,
      error: data.error,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

export const resetPassword = async (phone: string, code: string, newPassword: string, confirmPassword: string) => {
  try {
    const response = await fetch(`${API_URL}/password/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        code,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message,
      error: data.error,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

export const getAccountDetails = async (): Promise<ApiResponse<AccountDetails>> => {
  const token = await SecureStore.getItemAsync('userToken');
  try {
    const response = await fetch(`${API_URL}/account/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to fetch details' };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
};

export const updateAccountDetails = async (details: Omit<AccountDetails, 'phone'>): Promise<ApiResponse<AccountDetails>> => {
  try {
    const response = await fetch(`${API_URL}/account/details`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(details),
    });
    const data = await response.json();
    return { success: response.ok, data: data.user, error: data.error, message: data.message };
  } catch (error) {
    return { success: false, error: 'Failed to update account details' };
  }
};

export const changePassword = async (
  old_password: string,
  new_password: string,
  confirm_password: string
): Promise<ApiResponse> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/password/change`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        old_password,
        new_password,
        confirm_password,
      }),
    });
    const data = await response.json();
    return {
      success: response.ok,
      message: data.message,
      error: data.error,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to change password',
    };
  }
};

export const driverOnboarding = async (formData: FormData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/driver/onboarding`, {
      method: 'POST',
      // Do NOT set Content-Type header when sending FormData; browser/React Native will set it automatically
      body: formData,
    });
    const resData = await response.json();
    return {
      success: response.ok && resData.success,
      message: resData.message,
      data: resData,
      error: !response.ok ? resData.message : undefined,
    };
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' };
  }
};


/**
 * Verifies driver phone using Firebase Auth ID token.
 * The user must have already completed phone verification via Firebase on the client.
 * This sends the Firebase ID token to the backend for verification.
 */
export const verifyDriverPhone = async (): Promise<ApiResponse> => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      return { success: false, error: 'No authenticated user found.' };
    }
    const idToken = await currentUser.getIdToken();
    const response = await fetch(`${API_URL}/driver/verify/phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken }),
    });
    const data = await response.json();
    return {
      success: response.ok && data.success,
      message: data.message,
      error: data.error,
    };
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' };
  }
};

/**
 * Verifies passenger phone using Firebase Auth ID token.
 * The user must have already completed phone verification via Firebase on the client.
 * This sends the Firebase ID token to the backend for verification.
 */
export const verifyPassengerPhone = async (): Promise<ApiResponse> => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      return { success: false, error: 'No authenticated user found.' };
    }
    const idToken = await currentUser.getIdToken();
    const response = await fetch(`${API_URL}/verify/phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken }),
    });
    const data = await response.json();
    return {
      success: response.ok && data.success,
      message: data.message,
      error: data.error,
    };
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' };
  }
};