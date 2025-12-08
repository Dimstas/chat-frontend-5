import clsx from 'clsx';
import { JSX } from 'react';
import { ButtonProps, ButtonVariant } from 'shared/ui/button/button.props';
import styles from './button.module.scss';

export const ButtonUI = <V extends ButtonVariant>({
  label,
  variant,
  appearance,
  ...props
}: ButtonProps<V>): JSX.Element => {
  return (
    <button className={clsx(styles[variant], styles[appearance])} {...props}>
      {label}
    </button>
  );
};
