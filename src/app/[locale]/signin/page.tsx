import SignInPage from '@/views/signInPage/SignInPage';
import { GuestGuard } from '@/components/providers/GuestGuard';

export default function SignIn() {
  return (
    <GuestGuard>
      <SignInPage />
    </GuestGuard>
  );
}
