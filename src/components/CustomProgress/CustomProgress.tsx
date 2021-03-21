import { Text, Div, Progress as VKProgress, Title, classNames } from '@vkontakte/vkui';
import { FC, Fragment, HTMLAttributes, ReactNode, useEffect, useMemo, useState } from 'react';

import './CustomProgress.css';
import { getDateParts, parseDateToUnix } from '../../utils/dates';
import { declOfNum } from '../../utils/words';
import { useLanguage } from '../../hooks/useLanguage';

export interface CustomProgressProps extends HTMLAttributes<HTMLDivElement> {
  dateStart: Date;
  yearsCount: number;
  friend?: boolean;
  before?: ReactNode;
  after?: ReactNode;
}

export const CustomProgress: FC<CustomProgressProps> = (props) => {
  const { before, after, friend, dateStart, yearsCount, ...restProps } = props;

  const [nowUnix, setNowUnix] = useState(parseDateToUnix(new Date()));
  const { getLangKey } = useLanguage();

  const dateEnd = useMemo(() => {
    const date = new Date(dateStart);
    date.setFullYear(date.getFullYear() + yearsCount);

    return date;
  }, [dateStart, yearsCount]);

  const dateStartUnix = useMemo(() => {
    return parseDateToUnix(dateStart);
  }, [dateStart]);

  const dateEndUnix = useMemo(() => {
    return parseDateToUnix(dateEnd);
  }, [dateEnd]);

  const differenceBetweenNowAndEnd = dateEndUnix - nowUnix;

  const differenceBetweenStartAndNow = nowUnix - dateStartUnix;

  const differenceBetweenDates = useMemo(() => {
    return dateEndUnix - dateStartUnix;
  }, [dateEndUnix, dateStartUnix]);

  const onePercent = useMemo(() => {
    return differenceBetweenDates / 100;
  }, [differenceBetweenDates]);

  const percents = Number((100 - differenceBetweenNowAndEnd / onePercent).toFixed(3));

  const passed = getDateParts(differenceBetweenStartAndNow);

  const lefted = getDateParts(differenceBetweenNowAndEnd);

  useEffect(() => {
    const tick = setInterval(() => {
      setNowUnix(parseDateToUnix(new Date()));
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  return (
    <Div
      {...restProps}
      className={classNames('CustomProgress', friend && 'CustomProgress--friend')}
    >
      {percents < 0 && before}

      {percents > 100 && after}

      {percents <= 100 && percents >= 0 && (
        <Fragment>
          <div className="CustomProgress__progressWrap">
            <Title level="2" weight="semibold" className="CustomProgress__progressValue">
              {percents}%
            </Title>
            <VKProgress value={percents} className="CustomProgress__progressLine" />
          </div>
          <div className="CustomProgress__columns">
            <div className="CustomProgress__column">
              <Title level="2" weight="semibold">
                {getLangKey('profile_passed')}
              </Title>
              <Text weight="regular" className="CustomProgress__timer">
                <div>
                  {passed.days} {declOfNum(passed.days, getLangKey('word_day'))}
                </div>
                <div>
                  {passed.hours} {declOfNum(passed.hours, getLangKey('word_hour'))}
                </div>
                <div>
                  {passed.minutes} {declOfNum(passed.minutes, getLangKey('word_minute'))}
                </div>
                <div>
                  {passed.seconds} {declOfNum(passed.seconds, getLangKey('word_second'))}
                </div>
              </Text>
            </div>
            <div className="CustomProgress__column">
              <Title level="2" weight="semibold">
                {getLangKey('profile_lefted')}
              </Title>
              <Text weight="regular" className="CustomProgress__timer">
                <div>
                  {lefted.days} {declOfNum(lefted.days, getLangKey('word_day'))}
                </div>
                <div>
                  {lefted.hours} {declOfNum(lefted.hours, getLangKey('word_hour'))}
                </div>
                <div>
                  {lefted.minutes} {declOfNum(lefted.minutes, getLangKey('word_minute'))}
                </div>
                <div>
                  {lefted.seconds} {declOfNum(lefted.seconds, getLangKey('word_second'))}
                </div>
              </Text>
            </div>
          </div>
        </Fragment>
      )}
    </Div>
  );
};
