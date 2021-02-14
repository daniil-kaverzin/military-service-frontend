import { FC, useState } from 'react';

import { LanguageContext, LanguageContextValue } from './LanguageContext';
import { pack } from '../../../languages/ru';

export const LanguageProvider: FC = ({ children }) => {
  const [keys, setKeys] = useState(pack);

  const context: LanguageContextValue = {
    getLangKey: (key) => keys[key],
    setLangKeys: (newKeys) => {
      setKeys(newKeys);
    },
  };

  return <LanguageContext.Provider value={context}>{children}</LanguageContext.Provider>;
};
