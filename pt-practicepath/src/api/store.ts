// Report persistence (FR-32 groundwork).
//
// The API keeps reports behind a small async store interface: in-memory for
// tests and ephemeral use, file-backed (one JSON per report under
// data/reports/) for deployments — mount /app/data as a volume and reports
// survive restarts. A database implements the same interface when scale
// demands it; handlers never change.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { PositionContext, Report } from '../engine/report.js';
import type { TherapistProfile } from '../engine/paths.js';

export interface StoredReport {
  id: string;
  jurisdiction: string;
  profile: TherapistProfile;
  position?: PositionContext;
  report: Report;
}

export interface ReportStore {
  get(id: string): Promise<StoredReport | undefined>;
  put(entry: StoredReport): Promise<void>;
}

export class MemoryReportStore implements ReportStore {
  private readonly reports = new Map<string, StoredReport>();
  async get(id: string): Promise<StoredReport | undefined> {
    return this.reports.get(id);
  }
  async put(entry: StoredReport): Promise<void> {
    this.reports.set(entry.id, entry);
  }
}

const ID_PATTERN = /^[0-9a-f-]{36}$/;

export class FileReportStore implements ReportStore {
  constructor(private readonly dir = 'data/reports') {}

  private fileFor(id: string): string {
    if (!ID_PATTERN.test(id)) throw new Error(`Invalid report id: ${id}`);
    return path.join(this.dir, `${id}.json`);
  }

  async get(id: string): Promise<StoredReport | undefined> {
    if (!ID_PATTERN.test(id)) return undefined;
    try {
      return JSON.parse(await readFile(this.fileFor(id), 'utf8')) as StoredReport;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
      throw err;
    }
  }

  async put(entry: StoredReport): Promise<void> {
    await mkdir(this.dir, { recursive: true });
    const file = this.fileFor(entry.id);
    const tmp = `${file}.tmp`;
    await writeFile(tmp, JSON.stringify(entry, null, 2));
    const { rename } = await import('node:fs/promises');
    await rename(tmp, file);
  }
}
