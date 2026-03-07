// types.ts — Shared interfaces, enums, and utility types for the Inventory Auditor
// ─── Enums ───────────────────────────────────────────────────────────────────
export var Category;
(function (Category) {
    Category["Electronics"] = "Electronics";
    Category["Books"] = "Books";
    Category["Clothing"] = "Clothing";
    Category["Food"] = "Food";
})(Category || (Category = {}));
export var StockStatus;
(function (StockStatus) {
    StockStatus["InStock"] = "in-stock";
    StockStatus["LowStock"] = "low-stock";
    StockStatus["OutOfStock"] = "out-of-stock";
})(StockStatus || (StockStatus = {}));
