"use client";

import { useState } from 'react';
import { testApiConnection } from '@/lib/gameApi';
import { API_CONFIG } from '@/components/game/gameData';

export function ApiTester() {
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('Not tested');

  const handleTestApi = async () => {
    setIsTestingApi(true);
    setApiStatus('Testing...');
    
    try {
      const isConnected = await testApiConnection();
      setApiStatus(isConnected ? '✅ Connected' : '❌ Failed to connect');
    } catch (error) {
      setApiStatus(`❌ Error: ${error}`);
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm">
      <div className="mb-2">
        <strong>API Debug Panel</strong>
      </div>
      <div className="mb-2">
        <strong>Endpoint:</strong> {API_CONFIG.BASE_URL}
      </div>
      <div className="mb-2">
        <strong>Status:</strong> {apiStatus}
      </div>
      <button
        onClick={handleTestApi}
        disabled={isTestingApi}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {isTestingApi ? 'Testing...' : 'Test API'}
      </button>
    </div>
  );
}
