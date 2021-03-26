import { FC, Fragment, useEffect } from 'react';
import Panel, { PanelProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import { Div, Group, PanelHeader, Placeholder, Spinner } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import {
  Icon56BlockOutline,
  Icon56EventOutline,
  Icon56RecentOutline,
  Icon56Stars3Outline,
} from '@vkontakte/icons';
import { useDispatch } from 'react-redux';

import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSelector } from '@/hooks/useSelector';
import { fetchActiveFriend } from '@/redux/fetch';
import { Profile } from '../../Profile';
import { Ads } from '../../Ads';
import { CustomProgress } from '../../CustomProgress';

export const Shared: FC<PanelProps> = (props) => {
  const isMobile = useIsMobile();
  const { app, activeFriend } = useSelector();
  const { getLangKey } = useLanguage();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (app.idFromHash) {
      dispatch(fetchActiveFriend(app.idFromHash));
    }
  }, [dispatch, app, router]);

  return (
    <Panel {...props}>
      <PanelHeader separator={!isMobile}>{getLangKey('shared_header')}</PanelHeader>
      <Group>
        <Ads />
        {(activeFriend.loading || !activeFriend.info.id) && (
          <Div>
            <Spinner size="large" />
          </Div>
        )}
        {!activeFriend.loading && Boolean(activeFriend.info.id) && (
          <Fragment>
            <Profile
              name={`${activeFriend.info.first_name} ${activeFriend.info.last_name}`}
              avatar={activeFriend.info.photo_200}
            />
            {activeFriend.info.private && (
              <Placeholder icon={<Icon56BlockOutline />}>
                {getLangKey('shared_is_private')}
              </Placeholder>
            )}
            {!activeFriend.info.private && (
              <Fragment>
                {activeFriend.info.start_date && activeFriend.info.years_count && (
                  <CustomProgress
                    dateStart={new Date(activeFriend.info.start_date)}
                    yearsCount={Number(activeFriend.info.years_count)}
                    friend
                    before={
                      <Placeholder icon={<Icon56RecentOutline />}>
                        {getLangKey('shared_progress_before')}
                      </Placeholder>
                    }
                    after={
                      <Placeholder icon={<Icon56Stars3Outline />}>
                        {getLangKey('shared_progress_after')}
                      </Placeholder>
                    }
                  />
                )}
                {(!activeFriend.info.start_date || !activeFriend.info.years_count) && (
                  <Placeholder icon={<Icon56EventOutline />}>
                    {getLangKey('shared_progress_undefined')}
                  </Placeholder>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </Group>
    </Panel>
  );
};
