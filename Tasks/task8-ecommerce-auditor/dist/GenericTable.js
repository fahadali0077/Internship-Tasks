// GenericTable.ts — Generic table renderer: GenericTable<T>
// Works with any typed data array and a column definition
export class GenericTable {
    constructor(columns, data = []) {
        this.columns = columns;
        this.data = data;
    }
    /** Update the data and re-render */
    update(data) {
        this.data = data;
    }
    /** Render and return a typed HTMLTableElement */
    render() {
        const table = document.createElement('table');
        table.className = 'generic-table';
        // ── Header row ──────────────────────────────────────────────────────────
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        this.columns.forEach((col) => {
            const th = document.createElement('th');
            th.textContent = col.label;
            if (col.cssClass)
                th.className = col.cssClass;
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
                if (col.cssClass)
                    td.className = col.cssClass;
            });
        });
        return table;
    }
    /** Mount the table into a container element, replacing existing content */
    mountTo(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}
