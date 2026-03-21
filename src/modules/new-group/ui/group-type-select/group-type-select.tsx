import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { GroupType, useGroupTypeSelect } from '../../lib/group-type-select/use-groupe-type-select';
import styles from './group-type-select.module.scss';

type GroupTypeSelectProps = {
  initial?: GroupType;
  onChange?: (type: GroupType) => void;
};

const GroupTypeSelect: React.FC<GroupTypeSelectProps> = ({ initial, onChange }) => {
  const { selected, selectClosed, selectOpen } = useGroupTypeSelect({ initial });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOpen = (): void => setIsOpen((prev) => !prev);

  const handleChange = (type: GroupType): void => {
    if (type === 'private-group') selectClosed();
    else selectOpen();
    onChange?.(type);
    setIsOpen(false);
  };

  const selectedLabel: string = selected === 'private-group' ? 'Закрытая' : 'Открытая';

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <label className={styles.label}>Тип группы</label>
      <div className={styles.field} onClick={toggleOpen}>
        <span className={styles.value}>{selectedLabel}</span>
        <span className={styles.arrow}>
          <Image
            src={isOpen ? '/images/new-group/upArrowIcon.svg' : '/images/new-group/downArrowIcon.svg'}
            alt=""
            width={12}
            height={8}
          />
        </span>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          <label className={`${styles.option} ${selected === 'private-group' ? styles.selected : ''}`}>
            <input
              type="radio"
              name="groupType"
              value="private-group"
              checked={selected === 'private-group'}
              onChange={() => handleChange('private-group')}
              className={styles.radio}
            />
            <span className={styles.radioCustom}></span>
            <div className={styles.optionContent}>
              <span className={styles.optionTitle}>Закрытая</span>
              <span className={styles.optionDescription}>
                В закрытую группу можно попасть только по приглашению или пригласительной ссылке
              </span>
            </div>
          </label>

          <label className={`${styles.option} ${selected === 'public-group' ? styles.selected : ''}`}>
            <input
              type="radio"
              name="groupType"
              value="public-group"
              checked={selected === 'public-group'}
              onChange={() => handleChange('public-group')}
              className={styles.radio}
            />
            <span className={styles.radioCustom}></span>
            <div className={styles.optionContent}>
              <span className={styles.optionTitle}>Открытая</span>
              <span className={styles.optionDescription}>
                Открытую группу можно найти через поиск. Присоединиться к ней может любой пользователь
              </span>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default GroupTypeSelect;
