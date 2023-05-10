import { ValidationError } from "yup";

export class AuthenticationError extends Error {

  private _statusCode: number;
  private _validationError?: ValidationError;

  constructor(message: string, statusCode: number = 400, validationError?: ValidationError) {
    super(message);
    this._statusCode = statusCode;
    this._validationError = validationError;
  }

  public get statusCode() {
    return this._statusCode;
  }

  public get validationError() {
    return this._validationError;
  }
}