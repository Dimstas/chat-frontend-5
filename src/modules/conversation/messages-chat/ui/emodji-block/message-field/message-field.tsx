import {
  achievementSmilingArray,
  animalsSmilingArray,
  calculatorSmilingArray,
  faceSmilingArray,
  foodSmilingArray,
  natureSmilingArray,
  peopleSmilingArray,
  signalSmilingArray,
} from 'modules/conversation/messages-chat/utils/emojis-array';
import { JSX } from 'react';
import Icon1 from './icons/icon1.svg';
import Icon10 from './icons/icon10.svg';
import Icon2 from './icons/icon2.svg';
import Icon3 from './icons/icon3.svg';
import Icon4 from './icons/icon4.svg';
import Icon5 from './icons/icon5.svg';
import Icon6 from './icons/icon6.svg';
import Icon7 from './icons/icon7.svg';
import Icon8 from './icons/icon8.svg';
import Icon9 from './icons/icon9.svg';
import styles from './message-field.module.scss';
import type { MessageFieldProps } from './message-field.props';

export const MessageField = ({ recentEmojisStore, setSelectedSmileys }: MessageFieldProps): JSX.Element => {
  const handlerOnClick = (smileysArray: string[]): void => {
    setSelectedSmileys(smileysArray);
  };
  const emojisArraysField = [
    {
      iconButton: recentEmojisStore.length ? <Icon2 /> : <Icon10 />,
      smilingArray: faceSmilingArray,
    },
    {
      iconButton: <Icon3 />,
      smilingArray: peopleSmilingArray,
    },
    {
      iconButton: <Icon4 />,
      smilingArray: animalsSmilingArray,
    },
    {
      iconButton: <Icon5 />,
      smilingArray: foodSmilingArray,
    },
    {
      iconButton: <Icon6 />,
      smilingArray: natureSmilingArray,
    },
    {
      iconButton: <Icon7 />,
      smilingArray: achievementSmilingArray,
    },
    {
      iconButton: <Icon8 />,
      smilingArray: calculatorSmilingArray,
    },
    {
      iconButton: <Icon9 />,
      smilingArray: signalSmilingArray,
    },
  ];
  return (
    <>
      <div className={styles.wrapper}>
        {!!recentEmojisStore.length && (
          <button onClick={() => handlerOnClick(faceSmilingArray)}>
            <div className={styles.viletIconContainer}>
              <Icon1 />
            </div>
          </button>
        )}
        {emojisArraysField.map((emojisArray, index) => (
          <button key={index} onClick={() => handlerOnClick(emojisArray.smilingArray)}>
            <div className={styles.grayIconContainer}>{emojisArray.iconButton}</div>
          </button>
        ))}
      </div>
    </>
  );
};
