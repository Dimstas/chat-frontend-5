import { useParticipantsScreen } from 'modules/info/screens/use-participant-screen';
import { JSX } from 'react';
import AddIcon from '../../../shared/icons/add.svg';
import { ActionButton } from '../../action-button';
import { ParticipantsTabProps } from './participants-tab.props';

export const ParticipantsTab = ({ currentUid, chatKey }: ParticipantsTabProps): JSX.Element => {
  const { query, setQuery, clearQuery, participants } = useParticipantsScreen(chatKey);

  const owner = participants?.find((p) => p.isOwner);
  const members = participants?.filter((p) => !p.isOwner);
  const current = participants?.find((p) => p.uid === currentUid);

  return (
    <div>
      {current && <ActionButton icon={<AddIcon />} label={'Пригласить в группу'} onClick={() => {}} />}
      <div>Владелец</div>
      <div>{`${owner?.firstName} ${owner?.lastName}`}</div>
      <div>Участники</div>
      <ul>
        {members?.map((p) => (
          <div key={p.uid}>{`${p.firstName} ${p.lastName}`}</div>
        ))}
      </ul>
    </div>
  );
};
