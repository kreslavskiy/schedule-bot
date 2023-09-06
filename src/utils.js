'use strict';
const { PAIRS, BREAKS, LATIN_TO_CYRILLIC } = require('./collections.js');

// Get time left to the end of the current pair or break
const getLeftTime = () => {
  const now = new Date();

  const pairsAndBreaks = [...PAIRS, ...BREAKS];

  // If it's a pair or a break
  for (let i = 0; i < pairsAndBreaks.length; i++) {
    const [start, end] = pairsAndBreaks[i];

    // Set start and end time
    const startTime = new Date();
    startTime.setHours(start.split('.')[0]);
    startTime.setMinutes(start.split('.')[1]);
    startTime.setSeconds(0);

    const endTime = new Date();
    endTime.setHours(end.split('.')[0]);
    endTime.setMinutes(end.split('.')[1]);
    endTime.setSeconds(0);

    // Return time left to the end of the pair or break
    if (now >= startTime && now < endTime) {
      return endTime - now;
    }
  }
}

const getCurrent = () => {
  const now = new Date();

  const setCurrent = (timeArray, type) => {
    for (const [start, end] of timeArray) {
      const startTime = new Date();
      startTime.setHours(start.split('.')[0]);
      startTime.setMinutes(start.split('.')[1]);
      startTime.setSeconds(0);

      const endTime = new Date();
      endTime.setHours(end.split('.')[0]);
      endTime.setMinutes(end.split('.')[1]);
      endTime.setSeconds(0);

      if (now >= startTime && now < endTime) {
        current[type] = 1;
        break;
      }
    }
  };

  const current = {
    pair: 0,
    break: 0,
  };

  setCurrent(PAIRS, 'pair');
  setCurrent(BREAKS, 'break');

  return current;
};


// Parse time in milliseconds to human-readable format
const parseTime = (time) => {
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((time / (1000 * 60)) % 60);
  const secs = Math.floor((time / 1000) % 60);

  // Return time in format "1 год 2 хв 3 с" or "2 хв 3 с"
  return hours
    ? `${hours} год ${mins} хв ${secs < 10 ? '0' + secs : secs} с`
    : `${mins} хв ${secs < 10 ? '0' + secs : secs} с`;
};

const sortPairs = (pairsList) => {
  if (pairsList) return pairsList.pairs.sort((firstPair, secondPair) => firstPair.time - secondPair.time);
}

const validateGroupName = (groupName) => {
  const normalized = groupName.replace(/[._-\s]/g, '');

  let validated = normalized
    .slice(0, 2)
    .toUpperCase()
    .concat('-' + normalized.slice(2));

  for (const [latin, cyrillic] of Object.entries(LATIN_TO_CYRILLIC)) {
    if (validated.includes(latin)) {
      validated = validated.replaceAll(latin, cyrillic);
    }
  }

  return validated;
};

module.exports = {
  getLeftTime,
  getCurrent,
  sortPairs,
  parseTime,
  validateGroupName,
};
