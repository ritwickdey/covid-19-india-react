import { formatDateInAPIStd } from '../utils';
import { authAxios } from '../config/axios';

export const Covid19StatsService = {
  async getLatestStateStats({ withLastDay = false } = {}) {
    const today = new Date();

    if (today.getHours() < 6) {
      today.setDate(today.getDate() - 1);
    }

    const todayStr = formatDateInAPIStd(today);
    if (!withLastDay) {
      const data = await Covid19StatsService.getStateStatsByDate(todayStr);
      return {
        date: todayStr,
        stats: data,
      };
    }

    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    const lastDay = formatDateInAPIStd(d);

    const tasks = [];
    tasks.push(
      Covid19StatsService.getStateStatsByDate(todayStr, {
        returnRawData: true,
      }),
      Covid19StatsService.getStateStatsByDate(lastDay, { returnRawData: true })
    );

    const [todayStats, lastDayStats] = await Promise.all(tasks);

    Object.keys(todayStats).forEach((key) => {
      todayStats[key].lastDayStat = lastDayStats[key] || {
        confirmed: 0,
        recovered: 0,
        death: 0,
      };
    });

    return {
      date: todayStr,
      stats: Object.values(todayStats),
    };
  },

  async getStateStatsByDate(date, { returnRawData = false } = {}) {
    const res = await authAxios.get('covid19/date/' + date);
    const data = res.data || {};
    if (returnRawData) {
      return data;
    }

    return Object.values(res.data);
  },
};
