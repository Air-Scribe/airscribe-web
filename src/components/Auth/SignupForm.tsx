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
import {
  IconAlertCircle,
  IconCheck,
  IconBrandGoogle,
} from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, { full_name: fullName });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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

  if (success) {
    return (
      <Stack gap='md' align='center'>
        <Alert icon={<IconCheck size={16} />} color='green'>
          Check your email for a confirmation link to complete your
          registration!
        </Alert>
        <Button variant='outline' onClick={onSwitchToLogin}>
          Back to Sign In
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap='md'>
      <Text size='lg' fw={500}>
        Create Account
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
            label='Full Name'
            placeholder='Your full name'
            value={fullName}
            onChange={e => setFullName(e.currentTarget.value)}
          />

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

          <PasswordInput
            label='Confirm Password'
            placeholder='Confirm your password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.currentTarget.value)}
            required
          />

          <Button type='submit' loading={loading} fullWidth>
            Create Account
          </Button>
        </Stack>
      </form>

      <Group justify='center'>
        <Text size='sm' c='dimmed'>
          Already have an account?{' '}
          <Text
            component='button'
            type='button'
            c='blue'
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={onSwitchToLogin}
          >
            Sign in
          </Text>
        </Text>
      </Group>
    </Stack>
  );
}
