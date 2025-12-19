import { UserButtonContainer } from '../../UserButton/UserButtonContainer';

interface NavbarFooterProps {
  collapsed: boolean;
}

export function NavbarFooter({ collapsed }: NavbarFooterProps) {
  return (
    <div>
      <UserButtonContainer collapsed={collapsed} />
    </div>
  );
}
