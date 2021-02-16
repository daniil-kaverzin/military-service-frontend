import { ofType, unionize, UnionOf } from 'unionize';

import { unionizeConfig } from '../../config';

export interface Friends {
  fetched: boolean;
  loading: boolean;
  rules: boolean;
  items: Array<{
    id: number;
    first_name: string;
    last_name: string;
    photo_100: string;
  }>;
}

export const friendsActions = unionize(
  {
    setLoading: ofType<Friends['loading']>(),
    startCheckRules: ofType(),
    setFriendsRulesError: ofType(),
    startFriends: ofType(),
    setFriends: ofType<Friends['items']>(),
  },
  unionizeConfig,
);

export type FriendsAction = UnionOf<typeof friendsActions>;

const initialState: Friends = {
  fetched: false,
  loading: true,
  rules: false,
  items: [],
};

export const friendsReducer = (state: Friends = initialState, action: FriendsAction) => {
  return friendsActions.match(action, {
    setLoading: (loading) => {
      return {
        ...state,
        loading,
      };
    },

    startCheckRules: () => {
      return {
        ...state,
        loading: true,
        rules: false,
      };
    },

    setFriendsRulesError: () => {
      return {
        ...state,
        loading: false,
        rules: false,
      };
    },

    startFriends: () => {
      return {
        ...state,
        loading: true,
        rules: true,
      };
    },

    setFriends: (friends) => {
      return {
        ...state,
        items: [...friends],
        loading: false,
        fetched: true,
      };
    },

    default: () => state,
  });
};
