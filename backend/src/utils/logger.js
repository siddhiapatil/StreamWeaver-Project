/**
 * ---------------------------------------------------------
 * Logger Utility
 * ---------------------------------------------------------
 * Provides structured logging for pipeline execution
 */

import fs from 'node:fs';
import path from 'node:path';

export class Logger {
    constructor(logDir = 'logs') {
        this.logDir = logDir;
        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    getLogPath(filename) {
        return path.join(this.logDir, filename);
    }

    formatLog(level, message, data = {}) {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            level,
            message,
            ...data
        });
    }

    log(level, message, data = {}) {
        const logEntry = this.formatLog(level, message, data);
        console.log(logEntry);
    }

    info(message, data = {}) {
        this.log('INFO', message, data);
    }

    error(message, data = {}) {
        this.log('ERROR', message, data);
    }

    warn(message, data = {}) {
        this.log('WARN', message, data);
    }

    debug(message, data = {}) {
        this.log('DEBUG', message, data);
    }

    logPipelineRun(runId, status, data = {}) {
        const logPath = this.getLogPath('pipeline-runs.log');
        const entry = this.formatLog('PIPELINE_RUN', `Run ${runId}: ${status}`, {
            runId,
            status,
            ...data
        });

        try {
            fs.appendFileSync(logPath, entry + '\n');
        } catch (error) {
            console.error('Failed to write pipeline log:', error);
        }
    }

    logPipelineStep(runId, step, duration, data = {}) {
        const logPath = this.getLogPath('pipeline-runs.log');
        const entry = this.formatLog('PIPELINE_STEP', `Run ${runId}: Step ${step}`, {
            runId,
            step,
            duration,
            ...data
        });

        try {
            fs.appendFileSync(logPath, entry + '\n');
        } catch (error) {
            console.error('Failed to write pipeline step log:', error);
        }
    }
}

export function createLogger(options = {}) {
    return new Logger(options.logDir || 'logs');
}
