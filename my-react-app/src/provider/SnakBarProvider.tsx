import { SnackbarProvider } from 'notistack';

export function NotistackProvider() {
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={2000}
      maxSnack={3}
      preventDuplicate
    />
  );
}
