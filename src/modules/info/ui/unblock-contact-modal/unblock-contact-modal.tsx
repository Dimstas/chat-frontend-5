import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useUnblockUserMutation } from 'modules/info/api/info.query';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

export const UnblockContactModal = (): JSX.Element | null => {
  const { contacts, globals } = useContactsScreen();
  const { selectedUid, isUnblockModalOpen, closeUnblockModal } = useInfoStore();

  const { mutate: unblockContact } = useUnblockUserMutation(selectedUid ?? '');

  const contact = contacts?.find((c) => c.uid === selectedUid) ?? globals?.find((c) => c.uid === selectedUid);
  const { firstName, lastName } = contact ?? {};

  const handleUnblock = (): void => {
    if (selectedUid) {
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
