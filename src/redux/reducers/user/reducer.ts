import { ofType, unionize, UnionOf } from 'unionize';
import { UserInfo } from '@vkontakte/vk-bridge';

import { unionizeConfig } from '../../config';

interface User extends UserInfo {
  baseLoading: boolean;
  error: boolean;
  loading: boolean;

  access_token: string;
  start_date?: string;
  years_count?: number;
}

export const userActions = unionize(
  {
    setBaseLoading: ofType<User['baseLoading']>(),
    setError: ofType<User['error']>(),
    startChangeDate: ofType(),
    setNewDate: ofType<Partial<User>>(),
    setUser: ofType<Partial<User>>(),
    setToken: ofType<User['access_token']>(),
  },
  unionizeConfig,
);

type UserAction = UnionOf<typeof userActions>;

const initialState: User = {
  baseLoading: true,
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
    setBaseLoading: (value) => {
      return {
        ...state,
        baseLoading: value,
      };
    },

    setError: (error) => {
      return {
        ...state,
        error,
        loading: false,
      };
    },

    startChangeDate: () => ({ ...state, loading: true }),

    setNewDate: ({ start_date, years_count }) => {
      return {
        ...state,
        start_date,
        years_count,
        loading: false,
      };
    },

    setUser: (user) => {
      return {
        ...state,
        ...user,
        baseLoading: false,
      };
    },

    setToken: (access_token) => ({ ...state, access_token }),

    default: () => state,
  });
}
