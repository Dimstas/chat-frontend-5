import { ChatType } from 'modules/new-group/model/new-group-store';
import GroupTypeSelect from 'modules/new-group/ui/group-type-select/group-type-select';
import { JSX } from 'react';
import styles from './info-group-type-select.module.scss';

type InfoGroupTypeSelectProps = {
  chatType: ChatType;
  onChange: (type: ChatType) => void;
};

export const InfoGroupTypeSelect = ({ chatType, onChange }: InfoGroupTypeSelectProps): JSX.Element => {
  // Определяем режим по значению chatType
  const mode = chatType.includes('channel') ? 'channel' : 'group';

  const handleTypeChange = (type: ChatType): void => {
    onChange(type);
  };

  return (
    <div className={styles.wrapper}>
      <GroupTypeSelect mode={mode} initial={chatType} onChange={handleTypeChange} />
    </div>
  );
};
