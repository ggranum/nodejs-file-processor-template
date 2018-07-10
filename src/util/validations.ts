export type Defined = string | number | boolean | symbol | object;
export type NotUndefined = string | number | boolean | symbol | object | null;
export type NotNull = string | number | boolean | symbol | object | undefined;


export function isNotNull(value: NotNull | null): value is NotNull {
  return value !== null;
}

export function isNotUndefined(value: NotUndefined | any | undefined): value is NotUndefined {
  return value !== undefined;
}

export function isNotNullish<T>(value: T | null | undefined): value is T {
  return isNotNull(value as any) && isNotUndefined(value as any);
}

export function isNullish<T>(value: T | null | undefined): value is null | undefined {
  return !isNotNullish(value);
}

export function isEmpty<T>(value: T): boolean {
  return !isNotEmpty(value);
}

export function isBoolean(value: any): value is boolean {
  return value === true || value === false;
}

export function isString(value: any): value is string {
  return (typeof value === "string" || value instanceof String);
}

export function isArray(value: any): value is any[] {
  return (value instanceof Array);
}

/**
 * Returns true if value is NOT [null, undefined, "", [] ].
 * Which is to say:
 *
 * isNotEmpty(0) returns true.
 * isNotEmpty(false) returns true.
 * isNotEmpty([]) returns false.
 * isNotEmpty("") returns false.
 *
 * @param {false | T} value
 */
export function isNotEmpty<T>(value: T | null | undefined): value is T {
  let notEmpty = isNotNullish(value);
  if (notEmpty) {
    if (isString(value)) {
      notEmpty = value !== "";
    } else if (isArray(value)) {
      notEmpty = value.length > 0;
    }
  }
  return notEmpty;
}

