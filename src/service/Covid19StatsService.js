import { formatDateInAPIStd } from '../utils';
import { authAxios } from '../config/axios';

export const Covid19StatsService = {
  async getLatestStateStats({ withLastDay = false } = {}) {
    const today = formatDateInAPIStd(new Date());
    if (!withLastDay) {
      const data = await Covid19StatsService.getStateStatsByDate(today);
      return data;
    }

    const d = new Date();
    d.setDate(d.getDate() - 1);
    const lastDay = formatDateInAPIStd(d);

    const tasks = [];
    tasks.push(
      Covid19StatsService.getStateStatsByDate(today, { returnRawData: true }),
      Covid19StatsService.getStateStatsByDate(lastDay, { returnRawData: true })
    );

    const [todayStats, lastDayStats] = await Promise.all(tasks);

    Object.keys(todayStats).forEach((key) => {
      todayStats[key].lastDayStat = lastDayStats[key];
    });

    return Object.values(todayStats);
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
