import { FC } from 'react';
import { Alert } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';

import { POPOUT_SELECT_SHARE_MODE } from '@/router';
import { useLanguage } from '@/hooks/useLanguage';

export const ShareAlert: FC = () => {
  const router = useRouter();
  const { getLangKey } = useLanguage();

  return (
    <Alert
      actions={[
        {
          title: getLangKey('alert_share_cancel'),
          autoclose: true,
          mode: 'cancel',
        },
        {
          title: getLangKey('alert_share_ok'),
          mode: 'default',
          action: () => router.replacePopup(POPOUT_SELECT_SHARE_MODE),
        },
      ]}
      header={getLangKey('alert_share_header')}
      text={getLangKey('alert_share_text')}
      actionsLayout="horizontal"
      onClose={() => router.popPage()}
    />
  );
};
