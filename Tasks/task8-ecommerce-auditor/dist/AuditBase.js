// AuditBase.ts — Abstract base class that all auditors must extend
export class AuditBase {
    constructor() {
        // Protected state shared by all subclasses
        this.logs = [];
        this._auditCount = 0; // private: only accessible via getter
    }
    // ── Public getters ──────────────────────────────────────────────────────────
    get auditCount() {
        return this._auditCount;
    }
    // ── Concrete shared methods ─────────────────────────────────────────────────
    // Available to all subclasses for free
    incrementAuditCount() {
        this._auditCount++;
    }
    buildLogEntry(message) {
        return {
            time: new Date().toLocaleTimeString(),
            message,
        };
    }
    getLogs() {
        return this.logs;
    }
    clearLogs() {
        this.logs = [];
    }
}
