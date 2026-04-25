'use client';

import { useContactsSelectionStore } from 'modules/conversation/contacts/features/contacts-selection';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { useWebSocketCreateGroup } from 'modules/new-group/api/web-socket/use-web-socket-create-group';
import { useNewGroupStore } from 'modules/new-group/model/new-group-store';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { JSX, useEffect } from 'react';
import { ButtonUI } from 'shared/ui';
import { InviteMembersPanel } from '../invite-members-panel';
import styles from './invite-members-block.module.scss';

type InviteMembersBlockProps = {
  wsUrl: string;
};

export const InviteMembersBlock = ({ wsUrl }: InviteMembersBlockProps): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();

  // Определяем режим по пути
  const mode = pathname.includes('/new-channel') ? 'channel' : 'group';

  const { query, setQuery, clearQuery, contacts } = useContactsScreen();
  const enterSelectionMode = useContactsSelectionStore((s) => s.enterSelectionMode);
  const selectedUids = useContactsSelectionStore((s) => s.selectedIds);
  const { name, description, chatType, avatarUid, resetGroup, setMode } = useNewGroupStore();
  const { createGroup } = useWebSocketCreateGroup(wsUrl);
  const exitSelectionMode = useContactsSelectionStore((s) => s.exitSelectionMode);

  // Устанавливаем режим
  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  useEffect(() => {
    enterSelectionMode();
  }, [enterSelectionMode]);

  const title = 'Пригласить участников';
  const backPath = mode === 'group' ? '/new-group' : '/new-channel';
  const successPath = mode === 'group' ? '/new-group' : '/new-channel';
  const buttonLabel = 'Создать';

  const handleCreate = async (): Promise<void> => {
    if (!name.trim()) {
      alert(`Введите название ${mode === 'group' ? 'группы' : 'канала'}`);
      router.push(backPath);
      return;
    }

    const usersArray = Array.isArray(selectedUids) ? selectedUids : Array.from(selectedUids);

    if (mode === 'group' && usersArray.length === 0) {
      alert('Выберите хотя бы одного участника');
      return;
    }

    try {
      const result = await createGroup({
        name,
        chatType,
        uidUsersList: usersArray,
        description: description || undefined,
        avatarUid: avatarUid || undefined,
      });

      resetGroup();
      exitSelectionMode();
      console.log(`Создан ${mode === 'group' ? 'группа' : 'канал'}:`, result);
      router.push(successPath);
    } catch (error) {
      console.error(`Ошибка создания ${mode === 'group' ? 'группы' : 'канала'}:`, error);
      alert(`Не удалось создать ${mode === 'group' ? 'группу' : 'канал'}. Попробуйте позже.`);
    }
  };

  const hasSelected =
    mode === 'group' ? (Array.isArray(selectedUids) ? selectedUids.length > 0 : selectedUids.size > 0) : true; // Для канала выбор участников опционален

  return (
    <div className={styles.container}>
      <button type="button" className={styles.returnButton} onClick={() => router.push(backPath)}>
        <div className={styles.iconAndLabelContainer}>
          <Image
            src="/images/settings/returnArrowIcon.svg"
            alt=""
            width={21}
            height={21}
            className={styles.returnIcon}
          />
          <span className={styles.labelText}>{title}</span>
        </div>
      </button>

      <ConversationLayout
        header={<SearchInput query={query} onChange={setQuery} onClear={clearQuery} />}
        footer={
          <div className={styles.createButtonContainer}>
            <ButtonUI
              variant="general"
              appearance="primary"
              label={buttonLabel}
              type="button"
              disabled={!hasSelected}
              onClick={handleCreate}
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
