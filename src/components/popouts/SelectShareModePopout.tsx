import { FC, useCallback, useMemo } from 'react';
import { ActionSheet, ActionSheetItem, ActionSheetProps } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';
import { useDispatch } from 'react-redux';

import { openStoryBox } from '@/utils/storyBox';
import { useSelector } from '@/hooks/useSelector';
import { getProgressBetweenDates } from '@/utils/dates';
import { fetchNewData } from '@/redux/fetch';

export const SelectShareModePopout: FC<Omit<ActionSheetProps, 'iosCloseItem'>> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { app, user, launchParams } = useSelector();

  const link = useMemo(() => {
    return `https://vk.com/app${launchParams.appId}#${user.id}`;
  }, [user, launchParams]);

  const setUserIsPublic = useCallback(() => {
    user.private && dispatch(fetchNewData(false));
  }, [user, dispatch]);

  const showStoryBox = useCallback(() => {
    openStoryBox(
      'Срочная служба',
      getProgressBetweenDates(user.start_date, user.years_count),
      link,
    ).then(() => {
      setUserIsPublic();
    });
  }, [setUserIsPublic, user, link]);

  const showWallPostBox = useCallback(() => {
    bridge
      .send('VKWebAppShowWallPostBox', {
        message: link,
        attachments: link,
      })
      .then(() => setUserIsPublic());
  }, [link, setUserIsPublic]);

  const share = useCallback(() => {
    bridge.send('VKWebAppShare', { link }).then(() => setUserIsPublic());
  }, [link, setUserIsPublic]);

  return (
    <ActionSheet
      {...props}
      onClose={() => router.popPage()}
      iosCloseItem={
        <ActionSheetItem autoclose mode="cancel">
          Отменить
        </ActionSheetItem>
      }
    >
      {!app.isWeb && (
        <ActionSheetItem autoclose onClick={showStoryBox}>
          В историю
        </ActionSheetItem>
      )}
      {!app.isWeb && (
        <ActionSheetItem autoclose onClick={share}>
          В сообщении
        </ActionSheetItem>
      )}
      <ActionSheetItem autoclose onClick={showWallPostBox}>
        На стену
      </ActionSheetItem>
    </ActionSheet>
  );
};
