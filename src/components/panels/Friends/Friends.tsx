import React, { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Panel, { PanelProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import {
  ANDROID,
  Avatar,
  Button,
  Div,
  IOS,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  PanelHeader,
  PanelHeaderButton,
  Placeholder,
  ScreenSpinner,
  SimpleCell,
  Spinner,
  usePlatform,
  VKCOM,
} from '@vkontakte/vkui';
import {
  Icon24Cancel,
  Icon56ArchiveOutline,
  Icon56CheckShieldOutline,
  Icon56EventOutline,
  Icon56RecentOutline,
  Icon56Stars3Outline,
} from '@vkontakte/icons';
import { useRouter, useThrottlingLocation } from '@happysanta/router';
import { useDispatch } from 'react-redux';

import { useLanguage } from '../../../hooks/useLanguage';
import { useSelector } from '../../../hooks/useSelector';
import { fetchfriends, fetchActiveFriend } from '../../../redux/fetch';
import { MODAL_EDIT, MODAL_HOLIDAYS, MODAL_FRIEND } from '../../../router';
import { ModalPortal } from '../../ModalPortal';
import { Profile } from '../../Profile';
import { PopoutPortal } from '../../PopoutPortal';
import { CustomProgress } from '../../CustomProgress';
import { getParameterByName } from '../../../utils/url';

export interface friendsProps extends PanelProps {}

export const Friends: FC<friendsProps> = (props) => {
  const { getLangKey } = useLanguage();
  const { user, friends, activeFriend } = useSelector();
  const dispatch = useDispatch();
  const router = useRouter();
  const [location] = useThrottlingLocation();
  const platform = usePlatform();
  const [showModal, setShowModal] = useState(false);

  const activeModalId = location.getModalId();

  const app_id = useMemo(() => getParameterByName('vk_app_id'), []);

  const { fetched, loading, rules, items } = friends;

  const getfriends = useCallback(() => {
    app_id && dispatch(fetchfriends(Number(app_id)));
  }, [dispatch, app_id]);

  useEffect(() => {
    !fetched && getfriends();
  }, [fetched, getfriends]);

  const getFriend = (id: number) => {
    if (activeFriend.info.id !== id) {
      dispatch(fetchActiveFriend(String(user.access_token), id));
    }

    setShowModal(true);
  };

  useEffect(() => {
    if (showModal && !activeFriend.loading) {
      router.pushModal(MODAL_FRIEND);

      setShowModal(false);
    }
  }, [showModal, activeFriend, router]);

  return (
    <Panel {...props} className="friends">
      <PanelHeader separator={false}>{getLangKey('friends_header')}</PanelHeader>

      {loading && (
        <Div>
          <Spinner size="medium" />
        </Div>
      )}

      {!loading && !rules && (
        <Placeholder
          icon={<Icon56CheckShieldOutline />}
          action={
            <Button size="m" onClick={getfriends}>
              {getLangKey('friends_get_rules_button')}
            </Button>
          }
        >
          {getLangKey('friends_get_rules_label')}
        </Placeholder>
      )}

      {!loading && rules && items.length <= 0 && (
        <Placeholder icon={<Icon56ArchiveOutline />}>
          {getLangKey('friends_not_found_placeholder')}
        </Placeholder>
      )}

      {!loading &&
        rules &&
        items.length > 0 &&
        friends.items.map(({ id, first_name, last_name, photo_100 }) => {
          return (
            <SimpleCell
              key={id}
              before={<Avatar size={48} src={photo_100} />}
              onClick={() => getFriend(id)}
            >
              {`${first_name} ${last_name}`}
            </SimpleCell>
          );
        })}

      {activeFriend.loading && (
        <PopoutPortal>
          <ScreenSpinner />
        </PopoutPortal>
      )}

      <ModalPortal>
        <ModalRoot activeModal={activeModalId} onClose={() => router.popPage()}>
          {/* to-do:
          1. Нормальное решение */}
          <div id={MODAL_EDIT} />
          <div id={MODAL_HOLIDAYS} />
          <ModalPage
            id={MODAL_FRIEND}
            onClose={() => router.popPage()}
            header={
              <ModalPageHeader
                left={
                  <Fragment>
                    {(platform === ANDROID || platform === VKCOM) && (
                      <PanelHeaderButton onClick={() => router.popPage()}>
                        <Icon24Cancel />
                      </PanelHeaderButton>
                    )}
                  </Fragment>
                }
                right={
                  <Fragment>
                    {platform === IOS && (
                      <PanelHeaderButton onClick={() => router.popPage()}>
                        {getLangKey('modals_ios_close')}
                      </PanelHeaderButton>
                    )}
                  </Fragment>
                }
              >
                {getLangKey('modal_friend_header')}
              </ModalPageHeader>
            }
            dynamicContentHeight
          >
            <Profile
              avatar={activeFriend.info.photo_200}
              name={`${activeFriend.info.first_name} ${activeFriend.info.last_name}`}
            />

            {(!activeFriend.info.start_date || !activeFriend.info.years_count) && (
              <Placeholder icon={<Icon56EventOutline />}>
                {getLangKey('modal_friend_progress_undefined')}
              </Placeholder>
            )}

            {activeFriend.info.start_date && activeFriend.info.years_count && (
              <CustomProgress
                dateStart={new Date(activeFriend.info.start_date)}
                yearsCount={Number(activeFriend.info.years_count)}
                before={
                  <Placeholder icon={<Icon56RecentOutline />}>
                    {getLangKey('modal_friend_progress_before')}
                  </Placeholder>
                }
                after={
                  <Placeholder icon={<Icon56Stars3Outline />}>
                    {getLangKey('modal_friend_progress_after')}
                  </Placeholder>
                }
                friend
              />
            )}
          </ModalPage>
        </ModalRoot>
      </ModalPortal>
    </Panel>
  );
};
