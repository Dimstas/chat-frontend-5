import { JSX } from 'react';
import type { HighlightedMessageProps } from './highlighted-message.props';

//функция для экранирования спецсимволов в регулярном выражении
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const HighlightedMessage = ({ text, search, caseSensitive = false }: HighlightedMessageProps): JSX.Element => {
  if (!search) return <>{text}</>; // ничего подсвечивать не нужно
  const flag = caseSensitive ? 'g' : 'gi';
  const escaped = escapeRegExp(search);
  const re = new RegExp(escaped, flag);
  const parts: Array<{ text: string; match: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > lastIndex) {
      parts.push({ text: text.slice(lastIndex, start), match: false });
    }
    parts.push({ text: text.slice(start, end), match: true });
    lastIndex = end;
    // защита от бесконечного цикла при пустом совпадении
    if (re.lastIndex === match.index) re.lastIndex++;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), match: false });
  }
  return (
    <>
      {parts.map((p, i) =>
        p.match ? (
          <span key={i} style={{ color: 'blue' }}>
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
};
