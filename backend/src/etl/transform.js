/**
 * ---------------------------------------------------------
 * Transform Module
 * ---------------------------------------------------------
 * Defines the transformation stage of the ETL pipeline.
 *
 * Responsibilities:
 * - Receive CSV data in chunks
 * - Process CSV rows using a Transform stream
 * - Convert CSV rows into JSON objects
 * - Apply basic data transformation
 */

const { Transform } = require("stream");

/**
 * Transform CSV rows into JSON objects.
 */
class CSVToJSONTransform extends Transform {
    constructor(options = {}) {
        super({
            ...options,
            readableObjectMode: true
        });

        this.headers = null;
        this.buffer = "";
    }

    /**
     * Convert CSV values into a JSON row.
     *
     * Basic transformation:
     * firstName is converted to uppercase.
     */
    createRow(values) {
        const row = {};

        this.headers.forEach((header, index) => {
            let value = values[index] || "";

            if (header === "firstName") {
                value = value.toUpperCase();
            }

            row[header] = value;
        });

        return row;
    }

    _transform(chunk, encoding, callback) {
        try {
            this.buffer += chunk.toString();

            const lines = this.buffer.split("\n");

            // Keep the last incomplete line for the next chunk
            this.buffer = lines.pop();

            for (const line of lines) {
                const trimmedLine = line.trim();

                if (!trimmedLine) {
                    continue;
                }

                // First line contains CSV headers
                if (!this.headers) {
                    this.headers = trimmedLine.split(",");
                    continue;
                }

                const values = trimmedLine.split(",");
                this.push(this.createRow(values));
            }

            callback();
        } catch (error) {
            callback(error);
        }
    }

    _flush(callback) {
        try {
            if (this.buffer.trim() && this.headers) {
                const values = this.buffer.trim().split(",");
                this.push(this.createRow(values));
            }

            callback();
        } catch (error) {
            callback(error);
        }
    }
}

module.exports = {
    CSVToJSONTransform
};