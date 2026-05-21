export class AppError extends Error {
  statusCode: number;
  message: string;

  constructor(message: string, statusCode: number) {
    super(message); // Call the parent Error constructor and set the message
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace for better debugging. how is work => It creates a stack trace for the error, excluding the constructor of the AppError class itself. This helps in identifying where the error was thrown in the code.
  }
}
