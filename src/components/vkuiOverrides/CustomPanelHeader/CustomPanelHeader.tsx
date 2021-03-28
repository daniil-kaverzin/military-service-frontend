import { FC } from 'react';
import { PanelHeader, PanelHeaderProps } from '@vkontakte/vkui';

import { useIsMobile } from '@/hooks/useIsMobile';

export const CustomPanelHeader: FC<PanelHeaderProps> = (props) => {
  const { children, ...restProps } = props;

  const isMobile = useIsMobile();

  return (
    <PanelHeader {...restProps} separator={!isMobile}>
      {children}
    </PanelHeader>
  );
};
