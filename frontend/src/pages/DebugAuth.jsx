import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DebugAuth = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [localStorageData, setLocalStorageData] = useState({});

  useEffect(() => {
    console.log('=== AUTH DEBUG INFO ===');
    console.log('Loading:', loading);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('User Object:', user);
    console.log('User Role:', user?.role);
    console.log('Local Storage User:', localStorage.getItem('user'));
    console.log('Local Storage Token:', localStorage.getItem('token'));
    
    // Parse localStorage user if it exists
    try {
      const localStorageUser = localStorage.getItem('user');
      if (localStorageUser) {
        const parsedUser = JSON.parse(localStorageUser);
        console.log('Parsed Local Storage User:', parsedUser);
        console.log('Parsed User Role:', parsedUser?.role);
      }
    } catch (error) {
      console.error('Error parsing localStorage user:', error);
    }
    
    console.log('========================');
    
    // Set localStorage data for display
    setLocalStorageData({
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user'),
      parsedUser: (() => {
        try {
          const userData = localStorage.getItem('user');
          return userData ? JSON.parse(userData) : null;
        } catch (error) {
          return { error: 'Parse Error' };
        }
      })()
    });
  }, [user, isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading authentication data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Authentication Debug</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Auth Context</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Loading:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{loading ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Authenticated:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{isAuthenticated ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">User:</span>
                  <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-x-auto">
                    {user ? JSON.stringify(user, null, 2) : 'null'}
                  </pre>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">User Role:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{user?.role || 'undefined'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Local Storage</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Token:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {localStorageData.token ? 'Present' : 'Missing'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">User Data:</span>
                  <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-x-auto">
                    {localStorageData.user || 'null'}
                  </pre>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Parsed Role:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {localStorageData.parsedUser?.role || 'undefined'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Role Validation Test</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Context Role Check:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {user?.role === 'patient' ? '✅ Pass' : '❌ Fail'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">LocalStorage Role Check:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {localStorageData.parsedUser?.role === 'patient' ? '✅ Pass' : '❌ Fail'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Fallback Role Check:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {(user?.role || localStorageData.parsedUser?.role || 'patient') === 'patient' ? '✅ Pass' : '❌ Fail'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Auth & Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;