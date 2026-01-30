'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean, message?: string) => void;
  message: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true); // 初始加载状态
  const [message, setMessage] = useState('正在加载精彩内容...');

  const setLoading = (loading: boolean, newMessage?: string) => {
    setIsLoading(loading);
    if (newMessage) {
      setMessage(newMessage);
    }
  };

  // 页面加载完成后自动隐藏加载动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1秒后隐藏初始加载动画

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, message }}>
      {children}
      {isLoading && <LoadingSpinner message={message} delay={0} />}
    </LoadingContext.Provider>
  );
}