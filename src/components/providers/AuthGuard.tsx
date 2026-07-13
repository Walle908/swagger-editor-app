'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { useRouter } from '@/i18n/navigation';

export function AuthGuard({ children }: { children: ReactNode }): ReactNode {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        router.replace('/');
      } else {
        try {
          await user.getIdToken(true);
          setLoading(false);
        } catch (_error) {
          router.replace('/');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}
