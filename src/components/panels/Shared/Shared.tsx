import { FC, Fragment, useEffect } from 'react';
import Panel, { PanelProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import { Div, Group, Placeholder, Spinner } from '@vkontakte/vkui';
import { useRouter } from '@happysanta/router';
import {
  Icon56BlockOutline,
  Icon56EventOutline,
  Icon56RecentOutline,
  Icon56Stars3Outline,
} from '@vkontakte/icons';
import { useDispatch } from 'react-redux';

import { useLanguage } from '@/hooks/useLanguage';
import { useSelector } from '@/hooks/useSelector';
import { fetchActiveFriend } from '@/redux/fetch';
import { Profile } from '../../Profile';
import { Ads } from '../../Ads';
import { CustomProgress } from '../../CustomProgress';
import { CustomPanelHeader } from '@/components/vkuiOverrides/CustomPanelHeader';

export const Shared: FC<PanelProps> = (props) => {
  const { app, activeUser } = useSelector();
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
      <CustomPanelHeader>{getLangKey('shared_header')}</CustomPanelHeader>
      <Group>
        <Ads />

        {(activeUser.loading || !activeUser.info.id) && (
          <Div>
            <Spinner size="large" />
          </Div>
        )}

        {!activeUser.loading && !!activeUser.info.id && (
          <Fragment>
            <Profile
              name={`${activeUser.info.first_name} ${activeUser.info.last_name}`}
              avatar={activeUser.info.photo_200}
            />

            {activeUser.info.private && (
              <Placeholder icon={<Icon56BlockOutline />}>
                {getLangKey('shared_is_private')}
              </Placeholder>
            )}

            {!activeUser.info.private && (
              <Fragment>
                {activeUser.info.start_date && activeUser.info.years_count && (
                  <CustomProgress
                    dateStart={activeUser.info.start_date}
                    yearsCount={activeUser.info.years_count}
                    gray
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

                {(!activeUser.info.start_date || !activeUser.info.years_count) && (
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
