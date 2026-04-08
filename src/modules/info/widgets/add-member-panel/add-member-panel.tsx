import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { SearchInput } from 'modules/conversation/shared/ui';
import { JSX } from 'react';
import { ParticipantsPanel } from '../participant-panel';
import styles from './add-member-panel.module.scss';

export const AddMemberPanel = (): JSX.Element => {
  const { query, setQuery, clearQuery, contacts } = useContactsScreen();

  const participants = contacts?.map((c) => ({
    uid: c.uid,
    firstName: c.firstName,
    lastName: c.lastName,
    avatarUrl: c.avatarUrl,
    avatarWebpUrl: '',
    avatarSmallUrl: '',
    avatarMasterUrl: '',
    isOwner: false,
    isBlocked: false,
    isOnline: c.isOnline,
    isDeleted: false,
    isInContacts: true,
    wasOnlineAt: c.wasOnlineAt,
  }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.search}>
        <SearchInput query={query} onChange={setQuery} onClear={clearQuery} />
      </div>
      <div className={styles.label}>Мои контакты</div>
      <ParticipantsPanel participants={participants} />
    </div>
  );
};
