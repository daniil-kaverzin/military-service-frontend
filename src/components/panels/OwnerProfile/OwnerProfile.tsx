import { FC, Fragment, useCallback } from 'react';
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
import {
  Icon24Filter,
  Icon24ShareOutline,
  Icon56EventOutline,
  Icon56RecentOutline,
  Icon56Stars3Outline,
} from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';
import bridge from '@vkontakte/vk-bridge';

import './OwnerProfile.css';
import { useLanguage } from '../../../hooks/useLanguage';
import { Profile } from '../../Profile';
import { CustomProgress } from '../../CustomProgress';
import { useSelector } from '../../../hooks/useSelector';
import { MODAL_EDIT, MODAL_HOLIDAYS } from '../../../router';
import { getHoliday, parseDate } from '../../../utils/dates';
import { generateProgress } from '../../../utils/canvas';
import { getParameterByName } from '../../../utils/url';
import { isWeb } from '../../../utils/platform';
import { useRef } from 'react';

export interface OwnerProfileProps extends PanelProps {}

export const OwnerProfile: FC<OwnerProfileProps> = (props) => {
  const { getLangKey } = useLanguage();
  const { user } = useSelector();
  const router = useRouter();
  const savedPercents = useRef(0);

  const showStoryBox = useCallback(async () => {
    const percents =
      savedPercents.current > 100 ? 100 : savedPercents.current < 0 ? 0 : savedPercents.current;

    let fill = '#e64646';

    if (percents > 33) {
      fill = '#ecd71d';
    }

    if (percents > 66) {
      fill = '#4bb34b';
    }

    const progress = await generateProgress(percents, fill);

    bridge.send('VKWebAppShowStoryBox', {
      background_type: 'none',
      camera_type: 'front',
      attachment: {
        type: 'url',
        text: 'learn_more',
        url: `https://vk.com/app${getParameterByName('vk_app_id')}`,
      },
      stickers: [
        {
          sticker_type: 'renderable',
          sticker: {
            blob: progress.image,
            content_type: 'image',
            can_delete: false,
            original_height: progress.height,
            original_width: progress.width,
            transform: { relation_width: 0.5 },
          },
        },
      ],
    });
  }, [savedPercents]);

  const holiday = getHoliday(getLangKey('holiday_banner_not_holiday_title'));

  return (
    <Panel {...props}>
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
          onChangePercents={(percents) => (savedPercents.current = percents)}
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

      {!isWeb() && (
        <Div>
          <Button
            before={<Icon24ShareOutline />}
            mode="secondary"
            size="l"
            stretched
            onClick={showStoryBox}
          >
            {getLangKey('owner_profile_button_story')}
          </Button>
        </Div>
      )}

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
