// GenericTable.ts — Generic table renderer: GenericTable<T>
// Works with any typed data array and a column definition

import { ColumnDef } from './types.js';

export class GenericTable<T extends object> {
  private columns: ColumnDef<T>[];
  private data:    T[];

  constructor(columns: ColumnDef<T>[], data: T[] = []) {
    this.columns = columns;
    this.data    = data;
  }

  /** Update the data and re-render */
  update(data: T[]): void {
    this.data = data;
  }

  /** Render and return a typed HTMLTableElement */
  render(): HTMLTableElement {
    const table = document.createElement('table');
    table.className = 'generic-table';

    // ── Header row ──────────────────────────────────────────────────────────
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    this.columns.forEach((col) => {
      const th = document.createElement('th');
      th.textContent = col.label;
      if (col.cssClass) th.className = col.cssClass;
      headerRow.appendChild(th);
    });

    // ── Body rows ───────────────────────────────────────────────────────────
    const tbody = table.createTBody();
    this.data.forEach((row) => {
      const tr = tbody.insertRow();
      this.columns.forEach((col) => {
        const td = tr.insertCell();
        const rawVal = row[col.key];
        td.textContent = col.format
          ? col.format(rawVal, row)
          : String(rawVal ?? '');
        if (col.cssClass) td.className = col.cssClass;
      });
    });

    return table;
  }

  /** Mount the table into a container element, replacing existing content */
  mountTo(container: HTMLElement): void {
    container.innerHTML = '';
    container.appendChild(this.render());
  }
}
