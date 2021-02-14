import React, { FC, MouseEvent } from 'react';
import { Button, Panel, Placeholder, Root, View } from '@vkontakte/vkui';
import { Icon56ErrorOutline } from '@vkontakte/icons';

import './ScreenCrash.css';

export interface ScreenCrashProps {
  onReload?: (event: MouseEvent) => void;
}

export const ScreenCrash: FC<ScreenCrashProps> = ({ onReload }) => {
  return (
    <Root activeView="view">
      <View id="view" activePanel="panel">
        <Panel id="panel" className="ScreenCrash">
          <Placeholder
            icon={<Icon56ErrorOutline />}
            header="Произошла ошибка!"
            action={<Button onClick={onReload}>Перезагрузить</Button>}
          >
            Попробуйте перезагрузить приложение
          </Placeholder>
        </Panel>
      </View>
    </Root>
  );
};
