import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import bridge from '@vkontakte/vk-bridge';

import { State } from './createStore';
import { activeFriendActions } from './reducers/activeFriend';
import { User, userActions } from './reducers/user';
import { friendsActions } from './reducers/friends';
import { sendRequest } from '../utils/api';
import { isEmpty } from '../utils/validation';
import { isWeb } from '../utils/platform';

export const fetchUser = (): ThunkAction<void, State, unknown, Action> => async (dispatch) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');

    let promoBannerProps: User['promoBannerProps'] = undefined;

    if (!isWeb()) {
      //@ts-ignore
      promoBannerProps = await bridge.send('VKWebAppGetAds');
    }

    const { start_date, years_count, private: isPrivate } = await sendRequest('register.php');

    dispatch(
      userActions.setUser({
        ...user,
        start_date: start_date ? String(start_date) : undefined,
        years_count: years_count ? Number(years_count) : undefined,
        private: Boolean(Number(isPrivate)),
        promoBannerProps,
      }),
    );
  } catch {
    dispatch(userActions.setError(true));
  } finally {
    dispatch(userActions.setBaseLoading(false));
  }
};

export const fetchNewData = (
  start_date: string,
  years_count: number,
  isPrivate: boolean,
): ThunkAction<void, State, unknown, Action> => async (dispatch) => {
  try {
    dispatch(userActions.setUserLoading(true));

    await sendRequest(
      `changeData.php?start_date=${start_date}&years_count=${years_count}&private=${isPrivate}`,
    );

    dispatch(userActions.setUser({ start_date, years_count, private: isPrivate }));
  } catch {
    dispatch(userActions.setError(true));
  } finally {
    dispatch(userActions.setUserLoading(false));
  }
};

export const fetchFriends = (app_id: number): ThunkAction<void, State, unknown, Action> => async (
  dispatch,
) => {
  try {
    dispatch(friendsActions.setFriendsLoading(true));

    const { access_token } = await bridge.send('VKWebAppGetAuthToken', {
      app_id,
      scope: 'friends',
    });

    dispatch(userActions.setToken(access_token));
    dispatch(friendsActions.setRules(true));

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
        if (friendsIds.length > 100) friendsIds.length = 100;

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
    } finally {
      dispatch(friendsActions.setFriendsLoading(false));
    }
  } catch (error) {
    error.error_data.error_code === 1 && dispatch(userActions.setError(true));
  } finally {
    dispatch(friendsActions.setFriendsLoading(false));
  }
};

export const fetchActiveFriend = (
  access_token: string,
  user_id: number,
): ThunkAction<void, State, unknown, Action> => async (dispatch, selector) => {
  try {
    const { activeFriend } = selector();

    if (user_id in activeFriend.dictionary) {
      dispatch(
        activeFriendActions.setNewFriend({
          ...activeFriend.dictionary[user_id],
        }),
      );
    } else {
      dispatch(activeFriendActions.setLoading(true));

      const { response: friend } = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'users.get',
        params: {
          v: '5.130',
          user_ids: user_id,
          fields: 'photo_200',
          access_token,
        },
      });

      dispatch(
        activeFriendActions.setNewFriend({
          ...friend[0],
        }),
      );

      const { start_date, years_count } = await sendRequest(`getUserById.php?id=${user_id}`);

      dispatch(
        activeFriendActions.setNewFriend({
          id: user_id,
          start_date,
          years_count,
          private: false,
        }),
      );
    }
  } catch (statusCode) {
    String(statusCode)[0] === '4'
      ? dispatch(activeFriendActions.setNewFriend({ id: user_id, private: true }))
      : dispatch(userActions.setError(true));
  } finally {
    dispatch(activeFriendActions.setLoading(false));
  }
};
