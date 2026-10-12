export const display = (value) => value === null || value === undefined || (typeof value === 'number' && Number.isNaN(value)) || typeof value === 'object' ? 'Not available' : String(value);
