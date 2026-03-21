import { useState } from 'react';

export type GroupType = 'private-group' | 'public-group' | 'public-channel' | 'private-channel';

type UseGroupTypeSelectProps = {
  initial?: GroupType;
};

type UseGroupTypeSelectReturn = {
  selected: GroupType;
  selectClosed: () => void;
  selectOpen: () => void;
  setSelected: (value: GroupType) => void;
};

export const useGroupTypeSelect = ({
  initial = 'private-group',
}: UseGroupTypeSelectProps = {}): UseGroupTypeSelectReturn => {
  const [selected, setSelected] = useState<GroupType>(initial);

  const selectClosed = (): void => setSelected('private-group');
  const selectOpen = (): void => setSelected('public-group');

  return {
    selected,
    selectClosed,
    selectOpen,
    setSelected,
  };
};
