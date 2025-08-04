export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export type ModalType =
  | 'login'
  | 'register'
  | 'createProject'
  | 'addMember'
  | 'addTask'
  | null;

export interface ModalContextProps {
  modal: ModalType;
  modalProps?: Record<string, unknown>;
  openModal: (type: ModalType, props?: Record<string, unknown>) => void;
  closeModal: () => void;
}
