import { ChangeEvent, FC, Fragment, useState } from 'react';
import ModalPage, { ModalPageProps } from '@vkontakte/vkui/dist/components/ModalPage/ModalPage';
import { useRouter } from '@happysanta/router';
import {
  ANDROID,
  Button,
  Div,
  FormItem,
  FormLayout,
  Input,
  IOS,
  ModalPageHeader,
  NativeSelect,
  PanelHeaderButton,
  usePlatform,
  VKCOM,
} from '@vkontakte/vkui';
import { Icon24Cancel } from '@vkontakte/icons';
import { useDispatch } from 'react-redux';

import { useLanguage } from '../../hooks/useLanguage';
import { fetchNewDate } from '../../redux/fetch';
import { useInput } from '../../hooks/useInput';
import { parseDateForInput } from '../../utils/dates';
import { useSelector } from '../../hooks/useSelector';
import { isEmpty } from '../../utils/validation';
import { declOfNum } from '../../utils/words';

const nowDateForInput = parseDateForInput(new Date());

export const EditModal: FC<ModalPageProps> = (props) => {
  const { user } = useSelector();
  const router = useRouter();
  const platform = usePlatform();
  const { getLangKey } = useLanguage();
  const [dateError, setDateError] = useState(false);
  const dispatch = useDispatch();
  const [years] = useInput(String(user.years_count) || String(1));
  const [date] = useInput(user.start_date || nowDateForInput);

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
    <ModalPage
      {...props}
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
  );
};
