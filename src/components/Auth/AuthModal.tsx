import { useState } from 'react';
import { Modal } from '@mantine/core';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({
  opened,
  onClose,
  initialMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  const handleClose = () => {
    setMode(initialMode);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={mode === 'login' ? 'Sign In' : 'Create Account'}
      centered
      size='sm'
    >
      {mode === 'login' ? (
        <LoginForm onSwitchToSignup={() => setMode('signup')} />
      ) : (
        <SignupForm onSwitchToLogin={() => setMode('login')} />
      )}
    </Modal>
  );
}
