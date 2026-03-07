import { ChangeEvent, useState } from 'react';

type UseDualInputProps = {
  maxFirst?: number;
  maxSecond?: number;
  initialFirst?: string;
  initialSecond?: string;
};

type UseDualInputReturn = {
  firstFocused: boolean;
  secondFocused: boolean;
  firstLength: number;
  secondLength: number;
  handleFirstChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSecondChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFirstFocus: () => void;
  handleFirstBlur: () => void;
  handleSecondFocus: () => void;
  handleSecondBlur: () => void;
  handleClearFirst: () => void;
  handleClearSecond: () => void;
};

export const useDualInput = ({
  maxFirst = 50,
  maxSecond = 100,
  initialFirst = '',
  initialSecond = '',
}: UseDualInputProps = {}): UseDualInputReturn => {
  const [firstFocused, setFirstFocused] = useState<boolean>(false);
  const [secondFocused, setSecondFocused] = useState<boolean>(false);
  const [firstLength, setFirstLength] = useState<number>(initialFirst.length);
  const [secondLength, setSecondLength] = useState<number>(initialSecond.length);

  const handleFirstChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value.length <= maxFirst) {
      setFirstLength(value.length);
    }
  };

  const handleSecondChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value.length <= maxSecond) {
      setSecondLength(value.length);
    }
  };

  const handleFirstFocus = (): void => setFirstFocused(true);
  const handleFirstBlur = (): void => setFirstFocused(false);
  const handleSecondFocus = (): void => setSecondFocused(true);
  const handleSecondBlur = (): void => setSecondFocused(false);

  const handleClearFirst = (): void => setFirstLength(0);
  const handleClearSecond = (): void => setSecondLength(0);

  return {
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
  };
};
