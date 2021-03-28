import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

export type UseInput = [
  {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  },
  Dispatch<SetStateAction<string>>,
];

export const useInput = (initialValue = ''): UseInput => {
  const [value, setValue] = useState(initialValue);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  return [{ value, onChange }, setValue];
};
