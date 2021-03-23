import { ofType, unionize, UnionOf } from 'unionize';

import { unionizeConfig } from '../../config';

export interface FriendItem {
  id: number;
  first_name: string;
  last_name: string;
  photo_100: string;
}

export interface Friends {
  loading: boolean;
  rules: boolean;
  items?: Array<FriendItem>;
}

export const friendsActions = unionize(
  {
    setFriendsLoading: ofType<Friends['loading']>(),
    setRules: ofType<Friends['rules']>(),
    setFriends: ofType<Array<FriendItem>>(),
  },
  unionizeConfig,
);

export type FriendsAction = UnionOf<typeof friendsActions>;

const initialState: Friends = {
  loading: true,
  rules: false,
  items: undefined,
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

    setFriends: (friends) => {
      return {
        ...state,
        items: [...friends],
      };
    },

    default: () => state,
  });
};
