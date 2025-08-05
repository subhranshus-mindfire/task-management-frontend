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

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'complete' | 'incomplete';
  dueDate: string;
  projectId: {
    _id: string;
    name: string;
    description?: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  created_at: string;
}
