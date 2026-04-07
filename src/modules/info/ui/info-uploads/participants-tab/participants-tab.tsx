import { ContactCardSelectable } from 'modules/conversation/contacts/features/contacts-selection';
import { useParticipantsScreen } from 'modules/info/screens/use-participant-screen';
import { ParticipantsPanel } from 'modules/info/widgets/participant-panel';
import { JSX } from 'react';
import AddIcon from '../../../shared/icons/add.svg';
import { ActionButton } from '../../action-button';
import styles from './participants-tab.module.scss';
import { ParticipantsTabProps } from './participants-tab.props';
import { SearchPanel } from './search-panel';

export const ParticipantsTab = ({ currentUid, chatKey }: ParticipantsTabProps): JSX.Element => {
  const { query, setQuery, clearQuery, participants, filtered } = useParticipantsScreen(chatKey);

  const owner = filtered?.find((p) => p.isOwner);
  const members = filtered?.filter((p) => !p.isOwner) ?? [];
  const current = participants?.find((p) => p.uid === currentUid);

  return (
    <div className={styles.wrapper}>
      {current && <ActionButton icon={<AddIcon />} label={'Пригласить в группу'} onClick={() => {}} />}
      <SearchPanel query={query} onChange={setQuery} onClear={clearQuery} />
      {query ? (
        <>
          <ParticipantsPanel participants={filtered} />
        </>
      ) : (
        <>
          <div className={styles.label}>Владелец</div>
          <ContactCardSelectable
            phone={''}
            nickname={''}
            fullName={`${owner?.firstName} ${owner?.lastName}`}
            uid={owner?.uid ?? ''}
            firstName={owner?.firstName ?? ''}
            lastName={owner?.lastName ?? ''}
            avatarUrl={owner?.avatarUrl ?? ''}
            isOnline={owner?.isOnline ?? false}
            wasOnlineAt={owner?.wasOnlineAt ?? 0}
          />
          {members.length > 0 && (
            <>
              <div className={styles.label}>Участники</div>
              <ParticipantsPanel participants={members} />
            </>
          )}
        </>
      )}
    </div>
  );
};
