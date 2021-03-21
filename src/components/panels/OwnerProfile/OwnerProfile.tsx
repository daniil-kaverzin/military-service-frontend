import { FC, Fragment, useMemo } from 'react';
import Panel, { PanelProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import {
  Banner,
  Button,
  Div,
  PanelHeader,
  PanelHeaderButton,
  Placeholder,
  ScreenSpinner,
} from '@vkontakte/vkui';
import { Ref } from '@vkontakte/vkui/dist/types';
import {
  Icon24Filter,
  Icon24ShareOutline,
  Icon56EventOutline,
  Icon56RecentOutline,
  Icon56Stars3Outline,
} from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';

import './OwnerProfile.css';
import { useLanguage } from '../../../hooks/useLanguage';
import { Profile } from '../../Profile';
import { CustomProgress } from '../../CustomProgress';
import { useSelector } from '../../../hooks/useSelector';
import { MODAL_EDIT, MODAL_HOLIDAYS, POPOUT_SELECT_SHARE_MODE } from '../../../router';
import { getHoliday, parseDate } from '../../../utils/dates';
import { Ads } from '../../Ads';

export interface OwnerProfileProps extends PanelProps {
  openPopoutSelectShareMoreRef?: Ref<HTMLElement>;
}

export const OwnerProfile: FC<OwnerProfileProps> = (props) => {
  const { openPopoutSelectShareMoreRef, ...restProps } = props;
  const { getLangKey } = useLanguage();
  const { user } = useSelector();
  const router = useRouter();

  const holiday = useMemo(() => {
    return getHoliday(getLangKey('holiday_banner_not_holiday_title'));
  }, [getLangKey]);

  return (
    <Panel {...restProps}>
      <PanelHeader
        separator={false}
        left={
          <Fragment>
            <PanelHeaderButton onClick={() => router.pushModal(MODAL_EDIT)}>
              <Icon24Filter />
            </PanelHeaderButton>
          </Fragment>
        }
      >
        {getLangKey('owner_profile_header')}
      </PanelHeader>

      <Ads />

      <Profile avatar={user.photo_200} name={`${user.first_name} ${user.last_name}`} />
      {(!user.start_date || !user.years_count) && (
        <Placeholder
          icon={<Icon56EventOutline />}
          header={getLangKey('owner_profile_progress_undefined_title')}
          action={
            <Button size="m" onClick={() => router.pushModal(MODAL_EDIT)}>
              {getLangKey('owner_profile_progress_undefined_button')}
            </Button>
          }
        >
          {getLangKey('owner_profile_progress_undefined_description')}
        </Placeholder>
      )}
      {user.start_date && user.years_count && (
        <CustomProgress
          dateStart={new Date(user.start_date)}
          yearsCount={user.years_count}
          before={
            <Placeholder icon={<Icon56RecentOutline />}>
              {getLangKey('owner_profile_progress_before')}
            </Placeholder>
          }
          after={
            <Placeholder icon={<Icon56Stars3Outline />}>
              {getLangKey('owner_profile_progress_after')}
            </Placeholder>
          }
        />
      )}
      <Div>
        <Button
          before={<Icon24ShareOutline />}
          mode="secondary"
          size="l"
          stretched
          onClick={() => router.pushPopup(POPOUT_SELECT_SHARE_MODE)}
          getRootRef={openPopoutSelectShareMoreRef}
        >
          {getLangKey('owner_profile_button_share')}
        </Button>
      </Div>
      <Banner
        size="m"
        header={holiday.title}
        subheader={
          holiday.date
            ? parseDate(new Date(holiday.date), getLangKey('months'))
            : getLangKey('holiday_banner_not_holiday_description')
        }
        onClick={() => router.pushModal(MODAL_HOLIDAYS)}
        actions={<Button>{getLangKey('holiday_banner_button')}</Button>}
      />
      {user.loading && <ScreenSpinner />}
    </Panel>
  );
};
