import { useState, useEffect } from 'react';

function NumberRace(props) {
  const [value, setValue] = useState(props.children);

  useEffect(() => {
    if (value === props.children) {
      return;
    }
    if (isNaN(props.children)) {
      return setValue(props.children);
    }

    const isFloatType = !Number.isInteger(props.children);

    let change = (props.children - value) / 10;

    if (change && !isFloatType) {
      change = Math.ceil(change);
    }

    const nearlyLastHop =
      Math.abs(change * 5 + value) >= Math.abs(props.children);

    const t = setTimeout(
      () => {
        if (change === 0 && !isFloatType) {
          setValue(props.children);
          return;
        }
        setValue(change + value);
      },
      nearlyLastHop ? 100 : 30
    );

    return () => {
      clearTimeout(t);
    };
  }, [value, props.children]);

  return props.format ? props.format(value) : value;
}

export default NumberRace;
