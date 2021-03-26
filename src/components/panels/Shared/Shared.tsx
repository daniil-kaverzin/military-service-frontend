import { FC } from 'react';
import Panel, { PanelProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import { PanelHeader } from '@vkontakte/vkui';

import { useLanguage } from '../../../hooks/useLanguage';
import { useIsMobile } from '../../../hooks/useIsMobile';

export const Shared: FC<PanelProps> = (props) => {
  const isMobile = useIsMobile();
  const { getLangKey } = useLanguage();

  return (
    <Panel {...props}>
      <PanelHeader separator={!isMobile}>{getLangKey('friends_header')}</PanelHeader>
      123
    </Panel>
  );
};
