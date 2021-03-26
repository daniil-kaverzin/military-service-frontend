import { ofType, unionize, UnionOf } from 'unionize';

import { unionizeConfig } from '../../config';

export interface FriendInfo {
  id: number;
  first_name: string;
  last_name: string;
  photo_200: string;
  start_date?: string;
  years_count?: number;
  private: boolean;
}

export interface Friend {
  loading: boolean;
  info: FriendInfo;
  dictionary: { [id: number]: FriendInfo };
}

export const activeFriendActions = unionize(
  {
    setLoading: ofType<Friend['loading']>(),
    setActiveFriend: ofType<FriendInfo>(),
    setNewFriend: ofType<Partial<FriendInfo> & { id: FriendInfo['id'] }>(),
  },
  unionizeConfig,
);

export type ActiveFriendAction = UnionOf<typeof activeFriendActions>;

const initialState: Friend = {
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

export const activeFriendReducer = (state: Friend = initialState, action: ActiveFriendAction) => {
  return activeFriendActions.match(action, {
    setLoading: (loading) => {
      return {
        ...state,
        loading,
      };
    },

    setNewFriend: (info) => {
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
