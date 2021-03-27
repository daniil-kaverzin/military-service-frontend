import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import bridge from '@vkontakte/vk-bridge';

import { ReduxState } from './types';
import { activeFriendActions } from './reducers/activeFriend';
import { userActions } from './reducers/user';
import { friendsActions } from './reducers/friends';
import { sendRequest } from '../utils/api';
import { isEmpty } from '../utils/validation';
import { App, appActions } from './reducers/app';

export const fetchUser = (): ThunkAction<void, ReduxState, unknown, Action> => async (
  dispatch,
  selector,
) => {
  const { app } = selector();

  try {
    const user = await bridge.send('VKWebAppGetUserInfo');

    let promoBannerProps: App['promoBannerProps'] = null;

    if (!app.isWeb) {
      //@ts-ignore
      promoBannerProps = await bridge.send('VKWebAppGetAds');
      dispatch(appActions.setPromoBannerProps(promoBannerProps));
    }

    const { start_date, years_count, private: isPrivate } = await sendRequest('/user/create');

    dispatch(
      userActions.setUser({
        ...user,
        start_date: start_date ? String(start_date) : undefined,
        years_count: years_count ? Number(years_count) : undefined,
        private: Boolean(isPrivate),
      }),
    );
  } catch {
    dispatch(appActions.setError(true));
  } finally {
    dispatch(appActions.setBaseLoading(false));
  }
};

export const fetchNewData = (
  isPrivate: boolean,
  start_date?: string,
  years_count?: number,
): ThunkAction<void, ReduxState, unknown, Action> => async (dispatch, selector) => {
  const { user } = selector();

  try {
    dispatch(userActions.setUserLoading(true));

    await sendRequest('/user', 'POST', {
      private: isPrivate,
      start_date,
      years_count,
    });

    dispatch(
      userActions.setUser({
        start_date: start_date || user.start_date,
        years_count: years_count || user.years_count,
        private: isPrivate,
      }),
    );
  } catch {
    dispatch(appActions.setError(true));
  } finally {
    dispatch(userActions.setUserLoading(false));
  }
};

export const fetchFriends = (
  hasAccess?: boolean,
): ThunkAction<void, ReduxState, unknown, Action> => async (dispatch, selector) => {
  const { launchParams } = selector();

  try {
    if (hasAccess && !launchParams.accessTokenSettings?.includes('friends')) {
      dispatch(friendsActions.setFriendsLoading(false));
      return;
    }

    const { access_token } = await bridge.send('VKWebAppGetAuthToken', {
      app_id: launchParams.appId || 0,
      scope: 'friends',
    });

    dispatch(friendsActions.setFriendsLoading(true));

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
      dispatch(appActions.setError(true));
    } finally {
      dispatch(friendsActions.setFriendsLoading(false));
    }
  } catch (error) {
    error.error_data.error_code === 1 && dispatch(appActions.setError(true));
  } finally {
    dispatch(friendsActions.setFriendsLoading(false));
  }
};

export const fetchActiveFriend = (
  user_id: number,
): ThunkAction<void, ReduxState, unknown, Action> => async (dispatch, selector) => {
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

      const userResponse = await sendRequest(`/user/${user_id}`);

      dispatch(
        activeFriendActions.setNewFriend({
          ...userResponse,
          id: user_id,
          private: Boolean(userResponse.private),
        }),
      );
    }
  } catch {
    dispatch(appActions.setError(true));
  } finally {
    dispatch(activeFriendActions.setLoading(false));
  }
};
