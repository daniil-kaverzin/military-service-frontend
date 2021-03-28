import { ofType, unionize, UnionOf } from 'unionize';

import { unionizeConfig } from '../../config';

export interface UserInfo {
  id: number;
  first_name: string;
  last_name: string;
  photo_200: string;
  start_date?: string;
  years_count?: number;
  private: boolean;
}

export interface ActiveUser {
  loading: boolean;
  info: UserInfo;
  dictionary: { [id: number]: UserInfo };
}

export const activeUserActions = unionize(
  {
    setLoading: ofType<ActiveUser['loading']>(),
    setNewUser: ofType<Partial<UserInfo> & { id: UserInfo['id'] }>(),
  },
  unionizeConfig,
);

export type ActiveUserAction = UnionOf<typeof activeUserActions>;

const initialState: ActiveUser = {
  loading: false,
  info: {
    id: 0,
    first_name: 'Имя',
    last_name: 'Фамилия',
    photo_200: '',
    start_date: undefined,
    years_count: undefined,
    private: true,
  },
  dictionary: {},
};

export const activeUserReducer = (state: ActiveUser = initialState, action: ActiveUserAction) => {
  return activeUserActions.match(action, {
    setLoading: (loading) => {
      return {
        ...state,
        loading,
      };
    },

    setNewUser: (info) => {
      return {
        ...state,
        info: {
          ...state.dictionary[info.id],
          ...info,
        },
        dictionary: {
          ...state.dictionary,
          [info.id]: {
            ...state.dictionary[info.id],
            ...info,
          },
        },
      };
    },

    default: () => state,
  });
};
