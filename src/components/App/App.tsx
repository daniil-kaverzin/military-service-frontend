import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Epic,
  ModalRoot,
  PanelHeader,
  ScreenSpinner,
  SplitCol,
  SplitLayout,
  Tabbar,
  TabbarItem,
  View,
  classNames,
} from '@vkontakte/vkui';
import { useLocation, useRouter } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';
import { useDispatch } from 'react-redux';
import { Icon28WristWatchOutline, Icon28Users3Outline } from '@vkontakte/icons';

import './App.css';
import { useLanguage } from '@/hooks/useLanguage';
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
  POPOUT_SELECT_SHARE_MODE,
  VIEW_SHARED,
  PANEL_SHARED,
  POPOUT_SHARE_ALERT,
  PAGE_SHARED,
} from '@/router';
import { ScreenCrash } from '../ScreenCrash';
import { useSelector } from '@/hooks/useSelector';
import { fetchUser } from '@/redux/fetch';
import { FriendModal } from '../modals/FriendModal';
import { EditModal } from '../modals/EditModal';
import { HolidaysModal } from '../modals/HolidaysModal';
import { SelectShareModePopout } from '../popouts/SelectShareModePopout';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Nav } from '../Nav';
import { Shared } from '../panels/Shared';
import { appActions } from '@/redux/reducers/app';
import { ShareAlert } from '../popouts/ShareAlert';

export const App: FC = () => {
  const isMobile = useIsMobile();

  const { getLangKey } = useLanguage();

  const location = useLocation();
  const router = useRouter();

  const { app } = useSelector();
  const dispatch = useDispatch();

  const openPopoutSelectShareMoreRef = useRef<HTMLElement | null>(null);

  const init = useCallback(async () => {
    dispatch(appActions.setError(false));
    dispatch(fetchUser());
  }, [dispatch]);

  const handleClickReload = () => {
    if (router.getCurrentLocation().getPageId() === PAGE_SHARED && app.error) {
      router.replacePage(PAGE_PROFILE);
    }

    init();
  };

  useEffect(() => {
    bridge.subscribe(({ detail }) => {
      if (detail.type === 'VKWebAppUpdateConfig') {
        const scheme = detail.data.scheme || 'bright_light';

        document.body.setAttribute('scheme', scheme);
      }
    });

    bridge.send('VKWebAppInit');

    init();
  }, [init]);

  const renderModals = useMemo(() => {
    return (
      <ModalRoot activeModal={location.getModalId()} onClose={() => router.popPage()}>
        <FriendModal id={MODAL_FRIEND} />
        <EditModal id={MODAL_EDIT} />
        <HolidaysModal id={MODAL_HOLIDAYS} />
      </ModalRoot>
    );
  }, [router, location]);

  const renderPopouts = useMemo(() => {
    switch (location.getPopupId()) {
      case POPOUT_SELECT_SHARE_MODE:
        return (
          <SelectShareModePopout toggleRef={openPopoutSelectShareMoreRef.current as Element} />
        );
      case POPOUT_SHARE_ALERT:
        return <ShareAlert />;
      default:
        return undefined;
    }
  }, [location]);

  return (
    <SplitLayout
      className={classNames('App', !isMobile && 'App--desktop')}
      header={
        !isMobile && !app.baseLoading && !app.error && <PanelHeader shadow separator={false} />
      }
    >
      <SplitCol spaced={!isMobile}>
        {app.baseLoading && <ScreenSpinner />}

        {!app.baseLoading && app.error && <ScreenCrash onReload={handleClickReload} />}

        {!app.baseLoading && !app.error && (
          <Epic
            activeStory={location.getViewId()}
            tabbar={
              isMobile && (
                <Tabbar>
                  <TabbarItem
                    selected={location.getPanelId() === PANEL_PROFILE}
                    onClick={() => {
                      location.getPanelId() !== PANEL_PROFILE && router.pushPage(PAGE_PROFILE);
                    }}
                    text={getLangKey('epic_profile')}
                  >
                    <Icon28WristWatchOutline />
                  </TabbarItem>
                  <TabbarItem
                    selected={location.getPanelId() === PANEL_FRIENDS}
                    onClick={() => {
                      location.getPanelId() !== PANEL_FRIENDS && router.pushPage(PAGE_FRIENDS);
                    }}
                    text={getLangKey('epic_users')}
                  >
                    <Icon28Users3Outline />
                  </TabbarItem>
                </Tabbar>
              )
            }
          >
            <View
              modal={renderModals}
              popout={renderPopouts}
              id={VIEW_SHARED}
              activePanel={location.getViewActivePanel(VIEW_SHARED) || ''}
              onSwipeBack={() => router.popPage()}
              history={location.hasOverlay() ? [] : location.getViewHistory(VIEW_SHARED)}
            >
              <Shared id={PANEL_SHARED} />
            </View>
            <View
              modal={renderModals}
              popout={renderPopouts}
              id={VIEW_MAIN}
              activePanel={location.getViewActivePanel(VIEW_MAIN) || ''}
              onSwipeBack={() => router.popPage()}
              history={location.hasOverlay() ? [] : location.getViewHistory(VIEW_MAIN)}
            >
              <OwnerProfile
                id={PANEL_PROFILE}
                openPopoutSelectShareMoreRef={openPopoutSelectShareMoreRef}
              />
            </View>
            <View
              modal={renderModals}
              popout={renderPopouts}
              id={VIEW_EXTRA}
              activePanel={location.getViewActivePanel(VIEW_EXTRA) || ''}
              onSwipeBack={() => router.popPage()}
              history={location.hasOverlay() ? [] : location.getViewHistory(VIEW_EXTRA)}
            >
              <Friends id={PANEL_FRIENDS} />
            </View>
          </Epic>
        )}
      </SplitCol>

      {!isMobile && !app.baseLoading && !app.error && (
        <SplitCol className="App__nav" fixed width="280px" minWidth="280px" maxWidth="280px">
          <Nav />
        </SplitCol>
      )}
    </SplitLayout>
  );
};
