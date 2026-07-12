export function setUidCookie(uid: string): void {
  document.cookie = `uid=${uid}; path=/; SameSite=Lax`;
}

export function clearUidCookie(): void {
  document.cookie = `uid=; path=/; max-age=0; SameSite=Lax`;
}
