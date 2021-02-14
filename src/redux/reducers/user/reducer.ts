import { ofType, unionize, UnionOf } from 'unionize';
import { UserInfo } from '@vkontakte/vk-bridge';

import { unionizeConfig } from '../../config';
import { noop } from '@vkontakte/vkjs';

interface User extends UserInfo {
  error: boolean;
  loading: boolean;
  access_token?: string;
  start_date?: string;
  years_count?: number;
}

export const userActions = unionize(
  {
    setError: ofType<boolean>(),
    startChangeDate: noop,
    setNewDate: ofType<Partial<User>>(),
    setUser: ofType<Partial<User>>(),
    setToken: ofType<string>(),
  },
  unionizeConfig,
);

type UserAction = UnionOf<typeof userActions>;

const initialState: User = {
  error: false,
  loading: false,
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
  access_token: '',
  start_date: undefined,
  years_count: undefined,
};

export function userReducer(state: User = initialState, action: UserAction) {
  return userActions.match(action, {
    setError: (error) => {
      return {
        ...state,
        error,
        loading: false,
      };
    },

    startChangeDate: () => ({ ...state, loading: true }),

    setNewDate: ({ start_date, years_count }) => {
      return { ...state, start_date, years_count, loading: false };
    },

    setUser: (user) => ({ ...state, ...user }),

    setToken: (access_token) => ({ ...state, access_token }),

    default: () => state,
  });
}
