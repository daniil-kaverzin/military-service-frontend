import { ChangeEvent, FC, useState } from 'react';
import { useRouter } from '@happysanta/router';
import {
  Button,
  Div,
  FormItem,
  FormLayout,
  Input,
  ModalPage,
  ModalPageProps,
  NativeSelect,
  SimpleCell,
  Switch,
} from '@vkontakte/vkui';
import { useDispatch } from 'react-redux';

import { useLanguage } from '@/hooks/useLanguage';
import { useInput } from '@/hooks/useInput';
import { useSelector } from '@/hooks/useSelector';
import { fetchNewData } from '@/redux/fetch';
import { parseDateForInput } from '@/utils/dates';
import { isEmpty } from '@/utils/validation';
import { declOfNum } from '@/utils/words';
import { CustomModalPageHeader } from '../vkuiOverrides/CustomModalPageHeader';

const nowDateForInput = parseDateForInput(new Date());

export const EditModal: FC<ModalPageProps> = (props) => {
  const { getLangKey } = useLanguage();

  const { user } = useSelector();
  const dispatch = useDispatch();

  const [years] = useInput(String(user.years_count || 1));

  const [date] = useInput(user.start_date || nowDateForInput);
  const [dateError, setDateError] = useState(false);

  const [isPrivate, setIsPrivate] = useState(user.private);

  const router = useRouter();

  const changeDate = (event: ChangeEvent<HTMLInputElement>) => {
    date.onChange(event);
    setDateError(false);
  };

  const changeIsPrivate = (event: ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  const saveNewData = () => {
    const yearsValue = Number(years.value);

    if (
      date.value === user.start_date &&
      yearsValue === user.years_count &&
      isPrivate === user.private
    ) {
      router.popPage();
      return;
    }

    if (isEmpty(date.value)) {
      setDateError(true);
    } else {
      dispatch(fetchNewData(isPrivate, date.value, yearsValue));
      router.popPage();
    }
  };

  return (
    <ModalPage
      {...props}
      onClose={() => router.popPage()}
      header={<CustomModalPageHeader>{getLangKey('modal_edit_header')}</CustomModalPageHeader>}
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
