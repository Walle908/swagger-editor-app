'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { useRouter } from '@/i18n/navigation';

export function GuestGuard({ children }: { children: ReactNode }): ReactNode {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (user) {
        router.replace('/');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}
