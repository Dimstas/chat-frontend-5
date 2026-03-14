'use client';

import { useContactsSelectionStore } from 'modules/conversation/contacts/features/contacts-selection';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui';
import { InviteMembersPanel } from '../invite-members-panel';
import styles from './invite-members-block.module.scss';

export const InviteMembersBlock = (): JSX.Element => {
  const { query, setQuery, clearQuery, contacts, globals } = useContactsScreen();
  const enterSelectionMode = useContactsSelectionStore((s) => s.enterSelectionMode);
  console.log(contacts?.length, 'контакы');
  enterSelectionMode();
  const router = useRouter();

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.returnButton}
        onClick={() => {
          router.push('/new-group');
        }}
      >
        <div className={styles.iconAndLabelContainer}>
          <Image
            src="/images/settings/returnArrowIcon.svg"
            alt=""
            width={21}
            height={21}
            className={styles.returnIcon}
          />
          <span className={styles.labelText}>Пригласить участников</span>
        </div>
      </button>
      <ConversationLayout
        header={<SearchInput query={query} onChange={setQuery} onClear={clearQuery} />}
        footer={
          <div className={styles.createButtonContainer}>
            <ButtonUI
              variant="general"
              appearance="primary"
              label="Создать"
              type="button"
              disabled={false}
              onClick={() => {}}
            />
          </div>
        }
      >
        {
          <>
            <span className={styles.myContactsSpan}>Мои контакты</span>
            <InviteMembersPanel contacts={contacts} />
          </>
        }
      </ConversationLayout>
    </div>
  );
};
