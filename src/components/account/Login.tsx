'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMPContext } from '@/context/MPContext';
import { Divider } from "@/components/Divider";
import { Button } from "@/components/Button";
import { authService, AuthMethod } from '@/lib/api/services/auth';
import { API_ENDPOINTS } from '@/lib/api/config';

type LoadStatus = 'loading' | 'ready' | 'failed';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  unauthorized_email: 'This Google account is not authorized for this site.',
  invalid_state: 'Login session expired. Please try again.',
  exchange_failed: 'Could not complete sign-in with Google. Please try again.',
};

export function Login() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="space-y-8 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-light mb-4">Login</h1>
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
    </div>
  );
}

function LoginContent() {
  const { login } = useMPContext();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<LoadStatus>('loading');
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(null);
  const [oauthError, setOauthError] = useState('');

  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setOauthError(OAUTH_ERROR_MESSAGES[errorParam] ?? 'Sign-in failed. Please try again.');
      window.history.replaceState(null, '', '/account');
    }

    authService.getAuthMethod()
      .then((method) => {
        setAuthMethod(method);
        setStatus('ready');
      })
      .catch(() => {
        setStatus('failed');
      });
  }, [searchParams]);

  const handleLogin = async () => {
    if (!password.trim()) return;

    setIsLoggingIn(true);
    setLoginError('');

    try {
      await login(password);
    } catch {
      setLoginError('Incorrect password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (loginError) setLoginError('');
  };

  const handleGoogleLogin = () => {
    // Full-page navigation is required for OAuth — never use fetch/XHR here.
    window.location.href = API_ENDPOINTS.loginGoogle;
  };

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-light mb-4">Login</h1>
        <p className="text-gray-600 dark:text-gray-400">Login to edit settings</p>
      </div>

      <Divider />

      <div className="space-y-6">
        {oauthError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500 text-sm">{oauthError}</p>
          </div>
        )}

        {status === 'loading' && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading…</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500 text-sm">
              Unable to determine login method. Please reload the page or contact the administrator.
            </p>
          </div>
        )}

        {status === 'ready' && authMethod === 'password' && (
          <>
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-500 text-sm">{loginError}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                disabled={isLoggingIn}
              />
            </div>

            <Button
              onClick={handleLogin}
              color="primary"
              variant="outlined"
              fullWidth
              disabled={isLoggingIn || !password.trim()}
              className="h-12"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          </>
        )}

        {status === 'ready' && authMethod === 'google' && (
          <Button
            onClick={handleGoogleLogin}
            color="primary"
            variant="outlined"
            fullWidth
            className="h-12"
          >
            Sign in with Google
          </Button>
        )}
      </div>
    </div>
  );
}
