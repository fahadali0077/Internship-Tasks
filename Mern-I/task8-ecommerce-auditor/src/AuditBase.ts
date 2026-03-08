// abstract base class for auditors
// all auditors must extend this class

import { AuditResult, AuditLogEntry, Product } from './types.js'

export abstract class AuditBase {
  protected logs: AuditLogEntry[] = []
  private _auditCount = 0  // private - use getter to access

  get auditCount(): number {
    return this._auditCount
  }

  // abstract methods - subclasses must implement these
  abstract runAudit(products: Product[]): AuditResult
  abstract log(message: string): void

  // shared methods available to all subclasses
  protected incrementAuditCount(): void {
    this._auditCount++
  }

  protected buildLogEntry(message: string): AuditLogEntry {
    return {
      time: new Date().toLocaleTimeString(),
      message,
    }
  }

  getLogs(): ReadonlyArray<AuditLogEntry> {
    return this.logs
  }

  clearLogs(): void {
    this.logs = []
  }
}
