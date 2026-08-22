/**
 * ---------------------------------------------------------
 * Transform Module
 * ---------------------------------------------------------
 * Supports multiple transformation modes:
 * 1. Schema Mapping & Text Normalization (e.g., uppercase)
 * 2. Row Filtering (e.g., filter by field condition)
 */

const { Transform } = require("stream");

/**
 * Transforms CSV stream rows into JSON objects with customizable transformations.
 */
class CSVToJSONTransform extends Transform {
    /**
     * @param {Object} options - Transform options
     * @param {Object} options.transformRules - Rules like { uppercaseFields: ["firstName"], filter: { field: "age", min: 21 } }
     */
    constructor(options = {}) {
        super({
            ...options,
            readableObjectMode: true
        });

        this.headers = null;
        this.buffer = "";
        this.transformRules = options.transformRules || {};
    }

    /**
     * Maps raw CSV array values to a key-value object and applies text transforms.
     */
    createRow(values) {
        const row = {};
        const uppercaseFields = this.transformRules.uppercaseFields || ["firstName"];

        this.headers.forEach((header, index) => {
            let value = values[index] !== undefined ? values[index].trim() : "";

            // Transformation Type 1: Text Capitalization
            if (uppercaseFields.includes(header)) {
                value = value.toUpperCase();
            }

            row[header] = value;
        });

        return row;
    }

    /**
     * Transformation Type 2: Row Filtering
     * Checks if a row meets filter criteria.
     * 
     * @param {Object} row - Parsed JSON row
     * @returns {boolean} True if row should be included
     */
    matchesFilter(row) {
        const filter = this.transformRules.filter;
        if (!filter || !filter.field) {
            return true; // No filter specified, keep all rows
        }

        const value = row[filter.field];
        if (value === undefined) {
            return true;
        }

        // Numerical minimum check
        if (filter.min !== undefined && Number(value) < Number(filter.min)) {
            return false;
        }

        // Exact match check
        if (filter.equals !== undefined && value.toLowerCase() !== String(filter.equals).toLowerCase()) {
            return false;
        }

        return true;
    }

    _transform(chunk, encoding, callback) {
        try {
            this.buffer += chunk.toString();
            const lines = this.buffer.split("\n");

            // Store the last incomplete line fragment in the buffer
            this.buffer = lines.pop();

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) continue;

                // Header extraction
                if (!this.headers) {
                    this.headers = trimmedLine.split(",").map(h => h.trim());
                    continue;
                }

                const values = trimmedLine.split(",");
                const row = this.createRow(values);

                // Apply filter criteria
                if (this.matchesFilter(row)) {
                    this.push(row);
                }
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
                const row = this.createRow(values);
                if (this.matchesFilter(row)) {
                    this.push(row);
                }
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