import { UserButton } from './UserButton';
import { useUserButtonContainer } from './hooks/useUserButtonContainer';

interface UserButtonContainerProps {
  collapsed: boolean;
}

export function UserButtonContainer({ collapsed }: UserButtonContainerProps) {
  const { isAuthenticated, name, email, avatar, handleLogout } =
    useUserButtonContainer();

  // Handle case where user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <UserButton
      collapsed={collapsed}
      name={name}
      email={email}
      avatar={avatar}
      onLogout={handleLogout}
    />
  );
}
