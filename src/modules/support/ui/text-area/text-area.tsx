// src/modules/feedback/ui/text-area/text-area.tsx
import { useTextArea } from '../../lib/text-area/use-text-area';
import styles from './text-area.module.scss';

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
};

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  maxLength = 500,
  placeholder = '',
  disabled = false,
}: TextAreaProps) => {
  const { handleChange, handleFocus, handleBlur, isFocused } = useTextArea({
    value,
    onChange,
    maxLength,
    disabled,
  });

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <textarea
        className={`${styles.textarea} ${isFocused ? styles.focused : ''} ${disabled ? styles.disabled : ''}`}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        rows={6}
        aria-label={label}
      />
    </div>
  );
};
