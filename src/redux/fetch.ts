import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import bridge from '@vkontakte/vk-bridge';

import { ReduxState } from './types';
import { activeUserActions } from './reducers/activeUser';
import { userActions } from './reducers/user';
import { friendsActions } from './reducers/friends';
import { sendRequest } from '../utils/api';
import { isEmpty } from '../utils/validation';
import { App, appActions } from './reducers/app';
import { noop } from '@vkontakte/vkjs';

export const fetchUser = (): ThunkAction<void, ReduxState, unknown, Action> => async (dispatch) => {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');

    let promoBannerProps: App['promoBannerProps'] = null;

    if (bridge.supports('VKWebAppGetAds')) {
      await bridge
        // @ts-ignore
        .send('VKWebAppGetAds')
        .then((r: any) => {
          promoBannerProps = r;
        })
        .catch(noop);

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
    if (hasAccess && !launchParams.accessTokenSettings.includes('friends')) {
      dispatch(friendsActions.setFriendsLoading(false));
      return;
    }

    const { access_token } = await bridge.send('VKWebAppGetAuthToken', {
      app_id: launchParams.appId,
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
    const { activeUser } = selector();

    if (user_id in activeUser.dictionary) {
      dispatch(
        activeUserActions.setNewUser({
          ...activeUser.dictionary[user_id],
        }),
      );
    } else {
      dispatch(activeUserActions.setLoading(true));

      const userResponse = await sendRequest(`/user/${user_id}`);

      dispatch(
        activeUserActions.setNewUser({
          ...userResponse,
          id: user_id,
          private: Boolean(userResponse.private),
        }),
      );
    }
  } catch {
    dispatch(appActions.setError(true));
  } finally {
    dispatch(activeUserActions.setLoading(false));
  }
};
