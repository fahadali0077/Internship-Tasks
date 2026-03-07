// main.ts — DOM entry point: wires ProductManager, GenericTable, and all UI logic
import { ProductManager } from './ProductManager.js';
import { GenericTable } from './GenericTable.js';
import { initialProducts } from './data.js';
import { Category } from './types.js';
import { debounce, throttle, isLowStock, isOutOfStock, getRevenue, formatCurrency, validateProduct, } from './utils.js';
// ─── State ────────────────────────────────────────────────────────────────────
const manager = new ProductManager();
// ─── Generic top-sellers table ────────────────────────────────────────────────
// Demonstrates GenericTable<Product> — a typed table for any Product[]
const topSellerColumns = [
    { label: '#', key: 'id', format: (_, row) => String(manager.getAll().findIndex(p => p.id === row.id) + 1) },
    { label: 'Product', key: 'name' },
    { label: 'Category', key: 'category' },
    { label: 'Sales', key: 'sales', format: (v) => Number(v).toLocaleString() },
    { label: 'Revenue', key: 'price', format: (_, row) => formatCurrency(getRevenue(row)) },
    { label: 'Stock', key: 'stock', format: (v, row) => isOutOfStock(row) ? '❌ 0'
            : isLowStock(row) ? `⚠️ ${v}`
                : `✅ ${v}` },
];
const topSellersTable = new GenericTable(topSellerColumns);
// ─── DOM refs ─────────────────────────────────────────────────────────────────
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
// ─── Render helpers ───────────────────────────────────────────────────────────
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
    gridStatus.textContent = `Showing ${items.length} of ${manager.getAll().length} products`;
    if (items.length === 0) {
        productGrid.innerHTML = '<div class="no-results">No products found.</div>';
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
            ? '❌ Out of stock'
            : isLowStock(p)
                ? `⚠️ Low: ${p.stock} left`
                : `✅ In stock: ${p.stock}`;
        card.innerHTML = `
      <div class="category">${p.category} · SKU: ${p.sku}</div>
      <h3>${p.name}</h3>
      <div class="price">${formatCurrency(p.price)}</div>
      <div class="stock">${stockLabel}</div>
      <div class="sales">📦 Sold: ${p.sales.toLocaleString()}</div>
      ${isLowStock(p) ? '<span class="badge badge-low">LOW STOCK</span>' : ''}
      ${p.sales > 200 ? '<span class="badge badge-sale">TOP SELLER</span>' : ''}
      <div class="card-actions">
        <button class="btn-info"    data-action="edit">✏️ Edit</button>
        <button class="btn-primary" data-action="delete">🗑️ Del</button>
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
    // Only add new entries (track by length)
    auditLogEl.innerHTML = '';
    [...logs].reverse().forEach((entry) => {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `<span class="time">${entry.time}</span>${entry.message}`;
        auditLogEl.appendChild(div);
    });
}
function renderAll(filter) {
    const query = filter?.query ?? searchInput.value;
    const catVal = filter?.category ?? (categoryFilter.value || undefined);
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
// ─── Event delegation on product grid ─────────────────────────────────────────
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
        manager.log(`Editing: ${product.name}`);
        manager.remove(id);
        flushLogs();
    }
});
// ─── Add product ──────────────────────────────────────────────────────────────
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
        if (error.includes('Name'))
            fNameErr.textContent = error;
        if (error.includes('Price'))
            fPriceErr.textContent = error;
        if (error.includes('Stock'))
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
// ─── Debounced search ─────────────────────────────────────────────────────────
const handleSearch = debounce(() => renderAll(), 400);
searchInput.addEventListener('input', handleSearch);
categoryFilter.addEventListener('change', () => renderAll());
sortFilter.addEventListener('change', () => renderAll());
// ─── Audit ────────────────────────────────────────────────────────────────────
auditBtn.addEventListener('click', () => {
    const result = manager.runAudit(manager.getAll());
    renderStats();
    if (result.issues.length === 0) {
        alertsSection.innerHTML = '<div class="status">✅ All good! No issues found.</div>';
    }
    else {
        alertsSection.innerHTML = result.issues
            .map((issue) => `<div class="alert">${issue}</div>`)
            .join('');
    }
    flushLogs();
});
// ─── Export JSON ──────────────────────────────────────────────────────────────
exportBtn.addEventListener('click', () => {
    const json = manager.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-export.json';
    a.click();
    URL.revokeObjectURL(url);
    manager.log('Exported inventory to JSON');
    flushLogs();
});
// ─── Throttled scroll ─────────────────────────────────────────────────────────
const handleScroll = throttle(() => {
    const nearBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 100;
    if (nearBottom)
        manager.log('Near page bottom (throttled scroll handler)');
}, 1000);
window.addEventListener('scroll', handleScroll);
// ─── Init (simulated async fetch) ────────────────────────────────────────────
(async () => {
    await manager.fetchAndLoad(initialProducts);
    renderAll();
})();
