import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';
import type { ModalContextProps } from '../types/types';

export function useModal(): ModalContextProps {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}