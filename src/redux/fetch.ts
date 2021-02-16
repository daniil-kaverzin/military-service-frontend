import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import bridge from '@vkontakte/vk-bridge';

import { State } from './createStore';
import { activeFriendActions } from './reducers/activeFriend';
import { userActions } from './reducers/user';
import { friendsActions } from './reducers/friends';
import { sendRequest } from '../utils/api';
import { isEmpty } from '../utils/validation';

export const fetchUser = (): ThunkAction<void, State, unknown, Action> => async (dispatch) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');

    const { start_date, years_count } = await sendRequest('register.php');

    dispatch(
      userActions.setUser({
        ...user,
        start_date: start_date ? String(start_date) : undefined,
        years_count: years_count ? Number(years_count) : undefined,
      }),
    );
  } catch {
    dispatch(userActions.setError(true));
  }
};

export const fetchNewDate = (
  start_date: string,
  years_count: number,
): ThunkAction<void, State, unknown, Action> => async (dispatch) => {
  try {
    dispatch(userActions.startChangeDate());

    await sendRequest(`changeDate.php?start_date=${start_date}&years_count=${years_count}`);

    dispatch(userActions.setNewDate({ start_date, years_count }));
  } catch {
    dispatch(userActions.setError(true));
  }
};

export const fetchfriends = (app_id: number): ThunkAction<void, State, unknown, Action> => async (
  dispatch,
) => {
  try {
    dispatch(friendsActions.startCheckRules());

    const { access_token } = await bridge.send('VKWebAppGetAuthToken', {
      app_id,
      scope: 'friends',
    });

    dispatch(userActions.setToken(access_token));
    dispatch(friendsActions.startFriends());
    try {
      const { response: friendsIds } = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'friends.getAppUsers',
        params: {
          v: '5.130',
          access_token,
        },
      });

      if (isEmpty(friendsIds)) {
        dispatch(friendsActions.setFriends([]));
      } else {
        const { response: friends } = await bridge.send('VKWebAppCallAPIMethod', {
          method: 'users.get',
          params: {
            v: '5.130',
            user_ids: friendsIds.join(','),
            fields: 'photo_100',
            access_token,
          },
        });

        dispatch(friendsActions.setFriends(friends));
      }
    } catch {
      dispatch(userActions.setError(true));
      dispatch(friendsActions.setLoading(false));
    }
  } catch {
    dispatch(friendsActions.setFriendsRulesError());
  }
};

export const fetchActiveFriend = (
  access_token: string,
  user_id: number,
): ThunkAction<void, State, unknown, Action> => async (dispatch) => {
  try {
    dispatch(activeFriendActions.startActiveFriend());

    const { response: friend } = await bridge.send('VKWebAppCallAPIMethod', {
      method: 'users.get',
      params: {
        v: '5.130',
        user_ids: user_id,
        fields: 'photo_200',
        access_token,
      },
    });

    const { start_date, years_count } = await sendRequest(`getUserById.php?id=${user_id}`);

    dispatch(activeFriendActions.setActiveFriend({ ...friend[0], start_date, years_count }));
  } catch {
    dispatch(activeFriendActions.setLoading(false));
    dispatch(userActions.setError(true));
  }
};
