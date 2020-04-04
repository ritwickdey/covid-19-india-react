import { useState, useEffect } from "react";

function NumberRace(props) {
  const [value, setValue] = useState(props.children);

  useEffect(() => {
    if (value === props.children) return;
    if (isNaN(props.children)) {
      return setValue(props.children);
    }

    const isFloatType = !Number.isInteger(props.children);

    let change = (props.children - value) / 10;

    if (change && !isFloatType) {
      change = Math.ceil(change);
    }

    const nearlyLastHop = change * 5 + value >= props.children;

    const t = setTimeout(
      () => {
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