import { getParameterByName } from './url';

export const isWeb = () => {
  return /web/gi.test(getParameterByName('vk_platform') || '');
};
