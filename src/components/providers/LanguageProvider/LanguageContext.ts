import { createContext } from 'react';
import { noop } from '@vkontakte/vkjs';

import { pack } from '../../../languages/ru';

type LanguageDictionaryType = typeof pack;

type LanguageAnyKey = keyof LanguageDictionaryType;

type LanguageDictionary = { [key in LanguageAnyKey]: LanguageDictionaryType[key] };

export interface LanguageContextValue {
  getLangKey: <T extends LanguageAnyKey>(key: T) => LanguageDictionary[T];
  setLangKeys: (keys: LanguageDictionary) => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
  getLangKey: (key) => pack[key],
  setLangKeys: noop,
});
