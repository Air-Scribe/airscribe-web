import { useAuth } from '../../../contexts/AuthContext';

export function useUserButtonContainer() {
  const { user, signOut } = useAuth();

  // Handle case where user is not authenticated
  if (!user) {
    return {
      isAuthenticated: false,
      user: null,
      name: '',
      email: '',
      avatar: '',
      handleLogout: async () => {},
    };
  }

  // Extract user data
  const name = user.user_metadata?.full_name || user.email || 'User';
  const email = user.email || '';

  // Handle avatar with fallback strategy
  const avatar =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || '';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    isAuthenticated: true,
    user,
    name,
    email,
    avatar,
    handleLogout,
  };
}
