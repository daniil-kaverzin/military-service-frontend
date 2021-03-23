import { FC } from 'react';
import { ActionSheet, ActionSheetItem, ActionSheetProps } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';

import { openStoryBox } from '../../utils/storyBox';
import { getParameterByName } from '../../utils/url';
import { isWeb } from '../../utils/platform';
import { useSelector } from '../../hooks/useSelector';
import { getProgressBetweenDates } from '../../utils/dates';

const link = `https://vk.com/app${getParameterByName('vk_app_id')}#${getParameterByName(
  'vk_user_id',
)}`;

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
            openStoryBox(getProgressBetweenDates(user.start_date, user.years_count), link);
          }}
        >
          В историю
        </ActionSheetItem>
      )}
      {!isWeb() && (
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
