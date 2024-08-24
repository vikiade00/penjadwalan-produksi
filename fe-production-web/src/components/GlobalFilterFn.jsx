export function globalFilterFn(rows, columnIds, filterValue) {
  return rows.filter((row) => {
    const rowValues = columnIds
      .map((columnId) => row.original[columnId])
      .join(" ")
      .toLowerCase();
    return rowValues.includes(filterValue.toLowerCase());
  });
}
