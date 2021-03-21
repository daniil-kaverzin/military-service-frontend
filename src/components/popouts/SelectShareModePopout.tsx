import { FC } from 'react';
import { ActionSheet, ActionSheetItem, ActionSheetProps } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';

import { openStoryBox } from '../../utils/storyBox';
import { getParameterByName } from '../../utils/url';
import { isWeb } from '../../utils/platform';
import { useSelector } from '../../hooks/useSelector';
import { getProgressBetweenDates } from '../../utils/dates';
import bridge from '@vkontakte/vk-bridge';

const url = `https://vk.com/app${getParameterByName('vk_app_id')}`;

export const SelectShareModePopout: FC<Omit<ActionSheetProps, 'iosCloseItem'>> = (props) => {
  const router = useRouter();
  const { user } = useSelector();

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
      {!isWeb() && (
        <ActionSheetItem
          autoclose
          onClick={() => {
            openStoryBox(getProgressBetweenDates(user.start_date, user.years_count), url);
          }}
        >
          В историю
        </ActionSheetItem>
      )}
      <ActionSheetItem
        autoclose
        onClick={() => {
          bridge.send('VKWebAppShare', { link: 'https://vk.com/app123#hello' });
        }}
      >
        В сообщении
      </ActionSheetItem>
      <ActionSheetItem
        autoclose
        onClick={() => {
          bridge.send('VKWebAppShowWallPostBox', {
            message: 'https://vk.com/app123#hello',
            attachments: 'https://vk.com/app123#hello',
          });
        }}
      >
        На стену
      </ActionSheetItem>
    </ActionSheet>
  );
};
