import { FC } from 'react';
import { useLocation, useRouter } from '@happysanta/router';
import { Icon28Users3Outline, Icon28WristWatchOutline } from '@vkontakte/icons';
import { Cell, classNames, Group, Panel, PanelHeader } from '@vkontakte/vkui';

import './Nav.css';
import { useLanguage } from '../../hooks/useLanguage';
import { PAGE_FRIENDS, PAGE_PROFILE, PANEL_FRIENDS, PANEL_PROFILE } from '../../router';

export const Nav: FC = () => {
  const router = useRouter();
  const location = useLocation();
  const { getLangKey } = useLanguage();

  return (
    <Panel className="Nav">
      <PanelHeader />
      <Group>
        <Cell
          onClick={() => router.pushPage(PAGE_PROFILE)}
          before={<Icon28WristWatchOutline />}
          disabled={location.getPanelId() === PANEL_PROFILE}
          className={classNames(location.getPanelId() === PANEL_PROFILE && 'Nav__selected')}
        >
          {getLangKey('epic_profile')}
        </Cell>
        <Cell
          onClick={() => router.pushPage(PAGE_FRIENDS)}
          before={<Icon28Users3Outline />}
          disabled={location.getPanelId() === PANEL_FRIENDS}
          className={classNames(location.getPanelId() === PANEL_FRIENDS && 'Nav__selected')}
        >
          {getLangKey('epic_users')}
        </Cell>
      </Group>
    </Panel>
  );
};
