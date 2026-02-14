'use client';

import { AllSettingsBlock } from 'modules/settings';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';

export default function SettingsPage(): JSX.Element {
  const router = useRouter();
  const handleProfileEdit = (): void => {
    router.push('/settings/edit-profile');
  };

  const handleSupport = (): void => {
    router.push('/settings/support');
  };

  const handleLeave = async (): Promise<void> => {
    try {
      await fetch('/api/auth/remove-tokens', {
        method: 'POST',
      });
      router.push('/auth');
      console.log('Cookies cleared via API route');
    } catch (error) {
      console.error('Failed to clear cookies:', error);
    }
  };

  return (
    <AllSettingsBlock
      editProfile={handleProfileEdit}
      blackList={() => {}}
      support={handleSupport}
      leave={handleLeave}
    />
  );
}
