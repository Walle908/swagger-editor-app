import SignUpPage from '@/views/signUpPage/SignUpPage';
import { GuestGuard } from '@/components/providers/GuestGuard';

export default function SignUp() {
  return (
    <GuestGuard>
      <SignUpPage />
    </GuestGuard>
  );
}
