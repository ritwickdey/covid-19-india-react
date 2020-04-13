import {
  calculateActiveCase,
  calculateRecoveryRate,
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
    key: 'recoveryRate',
    title: 'Recovery Rate',
    dataModifier: (data) => (data.recoveryRate = calculateRecoveryRate(data)),
  },
  {
    key: 'mortalityRate',
    title: 'Death Rate',
    dataModifier: (data) => (data.mortalityRate = calculateMortalityRate(data)),
  },
];
