import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext({
  isLoading: false,
  error: null,
  clearError: () => {},
});

export function AppProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const value = {
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppProvider;
