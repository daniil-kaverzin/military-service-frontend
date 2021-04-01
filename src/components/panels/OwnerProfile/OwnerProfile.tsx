import { FC, useMemo } from 'react';
import Panel, { PanelProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import {
  Banner,
  Button,
  Div,
  Group,
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
import { useLanguage } from '@/hooks/useLanguage';
import { useSelector } from '@/hooks/useSelector';
import { getHoliday, parseDate } from '@/utils/dates';
import { MODAL_EDIT, MODAL_HOLIDAYS, POPOUT_SELECT_SHARE_MODE, POPOUT_SHARE_ALERT } from '@/router';
import { Profile } from '../../Profile';
import { CustomProgress } from '../../CustomProgress';
import { Ads } from '../../Ads';
import { CustomPanelHeader } from '@/components/vkuiOverrides/CustomPanelHeader';

export interface OwnerProfileProps extends PanelProps {
  openPopoutSelectShareMoreRef?: Ref<HTMLElement>;
}

export const OwnerProfile: FC<OwnerProfileProps> = (props) => {
  const { openPopoutSelectShareMoreRef, ...restProps } = props;

  const { getLangKey } = useLanguage();
  const { user } = useSelector();
  const router = useRouter();

  const name = `${user.first_name} ${user.last_name}`;

  const holiday = useMemo(() => {
    return getHoliday(getLangKey('holiday_banner_not_holiday_title'));
  }, [getLangKey]);

  return (
    <Panel {...restProps} className="OwnerProfile">
      <CustomPanelHeader
        left={
          <PanelHeaderButton onClick={() => router.pushModal(MODAL_EDIT)}>
            <Icon24Filter />
          </PanelHeaderButton>
        }
      >
        {getLangKey('owner_profile_header')}
      </CustomPanelHeader>

      <Group>
        <Ads />

        <Profile avatar={user.photo_200} name={name} />

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
            dateStart={user.start_date}
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
            onClick={() =>
              router.pushPopup(user.private ? POPOUT_SHARE_ALERT : POPOUT_SELECT_SHARE_MODE)
            }
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
          actions={
            <Button onClick={() => router.pushModal(MODAL_HOLIDAYS)}>
              {getLangKey('holiday_banner_button')}
            </Button>
          }
        />
      </Group>

      {user.loading && <ScreenSpinner />}
    </Panel>
  );
};
