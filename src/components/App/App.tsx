import React, { FC, Fragment, useEffect, useState } from 'react';
import { Epic, ModalRoot, ScreenSpinner, Tabbar, TabbarItem, View } from '@vkontakte/vkui';
import { useRouter, useThrottlingLocation } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';
import { useDispatch } from 'react-redux';
import { Icon28WristWatchOutline, Icon28Users3Outline } from '@vkontakte/icons';

import { useLanguage } from '../../hooks/useLanguage';
import { OwnerProfile } from '../panels/OwnerProfile';
import { Friends } from '../panels/Friends';
import {
  MODAL_EDIT,
  MODAL_FRIEND,
  PAGE_PROFILE,
  PAGE_FRIENDS,
  PANEL_PROFILE,
  PANEL_FRIENDS,
  VIEW_EXTRA,
  VIEW_MAIN,
} from '../../router';
import { userActions } from '../../redux/reducers/user';
import { blacked } from '../../utils/colors';
import { ModalPortal } from '../ModalPortal';
import { ScreenCrash } from '../ScreenCrash/ScreenCrash';
import { useSelector } from '../../hooks/useSelector';
import { sendRequest } from '../../utils/api';

export const App: FC = () => {
  const { getLangKey } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [location] = useThrottlingLocation();
  const router = useRouter();
  const { user } = useSelector();
  const dispatch = useDispatch();
  const [scheme, setScheme] = useState('bright_light');
  const activeViewId = location.getViewId();
  const activePanelId = location.getPanelId();
  const activeModalId = location.getModalId();

  const init = async () => {
    dispatch(userActions.setError(false));

    setLoading(true);

    try {
      bridge.subscribe(({ detail }) => {
        if (detail.type === 'VKWebAppUpdateConfig') {
          const localScheme = detail.data.scheme || 'bright_light';

          setScheme(localScheme);

          document.body.setAttribute('scheme', localScheme);
        }
      });

      await bridge.send('VKWebAppInit');

      const user = await bridge.send('VKWebAppGetUserInfo');

      const { start_date, years_count } = await sendRequest('register.php');

      dispatch(
        userActions.setUser({
          ...user,
          start_date: start_date ? String(start_date) : undefined,
          years_count: years_count ? Number(years_count) : undefined,
        }),
      );

      setLoading(false);
    } catch {
      setLoading(false);
      dispatch(userActions.setError(true));
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (bridge.supports('VKWebAppSetViewSettings')) {
      const actionBarColor = getComputedStyle(document.body)
        .getPropertyValue('--background_content')
        .trim();

      bridge.send('VKWebAppSetViewSettings', {
        status_bar_style: scheme === 'bright_light' ? 'dark' : 'light',
        action_bar_color: activeModalId ? blacked(actionBarColor, 0.4) : actionBarColor,
      });
    }
  }, [activeModalId, scheme]);

  return (
    <Fragment>
      {loading && <ScreenSpinner />}
      {!loading && user.error && <ScreenCrash onReload={init} />}
      {!loading && !user.error && (
        <Fragment>
          <ModalPortal>
            <ModalRoot activeModal={activeModalId} onClose={() => router.popPage()}>
              <div id={MODAL_EDIT} />
              <div id={MODAL_FRIEND} />
            </ModalRoot>
          </ModalPortal>

          <Epic
            activeStory={activeViewId}
            tabbar={
              <Tabbar>
                <TabbarItem
                  selected={activePanelId === PANEL_PROFILE}
                  onClick={() => router.pushPage(PAGE_PROFILE)}
                  text={getLangKey('epic_profile')}
                >
                  <Icon28WristWatchOutline />
                </TabbarItem>
                <TabbarItem
                  selected={activePanelId === PANEL_FRIENDS}
                  onClick={() => router.pushPage(PAGE_FRIENDS)}
                  text={getLangKey('epic_users')}
                >
                  <Icon28Users3Outline />
                </TabbarItem>
              </Tabbar>
            }
          >
            <View
              id={VIEW_MAIN}
              activePanel={activePanelId}
              onSwipeBack={() => router.popPage()}
              history={location.hasOverlay() ? [] : location.getViewHistory(VIEW_MAIN)}
            >
              <OwnerProfile id={PANEL_PROFILE} />
            </View>
            <View
              id={VIEW_EXTRA}
              activePanel={activePanelId}
              onSwipeBack={() => router.popPage()}
              history={location.hasOverlay() ? [] : location.getViewHistory(VIEW_EXTRA)}
            >
              <Friends id={PANEL_FRIENDS} />
            </View>
          </Epic>
        </Fragment>
      )}
    </Fragment>
  );
};
