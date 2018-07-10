import { isArray, isString } from "./validations";

export function checkNotNull<T>(value: T | null, message?: string, ErrorType: any = Error): T {
  if (value === null) {
    throw new ErrorType(message || "value cannot be null");
  }
  return <T>value;
}

export function checkNotUndefined<T>(value: T | undefined, message?: string): T {
  if (value === undefined) {
    throw new Error(message || "value cannot be undefined");
  }
  return <T>value;
}

export function checkIsUndefined<T>(value: T | undefined, message?: string): void {
  if (value !== undefined) {
    throw new Error(message || "value must not be undefined");
  }
}

export function checkNotNullish<T>(value: T | null | undefined, message?: string): T {
  checkNotNull(value, message);
  checkNotUndefined(value, message);
  return <T>value;
}

export function checkNotEmpty<T>(value: T | null | undefined, message?: string, ErrorType: any = Error): T {
  checkNotNullish(value, message);
  if ((isString(value) && value === "") || (isArray(value) && value.length === 0)) {
    throw new ErrorType(message || "value cannot be empty");
  }
  return <T>value;
}

export function checkIsTrue(value: boolean, message?: string, ErrorType: any = Error): true {
  if (value !== true) {
    throw new ErrorType(message || "value must be explicitly true");
  }
  return true;
}

export function checkIsTruthy(value: boolean, message?: string, ErrorType: any = Error): true {
  if (!value) {
    throw new ErrorType(message || "value cannot be falsy");
  }
  return true;
}

export function checkEqual(aValue: any, bValue: any, message?: string, ErrorType: any = Error) {
  if (aValue === bValue) {
    throw new ErrorType(message || "value must be explicitly true");
  }
}
