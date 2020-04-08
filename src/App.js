import React, { useState } from 'react';
import classes from './app.module.scss';
import StatCards from './components/StatCards';
import StatsTable from './components/StatsTable';
import { Covid19StatsService } from './service/Covid19StatsService';
import { usePolling } from './hooks/usePolling';
import Footer from './components/Footer';
import { useLocalStorage } from './hooks/useLocalstorage';

const tenMin = 1000 * 60 * 10;

function App() {
  const [lastetData, setLatestData] = useLocalStorage('__last_data__', []);
  const [statDate, setStatDate] = useLocalStorage('__date__');
  const [isLoading, setIsLoading] = useState(false);

  usePolling(
    () => {
      setIsLoading(true);
      Covid19StatsService.getLatestStateStats({ withLastDay: true })
        .then((data) => {
          setStatDate(data.date);
          setLatestData(data.stats);
        })
        .catch((err) => {
          console.error(err);
          console.log('Something went wrong');
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    tenMin,
    []
  );

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <div className={classes.h1}>
          <span className={classes.text}>
            <span>C</span>
            <div className={classes.img}>
              <img alt="O" src="favicon.ico" />
            </div>
            <span>VID-19 INDIA</span>
          </span>
          <span className={classes.goCorona}>
            (
            <a
              style={{ color: 'inherit' }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/hashtag/GoCorona"
            >
              #goCorona
            </a>
            😷)
          </span>
        </div>
        <span className={classes.headerInfo}>
          Refined stats from COVID-19{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}
            href={'https://www.mohfw.gov.in'}
          >
            Official Website
          </a>{' '}
        </span>
      </div>

      <StatCards isLoading={isLoading} statDate={statDate} data={lastetData} />
      <div>
        <h4 style={{ marginBottom: '0.2rem', fontSize: '1.15rem' }}>
          State wise breakdown
        </h4>
        <StatsTable statDate={statDate} data={lastetData} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
