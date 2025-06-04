import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.12.74.26:5000/api';

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

interface ApiResponse {
  success: boolean;
  data?: LoginResponse;
  message?: string;
  error?: string;
}

interface VerificationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

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