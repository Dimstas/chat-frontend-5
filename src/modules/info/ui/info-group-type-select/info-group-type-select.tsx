import { useInfoEditGroupStore } from 'modules/info/model/info.edit-group.store';
import { GroupType } from 'modules/new-group/lib/group-type-select/use-groupe-type-select';
import GroupTypeSelect from 'modules/new-group/ui/group-type-select/group-type-select';
import { JSX } from 'react';
import styles from './info-group-type-select.module.scss';

export const InfoGroupTypeSelect = ({ chatType }: { chatType: GroupType }): JSX.Element => {
  const { setGroupData } = useInfoEditGroupStore();

  const handleTypeChange = (type: GroupType): void => {
    setGroupData({ chatType: type });
  };

  return (
    <div className={styles.wrapper}>
      <GroupTypeSelect initial={chatType} onChange={handleTypeChange} />
    </div>
  );
};
