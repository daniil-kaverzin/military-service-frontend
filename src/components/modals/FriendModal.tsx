import { FC, Fragment } from 'react';
import { useRouter } from '@happysanta/router';
import {
  Icon56BlockOutline,
  Icon56EventOutline,
  Icon56RecentOutline,
  Icon56Stars3Outline,
} from '@vkontakte/icons';
import { ModalPage, ModalPageProps, Placeholder } from '@vkontakte/vkui';

import { useLanguage } from '@/hooks/useLanguage';
import { useSelector } from '@/hooks/useSelector';
import { CustomProgress } from '../CustomProgress';
import { Profile } from '../Profile';
import { CustomModalPageHeader } from '../vkuiOverrides/CustomModalPageHeader';

export const FriendModal: FC<ModalPageProps> = (props) => {
  const router = useRouter();

  const { getLangKey } = useLanguage();
  const { activeUser } = useSelector();

  const name = `${activeUser.info.first_name} ${activeUser.info.last_name}`;

  return (
    <ModalPage
      {...props}
      onClose={() => router.popPage()}
      header={<CustomModalPageHeader>{getLangKey('modal_friend_header')}</CustomModalPageHeader>}
      dynamicContentHeight
    >
      <Profile avatar={activeUser.info.photo_200} name={name} />

      {activeUser.info.private && (
        <Placeholder icon={<Icon56BlockOutline />}>
          {getLangKey('modal_friend_is_private')}
        </Placeholder>
      )}

      {!activeUser.info.private && (
        <Fragment>
          {activeUser.info.start_date && activeUser.info.years_count && (
            <CustomProgress
              dateStart={activeUser.info.start_date}
              yearsCount={activeUser.info.years_count}
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
              gray
            />
          )}

          {(!activeUser.info.start_date || !activeUser.info.years_count) && (
            <Placeholder icon={<Icon56EventOutline />}>
              {getLangKey('modal_friend_progress_undefined')}
            </Placeholder>
          )}
        </Fragment>
      )}
    </ModalPage>
  );
};
