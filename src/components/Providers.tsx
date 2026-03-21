'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/src/store';
import { useAppDataLoader } from '@/src/hooks/useAppDataLoader';

const DataLoader = (props: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAppDataLoader();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setCanRender(true), 100);
    }
  }, [isLoading]);

  if (!isAuthenticated) {
    return <>{props.children}</>;
  }
  if (isLoading || !canRender) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{props.children}</>;
};

export const Providers = (props: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <DataLoader>{props.children}</DataLoader>
    </Provider>
  );
};
