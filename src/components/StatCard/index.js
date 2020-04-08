import React from 'react';
import classes from './statCard.module.scss';
import NumberRace from '../NumberRace';
import { formatNumber } from '../../utils';

const StatCard = (props) => {
  return (
    <div style={{ background: props.bgColor }} className={classes.container}>
      <span className={classes.title}>
        {props.title}
        {props.isLoading && <span className={classes.loader}></span>}
      </span>
      <div className={classes.statContainer}>
        <span className={classes.stat}>
          <NumberRace>{props.stat}</NumberRace>
        </span>

        <span
          style={{ opacity: props.inc === 0 ? 0 : 1 }}
          className={classes.inc}
        >
          {props.inc > 0 && '+'}
          {<NumberRace>{props.inc}</NumberRace>}
        </span>
      </div>

      <span className={classes.footer}>
        {!!props.percent && (
          <span className={classes.percent}>
            {<NumberRace>{formatNumber(props.percent, 2)}</NumberRace>}%
          </span>
        )}
        {!!props.date && (
          <span className={classes.date}>
            {<NumberRace>{props.date}</NumberRace>}
          </span>
        )}
      </span>
    </div>
  );
};

export default StatCard;
