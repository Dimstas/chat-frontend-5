import { JSX } from 'react';
import { messagesList } from '../../utils/messades-placeholder';
import styles from './messages-list.module.scss';

export const MessagesList = ({ user_uid }: { user_uid: string }): JSX.Element => {
  const { results } = messagesList;
  return <div className={styles.wrapper}> vvvvv </div>;
};
