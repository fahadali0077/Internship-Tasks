// AuditBase.ts — Abstract base class that all auditors must extend

import { AuditResult, AuditLogEntry, Product } from './types.js';

export abstract class AuditBase {
  // Protected state shared by all subclasses
  protected logs: AuditLogEntry[] = [];
  private   _auditCount            = 0; // private: only accessible via getter

  // ── Public getters ──────────────────────────────────────────────────────────

  get auditCount(): number {
    return this._auditCount;
  }

  // ── Abstract methods ────────────────────────────────────────────────────────
  // Every subclass MUST implement these

  /** Run a full audit of the current product inventory */
  abstract runAudit(products: Product[]): AuditResult;

  /** Log a message — subclass decides where it goes (DOM, console, etc.) */
  abstract log(message: string): void;

  // ── Concrete shared methods ─────────────────────────────────────────────────
  // Available to all subclasses for free

  protected incrementAuditCount(): void {
    this._auditCount++;
  }

  protected buildLogEntry(message: string): AuditLogEntry {
    return {
      time:    new Date().toLocaleTimeString(),
      message,
    };
  }

  getLogs(): ReadonlyArray<AuditLogEntry> {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}
