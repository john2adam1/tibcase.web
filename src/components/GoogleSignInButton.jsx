import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { api, setToken, setRefreshToken, setStoredUser } from '../api';

/**
 * GoogleSignInButton Component
 *
 * Implements Swagger: POST /mobile/auth/google
 * Request Schema (models.GoogleLoginReq): { id_token: string, referral_code?: string }
 * Response Schema (models.TokenRes): { access_token: string, refresh_token: string, id: string, role: string }
 *
 * @param {Object} props
 * @param {string} [props.referralCode] - Optional referral code
 * @param {Function} props.onSuccess - Callback triggered with user profile upon successful authentication
 * @param {Function} [props.onError] - Callback triggered when authentication fails
 */
export default function GoogleSignInButton({
  referralCode = '',
  onSuccess,
  onError
}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    // 1. Extract Google ID Token from @react-oauth/google
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      const err = 'Google ID token not received';
      setErrorMessage(err);
      if (onError) onError(new Error(err));
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // 2. Send POST request to Swagger endpoint: /mobile/auth/google
      // Payload matches models.GoogleLoginReq exactly: { id_token, referral_code }
      const res = await api.loginWithGoogle(idToken, referralCode.trim());

      // 3. Persist application tokens
      if (res?.access_token) {
        setToken(res.access_token);
      }
      if (res?.refresh_token) {
        setRefreshToken(res.refresh_token);
      }

      // 4. Fetch full user profile
      let profile = null;
      try {
        profile = await api.getUserProfile();
      } catch {
        profile = {
          id: res?.id || '',
          name: 'Google User',
          role: res?.role || 'user',
        };
      }

      // 5. Store session user and trigger success callback
      setStoredUser(profile);
      if (onSuccess) {
        onSuccess(profile, res);
      }
    } catch (err) {
      const msg = err.message || 'Google orqali kirishda xatolik yuz berdi';
      setErrorMessage(msg);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    const msg = 'Google authentication was cancelled or failed';
    setErrorMessage(msg);
    if (onError) onError(new Error(msg));
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Google Login Button */}
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          shape="pill"
          width="360"
          text="continue_with"
        />
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="text-sm font-semibold text-emerald-600 animate-pulse flex items-center gap-2 mt-1">
          <svg className="animate-spin h-4 w-4 text-emerald-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Google orqali tekshirilmoqda...
        </div>
      )}

      {/* Error Message alert */}
      {errorMessage && (
        <div className="w-full text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-center mt-1">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
