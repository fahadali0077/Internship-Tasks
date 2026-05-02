// main.ts - dom entry point, connects everything together
import { ProductManager } from './ProductManager.js';
import { GenericTable } from './GenericTable.js';
import { initialProducts } from './data.js';
import { Category } from './types.js';
import { debounce, throttle, isLowStock, isOutOfStock, getRevenue, formatCurrency, validateProduct } from './utils.js';
const manager = new ProductManager();
// GenericTable<Product> for top sellers table
const topSellerColumns = [
    { label: 'Product', key: 'name' },
    { label: 'Category', key: 'category' },
    { label: 'Sales', key: 'sales', format: (v) => Number(v).toLocaleString() },
    { label: 'Revenue', key: 'price', format: (_, row) => formatCurrency(getRevenue(row)) },
    { label: 'Stock', key: 'stock', format: (v, row) => isOutOfStock(row) ? 'out'
            : isLowStock(row) ? `low: ${v}`
                : String(v) },
];
const topSellersTable = new GenericTable(topSellerColumns);
// dom refs
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const exportBtn = document.getElementById('exportBtn');
const auditBtn = document.getElementById('auditBtn');
const addProductBtn = document.getElementById('addProductBtn');
const clearFormBtn = document.getElementById('clearFormBtn');
const productGrid = document.getElementById('productGrid');
const topSellersMount = document.getElementById('topSellersMount');
const alertsSection = document.getElementById('alertsSection');
const auditLogEl = document.getElementById('auditLog');
const gridStatus = document.getElementById('gridStatus');
const fName = document.getElementById('fName');
const fPrice = document.getElementById('fPrice');
const fStock = document.getElementById('fStock');
const fCategory = document.getElementById('fCategory');
const fSales = document.getElementById('fSales');
const fNameErr = document.getElementById('fNameErr');
const fPriceErr = document.getElementById('fPriceErr');
function renderStats() {
    const stats = manager.getStats();
    document.getElementById('statTotal').textContent = String(stats.totalProducts);
    document.getElementById('statValue').textContent = formatCurrency(stats.totalValue);
    document.getElementById('statLowStock').textContent = String(stats.lowStockCount);
    document.getElementById('statTopSeller').textContent = stats.topSeller?.name ?? '-';
    document.getElementById('statAuditCount').textContent = String(manager.auditCount);
}
function renderGrid(items) {
    productGrid.innerHTML = '';
    gridStatus.textContent = `showing ${items.length} of ${manager.getAll().length} products`;
    if (items.length === 0) {
        productGrid.innerHTML = '<div style="color:#888;padding:20px">no products found</div>';
        return;
    }
    items.forEach((p) => {
        const card = document.createElement('div');
        card.dataset.id = String(p.id);
        let cls = 'product-card';
        if (isOutOfStock(p))
            cls += ' out-of-stock';
        else if (isLowStock(p))
            cls += ' low-stock';
        card.className = cls;
        const stockLabel = isOutOfStock(p)
            ? 'out of stock'
            : isLowStock(p) ? `low: ${p.stock} left`
                : `in stock: ${p.stock}`;
        card.innerHTML = `
      <div class="category">${p.category} | ${p.sku}</div>
      <h3>${p.name}</h3>
      <div class="price">${formatCurrency(p.price)}</div>
      <div class="stock">${stockLabel}</div>
      <div class="sales">sold: ${p.sales}</div>
      ${isLowStock(p) ? '<span class="badge badge-low">LOW STOCK</span>' : ''}
      ${p.sales > 200 ? '<span class="badge badge-sale">TOP SELLER</span>' : ''}
      <div class="card-actions">
        <button class="btn-info" data-action="edit">Edit</button>
        <button class="btn-primary" data-action="delete">Delete</button>
      </div>`;
        productGrid.appendChild(card);
    });
}
function renderTopSellers() {
    topSellersTable.update(manager.getTopSellers(5));
    topSellersTable.mountTo(topSellersMount);
}
function flushLogs() {
    const logs = manager.getLogs();
    if (logs.length === 0)
        return;
    auditLogEl.innerHTML = '';
    [...logs].reverse().forEach((entry) => {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `<span class="time">${entry.time}</span>${entry.message}`;
        auditLogEl.appendChild(div);
    });
}
function renderAll() {
    const query = searchInput.value;
    const catVal = categoryFilter.value || undefined;
    const category = catVal;
    const sort = sortFilter.value;
    let items = manager.search(query, category);
    if (sort === 'price-asc')
        items = [...items].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc')
        items = [...items].sort((a, b) => b.price - a.price);
    else if (sort === 'stock')
        items = [...items].sort((a, b) => a.stock - b.stock);
    else if (sort === 'sales')
        items = [...items].sort((a, b) => b.sales - a.sales);
    else
        items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    renderGrid(items);
    renderTopSellers();
    renderStats();
    flushLogs();
}
// event delegation on product grid
productGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn)
        return;
    const card = btn.closest('.product-card');
    if (!card)
        return;
    const id = Number(card.dataset.id);
    const action = btn.dataset.action;
    if (action === 'delete') {
        manager.remove(id);
        renderAll();
    }
    if (action === 'edit') {
        const product = manager.getAll().find((p) => p.id === id);
        if (!product)
            return;
        fName.value = product.name;
        fPrice.value = String(product.price);
        fStock.value = String(product.stock);
        fCategory.value = product.category;
        fSales.value = String(product.sales);
        manager.log('editing: ' + product.name);
        manager.remove(id);
        flushLogs();
    }
});
addProductBtn.addEventListener('click', () => {
    fNameErr.textContent = '';
    fPriceErr.textContent = '';
    const payload = {
        name: fName.value.trim(),
        price: parseFloat(fPrice.value),
        stock: parseInt(fStock.value) || 0,
        category: fCategory.value,
        sales: parseInt(fSales.value) || 0,
    };
    const error = validateProduct(payload);
    if (error) {
        if (error.includes('name'))
            fNameErr.textContent = error;
        else
            fPriceErr.textContent = error;
        return;
    }
    manager.add(payload);
    clearForm();
    renderAll();
});
clearFormBtn.addEventListener('click', clearForm);
function clearForm() {
    fName.value = fPrice.value = fStock.value = fSales.value = '';
    fCategory.value = Category.Electronics;
    fNameErr.textContent = '';
    fPriceErr.textContent = '';
}
// debounced search
const handleSearch = debounce(() => renderAll(), 400);
searchInput.addEventListener('input', handleSearch);
categoryFilter.addEventListener('change', () => renderAll());
sortFilter.addEventListener('change', () => renderAll());
// audit
auditBtn.addEventListener('click', () => {
    const result = manager.runAudit(manager.getAll());
    renderStats();
    if (result.issues.length === 0) {
        alertsSection.innerHTML = '<div class="status">all good! no issues found</div>';
    }
    else {
        alertsSection.innerHTML = result.issues.map((i) => `<div class="alert">${i}</div>`).join('');
    }
    flushLogs();
});
exportBtn.addEventListener('click', () => {
    const json = manager.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.json';
    a.click();
    URL.revokeObjectURL(url);
    manager.log('exported to json');
    flushLogs();
});
// throttled scroll
const handleScroll = throttle(() => {
    const nearBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 100;
    if (nearBottom)
        manager.log('near bottom (throttled scroll)');
}, 1000);
window.addEventListener('scroll', handleScroll);
(async () => {
    await manager.fetchAndLoad(initialProducts);
    renderAll();
})();
