import { FC } from 'react';
import { Page, Router, RouterContext } from '@happysanta/router';

export const PAGE_PROFILE = '/';
export const PAGE_FRIENDS = '/friends';

export const VIEW_MAIN = 'view_main';
export const VIEW_EXTRA = 'view_extra';

export const PANEL_PROFILE = 'panel_profile';
export const PANEL_FRIENDS = 'panel_friends';

export const MODAL_EDIT = 'modal_edit';
export const MODAL_FRIEND = 'modal_friend';
export const MODAL_HOLIDAYS = 'modal_holidays';

export const POPOUT_SELECT_SHARE_MODE = 'popout_select_share_mode';

const routes = {
  [PAGE_PROFILE]: new Page(PANEL_PROFILE, VIEW_MAIN),
  [PAGE_FRIENDS]: new Page(PANEL_FRIENDS, VIEW_EXTRA),
};

const router = new Router(routes);

router.start();

export const RouterProvider: FC = ({ children }) => {
  return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>;
};
