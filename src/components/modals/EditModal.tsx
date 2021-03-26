import { ChangeEvent, FC, Fragment, useState } from 'react';
import { useRouter } from '@happysanta/router';
import {
  ANDROID,
  Button,
  Div,
  FormItem,
  FormLayout,
  Input,
  IOS,
  ModalPage,
  ModalPageProps,
  ModalPageHeader,
  NativeSelect,
  PanelHeaderButton,
  PanelHeaderClose,
  SimpleCell,
  Switch,
  usePlatform,
  VKCOM,
} from '@vkontakte/vkui';
import { Icon24Dismiss } from '@vkontakte/icons';
import { useDispatch } from 'react-redux';

import { useLanguage } from '@/hooks/useLanguage';
import { useInput } from '@/hooks/useInput';
import { useSelector } from '@/hooks/useSelector';
import { useIsMobile } from '@/hooks/useIsMobile';
import { fetchNewData } from '@/redux/fetch';
import { parseDateForInput } from '@/utils/dates';
import { isEmpty } from '@/utils/validation';
import { declOfNum } from '@/utils/words';

const nowDateForInput = parseDateForInput(new Date());

export const EditModal: FC<ModalPageProps> = (props) => {
  const isMobile = useIsMobile();
  const { user } = useSelector();
  const router = useRouter();
  const platform = usePlatform();
  const { getLangKey } = useLanguage();
  const [dateError, setDateError] = useState(false);
  const dispatch = useDispatch();
  const [years] = useInput(String(user.years_count || 1));
  const [date] = useInput(user.start_date || nowDateForInput);
  const [isPrivate, setIsPrivate] = useState(user.private);

  const changeDate = (event: ChangeEvent<HTMLInputElement>) => {
    date.onChange(event);
    setDateError(false);
  };

  const changeIsPrivate = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  const saveNewData = () => {
    if (
      date.value === user.start_date &&
      Number(years.value) === user.years_count &&
      isPrivate === user.private
    ) {
      router.popPage();
      return;
    }

    if (isEmpty(date.value)) {
      setDateError(true);
    } else {
      dispatch(fetchNewData(date.value, Number(years.value), isPrivate));
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
              {isMobile && (platform === ANDROID || platform === VKCOM) && (
                <PanelHeaderClose onClick={() => router.popPage()} />
              )}
            </Fragment>
          }
          right={
            <Fragment>
              {isMobile && platform === IOS && (
                <PanelHeaderButton onClick={() => router.popPage()}>
                  <Icon24Dismiss />
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
        <SimpleCell after={<Switch checked={isPrivate} onChange={changeIsPrivate} />} disabled>
          {getLangKey('modal_edit_private')}
        </SimpleCell>
      </FormLayout>
      <Div>
        <Button disabled={user.loading} size="l" stretched onClick={saveNewData}>
          {getLangKey('modal_edit_button_save')}
        </Button>
      </Div>
    </ModalPage>
  );
};
