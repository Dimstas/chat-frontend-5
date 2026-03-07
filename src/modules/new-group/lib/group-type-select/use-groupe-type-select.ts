import { useState } from 'react';

export type GroupType = 'closed' | 'open';

type UseGroupTypeSelectProps = {
  initial?: GroupType;
};

type UseGroupTypeSelectReturn = {
  selected: GroupType;
  selectClosed: () => void;
  selectOpen: () => void;
  setSelected: (value: GroupType) => void;
};

export const useGroupTypeSelect = ({ initial = 'closed' }: UseGroupTypeSelectProps = {}): UseGroupTypeSelectReturn => {
  const [selected, setSelected] = useState<GroupType>(initial);

  const selectClosed = (): void => setSelected('closed');
  const selectOpen = (): void => setSelected('open');

  return {
    selected,
    selectClosed,
    selectOpen,
    setSelected,
  };
};
