'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then(() => router.replace('/dashboard'))
      .catch(() => router.replace('/login'));
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
