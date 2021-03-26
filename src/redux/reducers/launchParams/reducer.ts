import { LaunchParams } from '../../../types/launchParams';

const initialLaunchParams: Partial<LaunchParams> = {
  accessTokenSettings: [],
  appId: 0,
  areNotificationsEnabled: false,
  isAppUser: false,
  isFavorite: false,
  language: 'ru',
  platform: 'desktop_web',
  ref: 'other',
  userId: 0,
  groupId: 0,
  viewerGroupRole: null,
  sign: '',
};

export const launchParamsReducer = (state = initialLaunchParams) => {
  return state;
};
