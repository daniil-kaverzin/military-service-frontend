import { ofType, unionize, UnionOf } from 'unionize';
import { UserInfo } from '@vkontakte/vk-bridge';
import { PromoBannerProps } from '@vkontakte/vkui';

import { unionizeConfig } from '../../config';

export interface User extends UserInfo {
  baseLoading: boolean;
  error: boolean;

  loading: boolean;
  start_date?: string;
  years_count?: number;
  private: boolean;

  promoBannerProps?: PromoBannerProps;

  access_token: string;
}

export const userActions = unionize(
  {
    setBaseLoading: ofType<User['baseLoading']>(),
    setUserLoading: ofType<User['loading']>(),
    setError: ofType<User['error']>(),
    setUser: ofType<Partial<User>>(),
    setToken: ofType<User['access_token']>(),
  },
  unionizeConfig,
);

type UserAction = UnionOf<typeof userActions>;

const initialState: User = {
  baseLoading: true,
  error: false,

  id: 1,
  first_name: '',
  last_name: '',
  sex: 0,
  city: {
    id: 1,
    title: '',
  },
  country: {
    id: 1,
    title: '',
  },
  photo_100: '',
  photo_200: '',
  timezone: 1,

  loading: false,
  start_date: undefined,
  years_count: undefined,
  private: true,

  promoBannerProps: undefined,

  access_token: '',
};

export function userReducer(state: User = initialState, action: UserAction) {
  return userActions.match(action, {
    setBaseLoading: (baseLoading) => {
      return {
        ...state,
        baseLoading,
      };
    },

    setError: (error) => {
      return {
        ...state,
        error,
      };
    },

    setUserLoading: (loading) => {
      return {
        ...state,
        loading,
      };
    },

    setUser: (user) => {
      return {
        ...state,
        ...user,
      };
    },

    setToken: (access_token) => ({ ...state, access_token }),

    default: () => state,
  });
}
