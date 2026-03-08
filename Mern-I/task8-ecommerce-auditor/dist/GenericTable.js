// GenericTable<T> - works with any typed data + column definitions
export class GenericTable {
    constructor(columns, data = []) {
        this.columns = columns;
        this.data = data;
    }
    update(data) {
        this.data = data;
    }
    render() {
        const table = document.createElement('table');
        table.className = 'generic-table';
        // header
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        this.columns.forEach((col) => {
            const th = document.createElement('th');
            th.textContent = col.label;
            headerRow.appendChild(th);
        });
        // body rows
        const tbody = table.createTBody();
        this.data.forEach((row) => {
            const tr = tbody.insertRow();
            this.columns.forEach((col) => {
                const td = tr.insertCell();
                const rawVal = row[col.key];
                td.textContent = col.format ? col.format(rawVal, row) : String(rawVal ?? '');
            });
        });
        return table;
    }
    // mount into a container element
    mountTo(container) {
        container.innerHTML = '';
        container.appendChild(this.render());
    }
}
