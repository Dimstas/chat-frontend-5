import { ContactCardSelectable } from 'modules/conversation/contacts/features/contacts-selection';
import { Participant } from 'modules/info/entity/info.entity';
import { JSX } from 'react';

export const ParticipantsPanel = ({ participants }: { participants?: Participant[] }): JSX.Element => {
  return (
    <div>
      <ul>
        {participants?.map((member) => (
          <>
            <ContactCardSelectable
              key={member.uid}
              phone={''}
              nickname={''}
              fullName={`${member.firstName} ${member.lastName}`}
              uid={member.uid}
              firstName={member.firstName}
              lastName={member.lastName}
              avatarUrl={member.avatarUrl}
              isOnline={member.isOnline}
              wasOnlineAt={member.wasOnlineAt ?? 0}
            />
          </>
        ))}
      </ul>
    </div>
  );
};
