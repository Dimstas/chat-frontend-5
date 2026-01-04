import { JSX } from 'react';

export const SearchResultsPanel = ({ query }: { query?: string }): JSX.Element | null => {
  if (!query) return null;

  return <div></div>;
};
