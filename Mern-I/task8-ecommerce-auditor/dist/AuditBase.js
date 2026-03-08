// abstract base class for auditors
// all auditors must extend this class
export class AuditBase {
    constructor() {
        this.logs = [];
        this._auditCount = 0; // private - use getter to access
    }
    get auditCount() {
        return this._auditCount;
    }
    // shared methods available to all subclasses
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
