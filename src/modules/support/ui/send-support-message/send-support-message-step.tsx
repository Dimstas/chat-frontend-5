// src/modules/support/ui/send-support-message-step/send-support-message-step.tsx
import { TextInput } from 'modules/auth';
import { TextArea } from 'modules/support/ui/text-area';
import Image from 'next/image';
import { JSX, useState } from 'react';
import { ButtonUI } from 'shared/ui/button';
import { SupportModal } from '../support-modal/support-modal';
import styles from './send-support-message-step.module.scss';

type SendSupportMessageStepProps = {
  next: () => void;
  prev: () => void;
};

export const SendSupportMessageStep: React.FC<SendSupportMessageStepProps> = ({
  next,
  prev,
}: SendSupportMessageStepProps): JSX.Element => {
  const [message, setMessage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleTextareaChange = (value: string): void => {
    setMessage(value);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Сообщение поддержке:', message);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <button className={styles.arrowButton} onClick={prev}></button>
            <Image
              src="/images/auth/welcomeLogo.png"
              alt="Служба поддержки"
              width={70}
              height={70}
              className={styles.image}
            />
          </div>
          <h1 className={styles.title}>Служба поддержки</h1>
        </div>
        {/* <p className={styles.text}>Пожалуйста, заполните данные</p> */}

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.inputsContainer}>
            <TextInput
              label="Введите никнейм"
              placeholder=""
              value={''}
              onChange={() => {}}
              error={''}
              maxLength={30}
            />

            <TextArea
              label="Опишите Вашу проблему"
              value={message}
              onChange={handleTextareaChange}
              maxLength={500}
              placeholder="Напишите подробнее..."
              disabled={false}
            />
          </div>
          <div className={styles.buttonContainer}>
            <p className={styles.agreementText}>
              Ознакомьтесь со
              <br /> с{' '}
              <a href="" className={styles.link}>
                списком известных проблем и их решениями
              </a>
            </p>
            <ButtonUI variant="general" appearance="primary" label="Отправить" type="submit" />
          </div>
        </form>
      </div>
      {isModalOpen && (
        <SupportModal
          title={'khjhj'}
          content="Номер телефона указан верно?"
          firstButtonText="Верно"
          secondButtonText="Изменить"
          onFirstButtonClick={() => {}}
          onSecondButtonClick={() => {}}
          onClose={() => {}}
        />
      )}
    </>
  );
};
