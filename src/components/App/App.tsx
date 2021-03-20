import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Epic, ModalRoot, ScreenSpinner, Tabbar, TabbarItem, View } from '@vkontakte/vkui';
import { useLocation, useRouter } from '@happysanta/router';
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
  MODAL_HOLIDAYS,
} from '../../router';
import { userActions } from '../../redux/reducers/user';
import { blacked } from '../../utils/colors';
import { ScreenCrash } from '../ScreenCrash/ScreenCrash';
import { useSelector } from '../../hooks/useSelector';
import { fetchUser } from '../../redux/fetch';
import { FriendModal } from '../modals/FriendModal';
import { EditModal } from '../modals/EditModal';
import { HolidaysModal } from '../modals/HolidaysModal';
import { AppearanceScheme } from '@vkontakte/vkui/dist/components/ConfigProvider/ConfigProviderContext';

export const App: FC = () => {
  const { getLangKey } = useLanguage();
  const location = useLocation();
  const router = useRouter();
  const { user } = useSelector();
  const dispatch = useDispatch();
  const [scheme, setScheme] = useState<AppearanceScheme | undefined>(undefined);
  const activeViewId = location.getViewId();
  const activePanelId = location.getPanelId();
  const activeModalId = location.getModalId();

  const init = useCallback(async () => {
    dispatch(userActions.setError(false));

    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    bridge.subscribe(({ detail }) => {
      if (detail.type === 'VKWebAppUpdateConfig') {
        const localScheme = detail.data.scheme || 'bright_light';

        setScheme(localScheme);

        document.body.setAttribute('scheme', localScheme);
      }
    });

    bridge.send('VKWebAppInit');

    init();
  }, [init]);

  useEffect(() => {
    if (bridge.supports('VKWebAppSetViewSettings')) {
      const actionBarColor = getComputedStyle(document.body)
        .getPropertyValue('--background_content')
        .trim();

      if (scheme) {
        bridge.send('VKWebAppSetViewSettings', {
          status_bar_style: scheme === 'bright_light' ? 'dark' : 'light',
          action_bar_color:
            activeModalId && !user.error && !user.baseLoading
              ? blacked(actionBarColor, 0.4)
              : actionBarColor,
        });
      }
    }
  }, [activeModalId, scheme, user.error, user.baseLoading]);

  const renderModals = useMemo(() => {
    return (
      <ModalRoot activeModal={location.getModalId()} onClose={() => router.popPage()}>
        <FriendModal id={MODAL_FRIEND} />
        <EditModal id={MODAL_EDIT} />
        <HolidaysModal id={MODAL_HOLIDAYS} />
      </ModalRoot>
    );
  }, [router, location]);

  return (
    <Fragment>
      {user.baseLoading && <ScreenSpinner />}

      {!user.baseLoading && user.error && <ScreenCrash onReload={init} />}

      {!user.baseLoading && !user.error && (
        <Fragment>
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
              modal={renderModals}
              id={VIEW_MAIN}
              activePanel={activePanelId}
              onSwipeBack={() => router.popPage()}
              history={location.hasOverlay() ? [] : location.getViewHistory(VIEW_MAIN)}
            >
              <OwnerProfile id={PANEL_PROFILE} />
            </View>
            <View
              modal={renderModals}
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
