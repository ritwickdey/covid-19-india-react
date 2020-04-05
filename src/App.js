import React, { useState, useEffect } from 'react';
import classes from './app.module.scss';
import StatCards from './components/StatCards';
import StatsTable from './components/StatsTable';
import { Covid19StatsService } from './service/Covid19StatsService';
import { usePolling } from './hooks/usePolling';
import Footer from './components/Footer';

const tenMin = 1000 * 60 * 10;

function App() {
  const [lastetData, setLatestData] = useState([]);
  const [statDate, setStatDate] = useState();
  const [isLoading, setIsLoading] = useState(false);

  usePolling(
    () => {
      Covid19StatsService.getLatestStateStats({ withLastDay: true })
        .then((data) => {
          setStatDate(data.date);
          setLatestData(data.stats);
        })
        .catch((err) => {
          console.error(err);
          console.log('Something went wrong');
        });
    },
    tenMin,
    []
  );

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <div className={classes.img}>
          <img src="favicon.ico" />
        </div>
        <h1 className={classes.h1}>
          COVID-19 INDIA{' '}
          <span className={classes.goCorona}>
            (
            <a
              style={{ color: 'inherit' }}
              target="_blank"
              href="https://twitter.com/hashtag/GoCorona"
            >
              #goCorona
            </a>
            😷)
          </span>
          <span>
            (Data is periodontally collected from{' '}
            <a
              target="_blank"
              style={{ color: 'inherit' }}
              href={'https://www.mohfw.gov.in'}
            >
              Official Website
            </a>
            )
          </span>
        </h1>
      </div>

      <StatCards statDate={statDate} data={lastetData} />
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
