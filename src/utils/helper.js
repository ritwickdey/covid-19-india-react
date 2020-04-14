import {
  calculateActiveCase,
  calculateRecoveredRate,
  calculateMortalityRate,
} from '.';

export const densityKeysSchema = [
  {
    key: 'confirmed',
    title: 'Confirmed',
  },
  {
    key: 'active',
    title: 'Active',
    dataModifier: (data) => (data.active = calculateActiveCase(data)),
  },
  {
    key: 'recovered',
    title: 'Recovered',
  },
  {
    key: 'death',
    title: 'Death',
  },
  {
    key: 'recoveredRate',
    title: 'Recovered Rate',
    dataModifier: (data) => (data.recoveredRate = calculateRecoveredRate(data)),
  },
  {
    key: 'mortalityRate',
    title: 'Death Rate',
    dataModifier: (data) => (data.mortalityRate = calculateMortalityRate(data)),
  },
];
