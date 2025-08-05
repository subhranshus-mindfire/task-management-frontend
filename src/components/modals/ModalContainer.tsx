import { useEffect, useRef, type JSX } from 'react';
import RegisterModal from './RegisterModal';
import { useModal } from '../../hooks/Modal';
import LoginModal from './LoginModal';
import AddMemberModal from './AddMemberModal';
import CreateProjectModal from './AddProjectModal';
import AddTaskModal from './AddTaskModal';

interface ModalContainerProps {
  theme?: 'light' | 'dark';
}

export default function ModalContainer({ theme }: ModalContainerProps): JSX.Element | null {
  const { modal, modalProps, closeModal } = useModal();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [closeModal]);

  if (!modal) { return null; }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div ref={modalRef} className="w-full max-w-md">
        {modal === 'login' && <LoginModal onClose={closeModal} theme={theme} />}
        {modal === 'register' && <RegisterModal onClose={closeModal} />}
        {modal === 'createProject' && <CreateProjectModal />}
        {modal === 'addMember' && (
          <AddMemberModal
            onClose={closeModal}
            projectId={modalProps?.projectId as string}
            theme={theme}
          />
        )}
        {modal === 'addTask' && (
          <AddTaskModal
            onClose={closeModal}
            onTaskCreated={modalProps?.onTaskCreated as () => void}
            projectId={modalProps?.projectId as string}
          />
        )}
      </div>
    </div>
  );
}
