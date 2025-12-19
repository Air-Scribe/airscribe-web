import { Loader } from '@mantine/core';

export const LoadingScreen = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem',
    }}
  >
    <Loader size='lg' />
  </div>
);
