import Image from 'next/image';
import React from 'react';
import { useDualInput } from '../../lib/dual-input/use-dual-input';
import styles from './dual-input.module.scss';

type DualInputProps = {
  maxFirst?: number;
  maxSecond?: number;
  placeholderFirst?: string;
  placeholderSecond?: string;
  valueFirst?: string;
  valueSecond?: string;
  onChangeFirst?: (value: string) => void;
  onChangeSecond?: (value: string) => void;
};

const DualInput: React.FC<DualInputProps> = ({
  maxFirst = 50,
  maxSecond = 100,
  placeholderFirst = 'Название',
  placeholderSecond = 'Описание',
  valueFirst = '',
  valueSecond = '',
  onChangeFirst,
  onChangeSecond,
}) => {
  const {
    firstFocused,
    secondFocused,
    firstLength,
    secondLength,
    handleFirstChange,
    handleSecondChange,
    handleFirstFocus,
    handleFirstBlur,
    handleSecondFocus,
    handleSecondBlur,
    handleClearFirst,
    handleClearSecond,
  } = useDualInput({
    maxFirst,
    maxSecond,
    initialFirst: valueFirst,
    initialSecond: valueSecond,
  });

  const onFirstChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleFirstChange(e);
    onChangeFirst?.(e.target.value);
  };

  const onSecondChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleSecondChange(e);
    onChangeSecond?.(e.target.value);
  };

  const onClearFirst = (): void => {
    handleClearFirst();
    onChangeFirst?.('');
  };

  const onClearSecond = (): void => {
    handleClearSecond();
    onChangeSecond?.('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.fieldContainer}>
        <div className={`${styles.inputWrapper} ${firstFocused ? styles.focused : ''}`}>
          <label className={`${styles.label} ${firstFocused || valueFirst ? styles.labelActive : ''}`}>
            {placeholderFirst}
          </label>
          <input
            type="text"
            value={valueFirst}
            onChange={onFirstChange}
            onFocus={handleFirstFocus}
            onBlur={handleFirstBlur}
            className={styles.input}
          />
          {firstFocused && (
            <>
              <span className={styles.counter}>
                {firstLength}/{maxFirst}
              </span>
              {valueFirst && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={onClearFirst}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label="Очистить"
                >
                  <Image src="/images/new-group/clearIcon.svg" alt="" width={16} height={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.fieldContainer}>
        <div className={`${styles.inputWrapper} ${secondFocused ? styles.focused : ''}`}>
          <label className={`${styles.label} ${secondFocused || valueSecond ? styles.labelActive : ''}`}>
            {placeholderSecond}
          </label>
          <input
            type="text"
            value={valueSecond}
            onChange={onSecondChange}
            onFocus={handleSecondFocus}
            onBlur={handleSecondBlur}
            className={styles.input}
          />
          {secondFocused && (
            <>
              <span className={styles.counter}>
                {secondLength}/{maxSecond}
              </span>
              {valueSecond && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={onClearSecond}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label="Очистить"
                >
                  <Image src="/images/new-group/clearIcon.svg" alt="" width={16} height={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DualInput;
