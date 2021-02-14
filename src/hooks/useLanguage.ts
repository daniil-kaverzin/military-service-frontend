import { useContext } from 'react';

import { LanguageContext } from '../components/providers/LanguageProvider';

export const useLanguage = () => useContext(LanguageContext);
