import { FC, useMemo } from 'react';
import { ActionSheet, ActionSheetItem, ActionSheetProps } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';

import { openStoryBox } from '@/utils/storyBox';
import { useSelector } from '@/hooks/useSelector';
import { getProgressBetweenDates } from '@/utils/dates';

export const SelectShareModePopout: FC<Omit<ActionSheetProps, 'iosCloseItem'>> = (props) => {
  const router = useRouter();
  const { app, user, launchParams } = useSelector();

  const link = useMemo(() => {
    return `https://vk.com/app${launchParams.appId}#${user.id}`;
  }, [user, launchParams]);

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
        <ActionSheetItem
          autoclose
          onClick={() => {
            openStoryBox(getProgressBetweenDates(user.start_date, user.years_count), link);
          }}
        >
          В историю
        </ActionSheetItem>
      )}
      {!app.isWeb && (
        <ActionSheetItem
          autoclose
          onClick={() => {
            bridge.send('VKWebAppShare', { link });
          }}
        >
          В сообщении
        </ActionSheetItem>
      )}
      <ActionSheetItem
        autoclose
        onClick={() => {
          bridge.send('VKWebAppShowWallPostBox', {
            message: link,
            attachments: link,
          });
        }}
      >
        На стену
      </ActionSheetItem>
    </ActionSheet>
  );
};
