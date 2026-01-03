import { JSX } from 'react';
import SmailIcon from './icon/smail.svg';
import styles from './message-input.module.scss';

export const MessageInput = (): JSX.Element => {
  return (
    <div className={styles.inputWrapper}>
      <form className={styles.form}>
        <input
          id="message"
          name="message"
          type="text"
          defaultValue=""
          placeholder="Сообщение"
          className={styles.input}
        />
      </form>
      <span className={styles.icon}>
        <button>
          <SmailIcon />
        </button>
      </span>
    </div>
  );
};
