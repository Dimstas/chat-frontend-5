'use client';

import { useContactsSelectionStore } from 'modules/conversation/contacts/features/contacts-selection';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { useWebSocketCreateGroup } from 'modules/new-group/api/web-socket/use-web-socket-create-group';
import { useNewGroupStore } from 'modules/new-group/model/new-group-store';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';
import { ButtonUI } from 'shared/ui';
import { InviteMembersPanel } from '../invite-members-panel';
import styles from './invite-members-block.module.scss';

type InviteMembersBlockProps = {
  wsUrl: string;
};

export const InviteMembersBlock = ({ wsUrl }: InviteMembersBlockProps): JSX.Element => {
  const { query, setQuery, clearQuery, contacts } = useContactsScreen();
  const enterSelectionMode = useContactsSelectionStore((s) => s.enterSelectionMode);
  const selectedUids = useContactsSelectionStore((s) => s.selectedIds);
  const { name, description, chatType, avatarUid, resetGroup } = useNewGroupStore();
  const { createGroup } = useWebSocketCreateGroup(wsUrl);
  const exitSelectionMode = useContactsSelectionStore((s) => s.exitSelectionMode);
  const router = useRouter();

  useEffect(() => {
    enterSelectionMode();
  }, [enterSelectionMode]);

  const handleCreateGroup = async (): Promise<void> => {
    if (!name.trim()) {
      alert('Введите название группы');
      router.push('/new-group');
      return;
    }

    const usersArray = Array.isArray(selectedUids) ? selectedUids : Array.from(selectedUids);

    if (usersArray.length === 0) {
      alert('Выберите хотя бы одного участника');
      return;
    }

    try {
      const result = await createGroup({
        name,
        chatType,
        uidUsersList: usersArray,
        description: description || undefined,
        avatarUid,
      });

      resetGroup();
      exitSelectionMode();
      console.log('созданная группа', result);
      router.push(`/new-group`);
    } catch (error) {
      console.error('Ошибка создания группы:', error);
      alert('Не удалось создать группу. Попробуйте позже.');
    }
  };

  const hasSelected = Array.isArray(selectedUids) ? selectedUids.length > 0 : selectedUids.size > 0;

  return (
    <div className={styles.container}>
      <button type="button" className={styles.returnButton} onClick={() => router.push('/new-group')}>
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
              disabled={!hasSelected}
              onClick={handleCreateGroup}
            />
          </div>
        }
      >
        <>
          <span className={styles.myContactsSpan}>Мои контакты</span>
          <InviteMembersPanel contacts={contacts} />
        </>
      </ConversationLayout>
    </div>
  );
};
