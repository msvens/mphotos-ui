'use client';

import { useState } from 'react';
import { useMPContext } from '@/context/MPContext';
import { Divider } from "@/components/Divider";
import { Button } from "@/components/Button";

export function Login() {
  const { login } = useMPContext();
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    if (!password.trim()) return;
    
    setIsLoggingIn(true);
    setLoginError('');
    
    try {
      await login(password);
      // Context will automatically update the UI
    } catch (error) {
      setLoginError('Incorrect password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (loginError) setLoginError('');
  };

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-light mb-4">Login</h1>
        <p className="text-mui-text-secondary">Login to edit settings</p>
      </div>

      <Divider />

      <div className="space-y-6">
        {loginError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500 text-sm">{loginError}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-mui-text-primary">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full p-3 rounded-lg border border-mui-divider bg-transparent text-mui-text-primary placeholder-mui-text-secondary focus:outline-none focus:ring-2 focus:ring-mui-primary focus:border-transparent"
            placeholder="Enter your password"
            disabled={isLoggingIn}
          />
        </div>

        <Button 
          onClick={handleLogin}
          color="primary" 
          variant="contained"
          fullWidth
          disabled={isLoggingIn || !password.trim()}
          className="h-12"
        >
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </div>
  );
}
