export const getDateParts = (allSeconds: number) => {
  const seconds = allSeconds % 60;
  const allMinutes = (allSeconds - seconds) / 60;
  const minutes = allMinutes % 60;
  const allHours = (allMinutes - minutes) / 60;
  const hours = allHours % 24;
  const days = (allHours - hours) / 24;

  return {
    days,
    hours,
    minutes,
    seconds: ~~seconds,
  };
};

export const parseDateToUnix = (date: Date) => date.getTime() / 1000;

export const parseDateForInput = (date: Date) => {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toJSON().slice(0, 10);
};

export const holidays = [
  {
    title: 'День войск противовоздушной обороны',
    numberOfWeek: 2,
    day: 0,
    month: 4,
  },
  {
    title: 'День танкиста',
    numberOfWeek: 2,
    day: 0,
    month: 9,
  },
  {
    title: 'День инженерных войск',
    date: '2000-01-21',
  },
  {
    title: 'День защитника Отечества',
    date: '2000-02-23',
  },
  {
    title: 'День моряка-подводника',
    date: '2000-03-19',
  },
  {
    title: 'День Победы',
    date: '2000-05-09',
  },
  {
    title: 'День пограничника',
    date: '2000-05-28',
  },
  {
    title: 'День военного автомобилиста',
    date: '2000-05-29',
  },
  {
    title: 'День Военно-Морского Флота',
    date: '2000-07-29',
  },
  {
    title: 'День тыла вооружённых сил',
    date: '2000-08-01',
  },
  {
    title: 'День Воздушно-десантных войск',
    date: '2000-08-02',
  },
  {
    title: 'День железнодорожных войск',
    date: '2000-08-06',
  },
  {
    title: 'День Военно-воздушных сил',
    date: '2000-08-12',
  },
  {
    title: 'День Сухопутных войск',
    date: '2000-10-01',
  },
  {
    title: 'День Военно-космических сил',
    date: '2000-10-04',
  },
  {
    title: 'День военного связиста',
    date: '2000-10-20',
  },
  {
    title: 'День военного разведчика',
    date: '2000-11-05',
  },
  {
    title: 'День войск радиационной, химической и биологической защиты',
    date: '2000-11-13',
  },
  {
    title: 'День Ракетных войск и артиллерии',
    date: '2000-11-19',
  },
  {
    title: 'День морской пехоты',
    date: '2000-11-27',
  },
  {
    title: 'День Ракетных войск стратегического назначения',
    date: '2000-12-19',
  },
  {
    title: 'День спасателя',
    date: '2000-12-27',
  },
];

export const getHoliday = (notHolidayLabel: string) => {
  const now = new Date();
  const nowDay = now.getDate();
  const nowMonth = now.getMonth();

  const holiday = holidays.find((holiday) => {
    const holidayDate = holiday.date
      ? new Date(holiday.date)
      : getBullShitDate(holiday.numberOfWeek!, holiday.day!, holiday.month!);
    const holidayDay = holidayDate.getDate();
    const holidayMonth = holidayDate.getMonth();

    return holidayMonth === nowMonth && holidayDay === nowDay;
  });

  return (
    holiday ?? {
      title: notHolidayLabel,
      date: undefined,
    }
  );
};

const getBullShitDate = (numberOfWeek: number, day: number, month: number) => {
  const date = new Date();
  date.setMonth(month - 1);
  date.setDate(1);

  let numberOfDay = 0;

  while (date.getDay() !== day) date.setDate(++numberOfDay);

  date.setDate(numberOfDay + 7 * (numberOfWeek - 1 || 1));

  return date;
};

export const parseDate = (date: Date, monthsArray: string[]) => {
  const month = monthsArray[date.getMonth()];
  const day = date.getDate();

  return `${day} ${month}`;
};

export const sortedHolidays = holidays
  .map((holiday) => {
    const newFormatHoliday = {
      title: holiday.title,
      date: holiday.date
        ? new Date(holiday.date)
        : getBullShitDate(holiday.numberOfWeek!, holiday.day!, holiday.month!),
    };

    const nowYear = new Date().getFullYear();
    newFormatHoliday.date.setFullYear(nowYear);

    return newFormatHoliday;
  })
  .sort((holidayA, holidayB) => holidayA.date.getTime() - holidayB.date.getTime());
