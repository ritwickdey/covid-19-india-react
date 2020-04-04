import React, { useState, useEffect } from 'react';
import classes from './app.module.scss';
import StatCards from './components/StatCards';
import StatsTable from './components/StatsTable';
import { Covid19StatsService } from './service/Covid19StatsService';
import { usePolling } from './hooks/usePolling';
import Footer from './components/Footer';

function App() {
  const [lastetData, setLatestData] = useState([]);

  usePolling(
    () => {
      Covid19StatsService.getLatestStateStats({ withLastDay: true })
        .then((data) => {
          setLatestData(data);
        })
        .catch((err) => {
          console.error(err);
          console.log('Something went wrong');
        });
    },
    10000,
    []
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.h1}>
        COVID-19 INDIA
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

      <StatCards data={lastetData} />

      <h4>State wise breakdown</h4>

      <StatsTable data={lastetData} />

      <Footer />
    </div>
  );
}

export default App;
