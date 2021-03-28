import { FC, Fragment } from 'react';
import {
  ANDROID,
  IOS,
  ModalPageHeader,
  ModalPageHeaderProps,
  PanelHeaderButton,
  PanelHeaderClose,
  usePlatform,
  VKCOM,
} from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import { Icon24Dismiss } from '@vkontakte/icons';

import { useIsMobile } from '@/hooks/useIsMobile';

export const CustomModalPageHeader: FC<ModalPageHeaderProps> = (props) => {
  const { children, ...restProps } = props;

  const isMobile = useIsMobile();
  const platform = usePlatform();

  const router = useRouter();

  return (
    <ModalPageHeader
      {...restProps}
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
      {children}
    </ModalPageHeader>
  );
};
