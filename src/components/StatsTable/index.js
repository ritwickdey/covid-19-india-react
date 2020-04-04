import React from 'react';
import { useTable, useSortBy } from 'react-table';
import {
  calculateActiveCase,
  formatNumber,
  calculateMortalityRate,
} from '../../utils';

import classes from './stateTable.module.scss';

const columns = [
  {
    Header: 'State',
    accessor: 'stateName',
  },
  {
    Header: 'Confirmed',
    accessor: 'confirmed',
    sortType: 'basic',
    Cell: (props) => <TableDiffCell {...props} formator={formatNumber} />,
  },
  {
    Header: 'Active',
    id: 'active',
    sortType: 'basic',
    accessor: calculateActiveCase,
    Cell: (props) => <TableDiffCell {...props} formator={formatNumber} />,
  },
  {
    Header: 'Recovered',
    accessor: 'recovered',
    sortType: 'basic',
    Cell: (props) => (
      <TableDiffCell colorReverse {...props} formator={formatNumber} />
    ),
  },
  {
    Header: 'Death',
    accessor: 'death',
    sortType: 'basic',
    Cell: (props) => <TableDiffCell {...props} formator={formatNumber} />,
  },
  {
    Header: 'Mortality Rate',
    id: 'mortalityRate',
    sortType: 'basic',
    accessor: calculateMortalityRate,
    Cell: (props) => formatNumber(props.value, 2) + '%',
  },
];

function StatsTable(props) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: props.data || [{}],
      initialState: {
        sortBy: [
          {
            id: 'confirmed',
            desc: true,
          },
        ],
      },
    },
    useSortBy
  );

  return (
    <table className={classes.table} {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, i) => (
              <th
                className={i ? classes.rightAlign : classes.leftAlign}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {!!i && (
                  <span
                    className={classes.sorter}
                    dangerouslySetInnerHTML={{
                      __html: column.isSorted
                        ? column.isSortedDesc
                          ? '&#x2193;'
                          : '&#x2191;'
                        : ' ',
                    }}
                  />
                )}
                {column.render('Header')}

                {!i && (
                  <span
                    className={classes.sorter}
                    dangerouslySetInnerHTML={{
                      __html: column.isSorted
                        ? column.isSortedDesc
                          ? '&#x2193;'
                          : '&#x2191;'
                        : ' ',
                    }}
                  />
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, i) => {
                return (
                  <td
                    className={i ? classes.rightAlign : classes.leftAlign}
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TableDiffCell(props) {
  const rowData = props.row.original;
  const pastData = props.cell.column.accessor(rowData.lastDayStat);
  const gap = props.value - pastData;
  return (
    <span>
      {!!gap && (
        <span
          className={`${classes.diffData} ${
            gap > 0 && !props.colorReverse
              ? classes.diffDataPositive
              : classes.diffDataNegetive
          }`}
        >
          {gap > 0 && '+'}
          {props.value - pastData}
        </span>
      )}
      <span>{props.formator(props.value)}</span>
    </span>
  );
}

export default StatsTable;
