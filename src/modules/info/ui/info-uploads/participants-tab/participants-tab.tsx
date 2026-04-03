import { useParticipantsScreen } from 'modules/info/screens/use-participant-screen';
import { JSX } from 'react';
import { ParticipantsTabProps } from './participants-tab.props';

export const ParticipantsTab = ({ currentUid, chatKey }: ParticipantsTabProps): JSX.Element => {
  const { query, setQuery, clearQuery, participants } = useParticipantsScreen(chatKey);

  return (
    <div>
      <ul>
        {participants?.map((p) => (
          <div key={p.uid}>{`${p.firstName} ${p.lastName}`}</div>
        ))}
      </ul>
    </div>
  );
};
