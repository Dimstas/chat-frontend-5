import clsx from 'clsx';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui/image';
import styles from './default-messages-page.module.scss';
const URL_DEFAUIT = '/images/messages-chats/default-img.svg';

export const DefaultMessagesPage = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <ImageUI
        src={URL_DEFAUIT}
        alt="Дефолтный рисунок"
        loading="eager"
        width={200}
        height={200}
        className={styles.image}
      />
      <div className={styles.textWrapper}>
        <span className={clsx(styles.text, styles.title)}> Сообщений пока нет</span>
        <span className={clsx(styles.text, styles.message)}> Напишите первым :)</span>
      </div>
    </div>
  );
};
