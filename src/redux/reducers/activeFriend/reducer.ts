import { ofType, unionize, UnionOf } from 'unionize';

import { unionizeConfig } from '../../config';

export interface Friend {
  loading: boolean;
  info: {
    id: number;
    first_name: string;
    last_name: string;
    photo_200: string;
    start_date?: string;
    years_count?: number;
  };
}

export const activeFriendActions = unionize(
  {
    setLoading: ofType<Friend['loading']>(),
    startActiveFriend: ofType(),
    setActiveFriend: ofType<Friend['info']>(),
  },
  unionizeConfig,
);

export type ActiveFriendAction = UnionOf<typeof activeFriendActions>;

const initialState: Friend = {
  loading: false,
  info: {
    id: -1,
    first_name: 'Имя',
    last_name: 'Фамилия',
    photo_200: '',
    start_date: undefined,
    years_count: undefined,
  },
};

export const activeFriendReducer = (state: Friend = initialState, action: ActiveFriendAction) => {
  return activeFriendActions.match(action, {
    setLoading: (loading) => {
      return {
        ...state,
        loading,
      };
    },

    startActiveFriend: () => ({ ...state, loading: true }),

    setActiveFriend: (info) => ({ ...state, info, loading: false }),

    default: () => state,
  });
};
