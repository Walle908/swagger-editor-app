'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { useRouter } from '@/i18n/navigation';
import UnauthorizedPage from '@/components/authPages/unauthorized/Unauthorized';

interface AuthGuardProps {
  children: ReactNode;
  serverUid?: string;
}

const REDIRECT_DELAY_MS = 3000;

export function AuthGuard({ children, serverUid }: AuthGuardProps): ReactNode {
  const [loading, setLoading] = useState(!serverUid);
  const [isAuthorized, setIsAuthorized] = useState(!!serverUid);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setIsAuthorized(false);
        setLoading(false);
      } else {
        try {
          await user.getIdToken(true);
          setIsAuthorized(true);
          setLoading(false);
        } catch (_error) {
          setIsAuthorized(false);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || isAuthorized) return;

    const timeout = setTimeout(() => {
      router.replace('/');
    }, REDIRECT_DELAY_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [loading, isAuthorized, router]);

  if (loading) {
    return null;
  }

  if (!isAuthorized) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
}
