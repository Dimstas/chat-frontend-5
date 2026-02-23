'use client';

import {
  ContactCardSelectable,
  DeleteSelectedContactsButton,
} from 'modules/conversation/contacts/features/contacts-selection'; // Убедитесь, что путь правильный
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, useCallback } from 'react';
import { useGetBlacklist } from 'shared/query/blacklist.query';
import styles from './black-list-block.module.scss';

export const BlackListBlock: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { data: blacklistResponse, isLoading, error } = useGetBlacklist();

  const handleReturnButton = useCallback((): void => {
    router.push('/settings');
  }, [router]);
  let blacklist = blacklistResponse?.results;
  blacklist = [
    {
      uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      username: 'string',
      nickname: 'string',
      phone: 'string',
      first_name: 'string',
      last_name: 'string',
      avatar: '/images/avatars/avatar-3.svg',
      avatar_url: '/images/avatars/avatar-3.svg',
      avatar_webp: '/images/avatars/avatar-3.svg',
      avatar_webp_url: '/images/avatars/avatar-3.svg',
      additional_information: 'string',
      birthday: 0,
      chat_id: 0,
      is_online: true,
      was_online_at: 0,
    },
  ];
  return (
    <div className={styles.container}>
      <button type="button" className={styles.returnButton} onClick={handleReturnButton}>
        <div className={styles.iconAndLabelContainer}>
          <Image
            src="/images/settings/returnArrowIcon.svg"
            alt=""
            width={21}
            height={21}
            className={styles.returnIcon}
          />
          <span className={styles.labelText}>Черный список</span>
        </div>
      </button>
      <ConversationLayout
        header={<SearchInput query={''} onChange={() => 'void'} />}
        footer={<DeleteSelectedContactsButton />}
      >
        {!isLoading && !error && blacklist && (
          <ul>
            {blacklist.map((contact) => (
              <ContactCardSelectable fullName={'string'} wasOnlineAt={0} key={contact.uid} {...contact} />
            ))}
          </ul>
        )}
      </ConversationLayout>
      {/* Если данных нет, но и ошибки нет */}
      {!isLoading && !error && (!blacklistResponse || blacklist?.length === 0) && <p>Чёрный список пуст.</p>}
    </div>
  );
};
