import React, { useMemo } from 'react';
import StatCard from '../StatCard';
import classes from './statCards.module.scss';
import { calculateActiveCase } from '../../utils';

const StatCards = (props) => {
  const data = useMemo(() => {
    const data = {
      confirmed: 0,
      active: 0,
      recovered: 0,
      death: 0,

      confirmedInc: 0,
      activeInc: 0,
      recoveredInc: 0,
      deathInc: 0,
    };

    const lastData = {
      confirmed: 0,
      active: 0,
      recovered: 0,
      death: 0,
    };

    if (!props.data || !props.data.length) {
      return data;
    }

    for (let i = 0; i < props.data.length; i++) {
      const d = props.data[i];
      data.confirmed += d.confirmed;
      data.recovered += d.recovered;
      data.death += d.death;

      lastData.confirmed += d.lastDayStat.confirmed;
      lastData.recovered += d.lastDayStat.recovered;
      lastData.death += d.lastDayStat.death;
    }
    lastData.active = calculateActiveCase(lastData);
    data.active = calculateActiveCase(data);

    data.confirmedInc = data.confirmed - lastData.confirmed;
    data.activeInc = data.active - lastData.active;
    data.recoveredInc = data.recovered - lastData.recovered;
    data.deathInc = data.death - lastData.death;

    return data;
  }, [props.data]);

  return (
    <div className={classes.statCardContaier}>
      <StatCard
        bgColor="#e74c3c"
        title="Confirmed"
        inc={data.confirmedInc}
        stat={data.confirmed}
      />
      <StatCard
        bgColor="#2980b9"
        title="Active"
        inc={data.activeInc}
        stat={data.active}
        percent={data.confirmed ? (data.active / data.confirmed) * 100 : 0}
      />
      <StatCard
        bgColor="#27ae60"
        title="Recovered"
        inc={data.recoveredInc}
        stat={data.recovered}
        percent={data.confirmed ? (data.recovered / data.confirmed) * 100 : 0}
      />
      <StatCard
        bgColor="#2c3e50"
        title="Death"
        percent={data.confirmed ? (data.death / data.confirmed) * 100 : 0}
        inc={data.deathInc}
        stat={data.death}
      />
    </div>
  );
};

export default StatCards;
