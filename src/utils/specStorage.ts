import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { LangType } from '@/types/types';

export interface SavedSpec {
  content: string;
  format: LangType;
  updatedAt: string;
}

export async function saveUserSpec(
  userId: string,
  content: string,
  format: LangType
): Promise<void> {
  const specRef = doc(db, 'specs', userId);

  const payload: SavedSpec = {
    content,
    format,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(specRef, payload);
}

export async function getUserSpec(userId: string): Promise<SavedSpec | null> {
  const specRef = doc(db, 'specs', userId);
  const snapshot = await getDoc(specRef);

  return (snapshot.data() as SavedSpec) ?? null;
}
