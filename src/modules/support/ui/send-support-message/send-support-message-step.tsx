import { TextInput } from 'modules/auth';
import { TextArea } from 'modules/support/ui/text-area';
import Image from 'next/image';
import { JSX, useState } from 'react';
import { ButtonUI } from 'shared/ui/button';
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
  const [login, setLogin] = useState<string>('');
  const handleTextareaChange = (value: string): void => {
    setMessage(value);
  };

  const handleLoginChange = (value: string): void => {
    setLogin(value);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    next();
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

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.inputsContainer}>
            <TextInput
              label="Введите никнейм"
              placeholder=""
              value={login}
              onChange={handleLoginChange}
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
              <br />
              <a href="" className={styles.link}>
                списком известных проблем и их решениями
              </a>
            </p>
            <ButtonUI variant="general" appearance="primary" label="Отправить" type="submit" />
          </div>
        </form>
      </div>
    </>
  );
};
