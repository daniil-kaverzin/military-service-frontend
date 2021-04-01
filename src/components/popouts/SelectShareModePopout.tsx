import { FC, Fragment, useCallback } from 'react';
import { ActionSheet, ActionSheetItem, ActionSheetProps } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';
import { useDispatch } from 'react-redux';
import { noop } from '@vkontakte/vkjs';

import { openStoryBox } from '@/utils/storyBox';
import { useSelector } from '@/hooks/useSelector';
import { getProgressBetweenDates } from '@/utils/dates';
import { fetchNewData } from '@/redux/fetch';
import { useLanguage } from '@/hooks/useLanguage';

export const SelectShareModePopout: FC<Omit<ActionSheetProps, 'iosCloseItem'>> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { app, user, launchParams } = useSelector();
  const { getLangKey } = useLanguage();

  const link = `https://vk.com/app${launchParams.appId}#${user.id}`;

  const setUserIsPublic = useCallback(() => {
    user.private && dispatch(fetchNewData(false));
  }, [user, dispatch]);

  const showStoryBox = useCallback(() => {
    openStoryBox(
      getLangKey('app_title'),
      getProgressBetweenDates(user.start_date, user.years_count).percents,
      link,
    )
      .then(() => {
        setUserIsPublic();
      })
      .catch(noop);
  }, [getLangKey, setUserIsPublic, user, link]);

  const showWallPostBox = useCallback(() => {
    bridge
      .send('VKWebAppShowWallPostBox', {
        message: link,
        attachments: link,
      })
      .then(() => setUserIsPublic())
      .catch(noop);
  }, [link, setUserIsPublic]);

  const share = useCallback(() => {
    bridge
      .send('VKWebAppShare', { link })
      .then(() => setUserIsPublic())
      .catch(noop);
  }, [link, setUserIsPublic]);

  return (
    <ActionSheet
      {...props}
      onClose={() => router.popPage()}
      iosCloseItem={
        <ActionSheetItem autoclose mode="cancel">
          {getLangKey('action_sheet_share_cancel')}
        </ActionSheetItem>
      }
    >
      {!app.isWeb && (
        <Fragment>
          <ActionSheetItem autoclose onClick={showStoryBox}>
            {getLangKey('action_sheet_share_story')}
          </ActionSheetItem>
          <ActionSheetItem autoclose onClick={share}>
            {getLangKey('action_sheet_share_message')}
          </ActionSheetItem>
        </Fragment>
      )}

      <ActionSheetItem autoclose onClick={showWallPostBox}>
        {getLangKey('action_sheet_share_wall')}
      </ActionSheetItem>
    </ActionSheet>
  );
};
