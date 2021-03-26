import { ofType, unionize, UnionOf } from 'unionize';
import { UserInfo } from '@vkontakte/vk-bridge';

import { unionizeConfig } from '../../config';

export interface User extends UserInfo {
  loading: boolean;
  start_date?: string;
  years_count?: number;
  private: boolean;

  access_token: string;
}

export const userActions = unionize(
  {
    setUserLoading: ofType<User['loading']>(),
    setUser: ofType<Partial<User>>(),
    setToken: ofType<User['access_token']>(),
  },
  unionizeConfig,
);

type UserAction = UnionOf<typeof userActions>;

const initialState: User = {
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

  access_token: '',
};

export function userReducer(state: User = initialState, action: UserAction) {
  return userActions.match(action, {
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
