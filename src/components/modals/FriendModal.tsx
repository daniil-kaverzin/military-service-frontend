import { FC, Fragment } from 'react';
import { useRouter } from '@happysanta/router';
import {
  Icon24Dismiss,
  Icon56BlockOutline,
  Icon56EventOutline,
  Icon56RecentOutline,
  Icon56Stars3Outline,
} from '@vkontakte/icons';
import {
  ANDROID,
  IOS,
  ModalPage,
  ModalPageProps,
  ModalPageHeader,
  PanelHeaderButton,
  PanelHeaderClose,
  Placeholder,
  usePlatform,
  VKCOM,
} from '@vkontakte/vkui';

import { useLanguage } from '../../hooks/useLanguage';
import { CustomProgress } from '../CustomProgress';
import { Profile } from '../Profile';
import { useSelector } from '../../hooks/useSelector';
import { useIsMobile } from '../../hooks/useIsMobile';

export const FriendModal: FC<ModalPageProps> = (props) => {
  const isMobile = useIsMobile();
  const platform = usePlatform();
  const router = useRouter();
  const { getLangKey } = useLanguage();
  const { activeFriend } = useSelector();

  return (
    <ModalPage
      {...props}
      onClose={() => router.popPage()}
      header={
        <ModalPageHeader
          left={
            <Fragment>
              {isMobile && (platform === ANDROID || platform === VKCOM) && (
                <PanelHeaderClose onClick={() => router.popPage()} />
              )}
            </Fragment>
          }
          right={
            <Fragment>
              {isMobile && platform === IOS && (
                <PanelHeaderButton onClick={() => router.popPage()}>
                  <Icon24Dismiss />
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
      {activeFriend.info.private && (
        <Placeholder icon={<Icon56BlockOutline />}>
          {getLangKey('modal_friend_is_private')}
        </Placeholder>
      )}
      {!activeFriend.info.private && (
        <Fragment>
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

          {(!activeFriend.info.start_date || !activeFriend.info.years_count) && (
            <Placeholder icon={<Icon56EventOutline />}>
              {getLangKey('modal_friend_progress_undefined')}
            </Placeholder>
          )}
        </Fragment>
      )}
    </ModalPage>
  );
};
