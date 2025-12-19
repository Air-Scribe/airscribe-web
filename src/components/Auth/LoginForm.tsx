import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Alert,
  Group,
  Divider,
} from '@mantine/core';
import { IconAlertCircle, IconBrandGoogle } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Stack gap='md'>
      <Text size='lg' fw={500}>
        Sign In
      </Text>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color='red'>
          {error}
        </Alert>
      )}

      {/* Google Sign In Button */}
      <Button
        variant='outline'
        color='gray'
        fullWidth
        leftSection={<IconBrandGoogle size={16} />}
        onClick={handleGoogleSignIn}
        loading={googleLoading}
      >
        Continue with Google
      </Button>

      <Divider label='Or continue with email' labelPosition='center' />

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit}>
        <Stack gap='md'>
          <TextInput
            label='Email'
            placeholder='your@email.com'
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            required
            type='email'
          />

          <PasswordInput
            label='Password'
            placeholder='Your password'
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
            required
          />

          <Button type='submit' loading={loading} fullWidth>
            Sign In
          </Button>
        </Stack>
      </form>

      <Group justify='center'>
        <Text size='sm' c='dimmed'>
          Don't have an account?{' '}
          <Text
            component='button'
            type='button'
            c='blue'
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={onSwitchToSignup}
          >
            Sign up
          </Text>
        </Text>
      </Group>
    </Stack>
  );
}
