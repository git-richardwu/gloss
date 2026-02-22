export class AppError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.name = this.constructor.name
        this.statusCode = statusCode;
        this.details = details
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    constructor(message, details = null) {
        super(message, 400, details)
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource', details = null) {
        super(`${resource} not found`, 404, details)
    }
}

export class ExternalServiceError extends AppError {
    constructor(message = 'Open Library unavailable', details = null) {
        super(message, 502, details)
    }
}

export class DatabaseConnectionError extends AppError {
    constructor(message = 'Cannot connect to database', details = null) {
        super(message, 502, details)
    }
}

export class DuplicateError extends AppError {
    constructor(message = 'Duplicate entry in database', details = null) {
        super(message, 409, details)
    }
}