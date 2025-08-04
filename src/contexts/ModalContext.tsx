import {
  createContext,
  useState,
  type JSX,
  type ReactNode,
} from 'react';
import type { ModalContextProps, ModalType } from '../types/types';

// eslint-disable-next-line react-refresh/only-export-components
export const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }): JSX.Element {
  const [modal, setModal] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<Record<string, unknown>>({});

  const openModal = (type: ModalType, props: Record<string, unknown> = {}): void => {
    setModal(type);
    setModalProps(props);
  };

  const closeModal = (): void => {
    setModal(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ modal, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

