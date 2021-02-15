import React, { ChangeEvent, FC, Fragment, useEffect, useState } from 'react';
import Panel, { PanelProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import {
  ANDROID,
  Banner,
  Button,
  Div,
  FormItem,
  FormLayout,
  Input,
  IOS,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  NativeSelect,
  PanelHeader,
  PanelHeaderButton,
  Placeholder,
  ScreenSpinner,
  SimpleCell,
  usePlatform,
  VKCOM,
} from '@vkontakte/vkui';
import {
  Icon24Cancel,
  Icon24Filter,
  Icon56EventOutline,
  Icon56RecentOutline,
  Icon56Stars3Outline,
} from '@vkontakte/icons';
import { useRouter, useThrottlingLocation } from '@happysanta/router';
import { useDispatch } from 'react-redux';

import './OwnerProfile.css';
import { useLanguage } from '../../../hooks/useLanguage';
import { Profile } from '../../Profile';
import { CustomProgress } from '../../CustomProgress';
import { useSelector } from '../../../hooks/useSelector';
import { ModalPortal } from '../../ModalPortal';
import { MODAL_EDIT, MODAL_HOLIDAYS, MODAL_FRIEND } from '../../../router';
import { useInput } from '../../../hooks/useInput';
import { getHoliday, parseDate, parseDateForInput, sortedHolidays } from '../../../utils/dates';
import { fetchNewDate } from '../../../redux/fetch';
import { declOfNum } from '../../../utils/words';
import { isEmpty } from '../../../utils/validation';
import { PopoutPortal } from '../../PopoutPortal';

export interface OwnerProfileProps extends PanelProps {}

export const OwnerProfile: FC<OwnerProfileProps> = (props) => {
  const { getLangKey } = useLanguage();
  const { user } = useSelector();
  const [location] = useThrottlingLocation();
  const router = useRouter();
  const [date, setDate] = useInput(parseDateForInput(new Date()));
  const [dateError, setDateError] = useState(false);
  const [years, setYears] = useInput(String(1));
  const platform = usePlatform();
  const dispatch = useDispatch();

  const activeModalId = location.getModalId();

  useEffect(() => {
    if (!activeModalId) {
      setDate(user.start_date || parseDateForInput(new Date()));
      setYears(user.years_count ? String(user.years_count) : String(1));
      setDateError(false);
    }
  }, [activeModalId, user, setDate, setYears]);

  const holiday = getHoliday(getLangKey('holiday_banner_not_holiday_title'));

  const changeDate = (event: ChangeEvent<HTMLInputElement>) => {
    date.onChange(event);
    setDateError(false);
  };

  const saveNewDate = () => {
    if (date.value === user.start_date && Number(years.value) === user.years_count) {
      router.popPage();
      return;
    }

    if (isEmpty(date.value)) {
      setDateError(true);
    } else {
      dispatch(fetchNewDate(date.value, Number(years.value)));
      router.popPage();
    }
  };

  return (
    <Panel {...props}>
      <PanelHeader
        separator={false}
        left={
          <PanelHeaderButton onClick={() => router.pushModal(MODAL_EDIT)}>
            <Icon24Filter />
          </PanelHeaderButton>
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

      {user.loading && (
        <PopoutPortal>
          <ScreenSpinner />
        </PopoutPortal>
      )}

      <ModalPortal>
        <ModalRoot activeModal={activeModalId} onClose={() => router.popPage()}>
          {/* to-do:
          1. Нормальное решение */}
          <div id={MODAL_FRIEND} />
          <ModalPage
            id={MODAL_EDIT}
            onClose={() => router.popPage()}
            header={
              <ModalPageHeader
                left={
                  <Fragment>
                    {(platform === ANDROID || platform === VKCOM) && (
                      <PanelHeaderButton onClick={() => router.popPage()}>
                        <Icon24Cancel />
                      </PanelHeaderButton>
                    )}
                  </Fragment>
                }
                right={
                  <Fragment>
                    {platform === IOS && (
                      <PanelHeaderButton onClick={() => router.popPage()}>
                        {getLangKey('modals_ios_close')}
                      </PanelHeaderButton>
                    )}
                  </Fragment>
                }
              >
                {getLangKey('modal_edit_header')}
              </ModalPageHeader>
            }
            dynamicContentHeight
          >
            <FormLayout>
              <FormItem
                status={dateError ? 'error' : undefined}
                bottom={dateError ? getLangKey('error_label_required') : undefined}
                top={getLangKey('modal_edit_start_date_top')}
              >
                <Input value={date.value} onChange={changeDate} type="date" />
              </FormItem>
              <FormItem top={getLangKey('modal_edit_years')}>
                <NativeSelect {...years}>
                  {new Array(2).fill(null).map((_, index) => {
                    const yearCount = ++index;

                    return (
                      <option key={index} value={yearCount}>
                        {yearCount} {declOfNum(yearCount, getLangKey('word_year'))}
                      </option>
                    );
                  })}
                </NativeSelect>
              </FormItem>
            </FormLayout>
            <Div>
              <Button disabled={user.loading} size="l" stretched onClick={saveNewDate}>
                {getLangKey('modal_edit_button_save')}
              </Button>
            </Div>
          </ModalPage>
          <ModalPage
            id={MODAL_HOLIDAYS}
            onClose={() => router.popPage()}
            header={
              <ModalPageHeader
                left={
                  <Fragment>
                    {(platform === ANDROID || platform === VKCOM) && (
                      <PanelHeaderButton onClick={() => router.popPage()}>
                        <Icon24Cancel />
                      </PanelHeaderButton>
                    )}
                  </Fragment>
                }
                right={
                  <Fragment>
                    {platform === IOS && (
                      <PanelHeaderButton onClick={() => router.popPage()}>
                        {getLangKey('modals_ios_close')}
                      </PanelHeaderButton>
                    )}
                  </Fragment>
                }
              >
                {getLangKey('modal_holidays_header')}
              </ModalPageHeader>
            }
            dynamicContentHeight
          >
            {sortedHolidays.map((holiday) => {
              return (
                <SimpleCell
                  className="OwnerProfile__cell"
                  key={holiday.title}
                  disabled
                  description={parseDate(holiday.date, getLangKey('months'))}
                >
                  {holiday.title}
                </SimpleCell>
              );
            })}
          </ModalPage>
        </ModalRoot>
      </ModalPortal>
    </Panel>
  );
};
