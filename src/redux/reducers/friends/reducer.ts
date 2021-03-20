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
    setFriendsLoading: ofType<Friends['loading']>(),
    setRules: ofType<Friends['rules']>(),
    setFriends: ofType<Friends['items']>(),
    setFriendsFetched: ofType<Friends['fetched']>(),
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
    setFriendsLoading: (loading) => {
      return {
        ...state,
        loading,
      };
    },

    setRules: (rules) => {
      return {
        ...state,
        rules,
      };
    },

    setFriendsFetched: (fetched) => {
      return {
        ...state,
        fetched,
      };
    },

    setFriends: (friends) => {
      return {
        ...state,
        items: [...friends],
      };
    },

    default: () => state,
  });
};
