import { JSX } from 'react';
import styles from './information-card-for-group.module.scss';
import type { InformationForGroupCardProps } from './information-card-for-group.props';
export const InformationForGroupCard = ({ message, register }: InformationForGroupCardProps): JSX.Element => {
  return (
    <div
      className={styles.box}
      ref={(el) => {
        register(el, message);
      }}
    >
      <div className={styles.wrapper}>
        <span className={styles.text}> {message.content?.split(' ').slice(1).join(' ')} </span>
      </div>
    </div>
  );
};
