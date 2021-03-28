import { FC, memo } from 'react';
import { useRouter } from '@happysanta/router';
import { ModalPage, ModalPageProps, SimpleCell } from '@vkontakte/vkui';

import { useLanguage } from '@/hooks/useLanguage';
import { parseDate, sortedHolidays } from '@/utils/dates';
import { CustomModalPageHeader } from '../vkuiOverrides/CustomModalPageHeader';

export const HolidaysModal: FC<ModalPageProps> = memo((props) => {
  const router = useRouter();

  const { getLangKey } = useLanguage();

  return (
    <ModalPage
      {...props}
      onClose={() => router.popPage()}
      header={<CustomModalPageHeader>{getLangKey('modal_holidays_header')}</CustomModalPageHeader>}
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
  );
});
