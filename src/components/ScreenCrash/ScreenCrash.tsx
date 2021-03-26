import React, { FC, MouseEvent } from 'react';
import { Button, Group, Panel, Placeholder, Root, View } from '@vkontakte/vkui';
import { Icon56ErrorOutline } from '@vkontakte/icons';

import { useLanguage } from '@/hooks/useLanguage';

export interface ScreenCrashProps {
  onReload?: (event: MouseEvent) => void;
}

export const ScreenCrash: FC<ScreenCrashProps> = ({ onReload }) => {
  const { getLangKey } = useLanguage();

  return (
    <Root activeView="view">
      <View id="view" activePanel="panel">
        <Panel id="panel" centered className="ScreenCrash">
          <Group>
            <Placeholder
              icon={<Icon56ErrorOutline />}
              header={getLangKey('error_header')}
              action={<Button onClick={onReload}>{getLangKey('error_button_reload')}</Button>}
            >
              {getLangKey('error_text')}
            </Placeholder>
          </Group>
        </Panel>
      </View>
    </Root>
  );
};
