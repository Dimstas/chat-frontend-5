import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useUnblockUserMutation } from 'modules/info/api/info.query';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

export const UnblockContactModal = (): JSX.Element | null => {
  const { contacts, globals } = useContactsScreen();
  const { uid, isUnblockModalOpen, closeUnblockModal } = useInfoStore();

  const { mutate: unblockContact } = useUnblockUserMutation(uid ?? '');

  const contact = contacts?.find((c) => c.uid === uid) ?? globals?.find((c) => c.uid === uid);
  const { firstName, lastName } = contact ?? {};

  const handleUnblock = (): void => {
    if (uid) {
      unblockContact();
    }
    closeUnblockModal();
  };

  if (!isUnblockModalOpen) return null;

  return (
    <Modal
      title={`Разблокировать ${firstName} ${lastName}?`}
      content=""
      firstButtonText="Да"
      secondButtonText="Нет"
      onFirstButtonClick={handleUnblock}
      onSecondButtonClick={closeUnblockModal}
      onClose={closeUnblockModal}
    />
  );
};
