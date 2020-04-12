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
          <NumberRace format={formatNumber}>{props.stat}</NumberRace>
        </span>

        <span
          style={{ opacity: props.inc === 0 ? 0 : 1 }}
          className={classes.inc}
        >
          {props.inc > 0 && '+'}
          {<NumberRace format={formatNumber}>{props.inc}</NumberRace>}
        </span>
      </div>

      <span className={classes.footer}>
        {!!props.percent && (
          <span className={classes.percent}>
            {formatNumber(props.percent, 2)}%
          </span>
        )}
        {!!props.date && <span className={classes.date}>{props.date}</span>}
      </span>
    </div>
  );
};

export default StatCard;
