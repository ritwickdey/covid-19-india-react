import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { interpolateReds } from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';
import { min, max } from 'd3-array';
import classes from './statsMap.module.scss';
import { useRefWidthHeight } from '../../hooks/useRefWidthHeight';
import {
  formatNumber,
  calculateActiveCase,
  calculateMortalityRate,
} from '../../utils';
import { useLocalStorage } from '../../hooks/useLocalstorage';

let GEO_INDIA_JSON_CACHE;
let GEO_INDIA_JSON_PATH = '/india.json';

const initalTooltipState = {
  show: false,
  x: 0,
  y: 0,
  title: '',
  value: '',
  selectedId: '',
};

const StatsMap = React.memo((props) => {
  const { data, autoScale } = props;

  const [{ width: _autoWidth }, refUpdater] = useRefWidthHeight();
  const [tooltip, setTooltip] = useState(initalTooltipState);
  const countryMapRef = useRef();

  const autoWidth = Math.min(_autoWidth, 500);
  const autoHeight = autoWidth * 1.1;

  const handleMouseOver = useCallback((event, stateName, data) => {
    const { x, y } = calculateSVGXY(
      event.pageX,
      event.pageY,
      event.target.getScreenCTM()
    );

    const tooltip = {
      show: true,
      x: x - window.scrollX,
      y: y - window.scrollY,
      title: stateName,
      data,
      selectedId: stateName,
    };
    setTooltip(tooltip);
  }, []);

  const handleMouseOut = useCallback((event) => {
    setTooltip((v) => {
      return { ...v, selectedId: null, show: false };
    });
  }, []);

  return (
    <div className={classes.container}>
      <div
        ref={(ref) => refUpdater(ref)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minWidth: '100%',
          minHeight: autoScale ? autoHeight : '300px',
        }}
      >
        <div
          style={{
            height: autoScale ? autoHeight : props.height,
            width: autoScale ? autoWidth : props.width,
            position: 'relative',
          }}
        >
          <div
            className={classes.tooltip}
            style={{
              opacity: tooltip.show ? 1 : 0,
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            <Tooltip data={tooltip.data} />
          </div>
          <IndiaMap
            svgRef={countryMapRef}
            selectedId={tooltip.selectedId}
            handleMouseOver={handleMouseOver}
            handleMouseOut={handleMouseOut}
            data={data}
            height={autoScale ? autoHeight : props.height}
            width={autoScale ? autoWidth : props.width}
          />
        </div>
      </div>
    </div>
  );
});

export default StatsMap;

const valueKey = 'confirmed';
const IndiaMap = React.memo(function IndiaMap(props) {
  const {
    width,
    height,
    data,
    handleMouseOver,
    handleMouseOut,
    selectedId,
  } = props;

  const [indiaGeoJson, setIndiaGeoJson] = useLocalStorage('india-geo', null);

  useEffect(() => {
    if (GEO_INDIA_JSON_CACHE) {
      setIndiaGeoJson(GEO_INDIA_JSON_CACHE);
      return;
    }

    fetch(GEO_INDIA_JSON_PATH)
      .then((res) => res.json())
      .then((indiaGeoJson) => {
        setIndiaGeoJson(indiaGeoJson);
        GEO_INDIA_JSON_CACHE = indiaGeoJson;
      });
  }, []);

  const color = useMemo(() => {
    const color = scaleSequential(interpolateReds);

    if (!data) {
      return color;
    }

    console.log(0);
    console.log(max(data, (d) => d[valueKey]));

    color.domain([0, max(data, (d) => d[valueKey])]);

    return color;
  }, [data]);

  const dataMap = useMemo(() => {
    const dataMap = {};
    if (!data) return dataMap;

    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      dataMap[d.stateName] = d;
    }
    return dataMap;
  }, [data]);

  const path = useMemo(() => {
    const projection = geoMercator();

    projection.fitSize([width, height], indiaGeoJson);

    return geoPath().projection(projection);
  }, [width, height, indiaGeoJson]);

  function getColor(d, isSelected) {
    if (isSelected) {
      return 'rgba(38,50,56,1)';
    }

    if (d) {
      return color(d[valueKey]);
    }
    return 'rgba(255,255,255,0.25)';
  }

  return (
    <svg
      ref={props.svgRef}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
    >
      {indiaGeoJson?.features?.map((feature, i) => {
        const d = dataMap[feature.properties.name];
        return (
          <path
            onMouseOver={(e) => handleMouseOver(e, feature.properties.name, d)}
            onMouseOut={handleMouseOut}
            key={`path-${i}`}
            d={path(feature)}
            stroke={
              selectedId === feature.properties.name
                ? getColor(d, true)
                : 'rgba(38,50,56,0.5)'
            }
            strokeWidth={selectedId === feature.properties.name ? 2 : 0.8}
            style={{ fill: getColor(d) }}
          />
        );
      })}
    </svg>
  );
});

const Tooltip = (props) => {
  if (!props.data) {
    return null;
  }

  const {
    confirmed,
    death,
    recovered,
    stateName,
    lastDayStat = {},
  } = props.data;

  const inc = {
    confirmed: confirmed - lastDayStat.confirmed || 0,
    death: death - lastDayStat.death || 0,
    recovered: recovered - lastDayStat.recovered || 0,
    active:
      calculateActiveCase(props.data) - calculateActiveCase(lastDayStat) || 0,
  };

  return (
    <div className={classes.tooltipDataContainer}>
      <div className={classes.stateName}>{stateName}</div>
      <div className={classes.dataContainer}>
        <div className={classes.data}>
          <span className={classes.key}>Confirmed</span>
          <span>:</span>
          <span className={classes.value}>{confirmed ?? 0}</span>
          {!!inc.confirmed && (
            <span
              className={`${classes.valueInc} ${
                inc.confirmed > 0
                  ? classes.diffDataPositive
                  : classes.diffDataNegetive
              }`}
            >
              {inc.confirmed > 0 && '+'}
              {inc.confirmed}
            </span>
          )}
        </div>

        <div className={classes.data}>
          <span className={classes.key}>Active</span>
          <span>:</span>
          <span className={classes.value}>
            {calculateActiveCase(props.data) ?? 0}
          </span>
          {!!inc.active && (
            <span
              className={`${classes.valueInc} ${
                inc.active > 0
                  ? classes.diffDataPositive
                  : classes.diffDataNegetive
              }`}
            >
              {inc.active > 0 && '+'}
              {inc.active}
            </span>
          )}
        </div>

        <div className={classes.data}>
          <span className={classes.key}>Recovered</span>
          <span>:</span>
          <span className={classes.value}>{recovered ?? 0}</span>

          {!!inc.recovered && (
            <span
              className={`${classes.valueInc} ${
                inc.death < 0
                  ? classes.diffDataPositive
                  : classes.diffDataNegetive
              }`}
            >
              {inc.recovered > 0 && '+'}
              {inc.recovered}
            </span>
          )}
        </div>

        <div className={classes.data}>
          <span className={classes.key}>Death</span>
          <span>:</span>
          <span className={classes.value}>{death ?? 0}</span>
          {!!inc.death && (
            <span
              className={`${classes.valueInc} ${
                inc.death > 0
                  ? classes.diffDataPositive
                  : classes.diffDataNegetive
              }`}
            >
              {inc.death > 0 && '+'}
              {inc.death}
            </span>
          )}
        </div>
      </div>
      <div className={classes.footer}>
        <span>
          Mortality Rate is{' '}
          {formatNumber(calculateMortalityRate(props.data) ?? 0, 2)}%
        </span>
      </div>
    </div>
  );
};

function calculateSVGXY(clientX, clientY, CTM) {
  //(ax+e, dy+f) = (mouseX,mouseY)
  return {
    x: (clientX - CTM.e) / CTM.a,
    y: (clientY - CTM.f) / CTM.d,
  };
}
