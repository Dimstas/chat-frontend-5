import { JSX } from 'react';
import { ButtonUI } from 'shared/ui';
import styles from './info-group-settings-save-button.module.scss';

export const InfoGroupSettingsSaveButton = ({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <ButtonUI
        label={label}
        variant={'general'}
        appearance={disabled ? 'disabled' : 'primary'}
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  );
};
