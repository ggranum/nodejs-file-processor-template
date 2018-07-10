import { isNotNullish } from "./validations";

export function valueOrDefault<T>(value: T, defaultVal: T): T {
  return isNotNullish(value) ? value : defaultVal;
}
