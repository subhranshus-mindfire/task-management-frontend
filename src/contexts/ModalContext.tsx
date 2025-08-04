import {
  createContext,
  useState,
  type JSX,
  type ReactNode,
} from 'react';
import type { ModalContextProps, ModalType } from '../types/types';

export const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }): JSX.Element {
  const [modal, setModal] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<Record<string, unknown>>({});

  const openModal = (type: ModalType, props: Record<string, unknown> = {}) => {
    setModal(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setModal(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ modal, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

