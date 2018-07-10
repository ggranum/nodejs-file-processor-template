import { isNumber } from "util";
import { IntegerValue, NumberString } from "../helper-types";
import { isNotNullish, isString } from "../validations";

export function asInt(value?: NumberString,
                      defaultValue?: IntegerValue,
                      suppressErrors: boolean = true): IntegerValue {
  let result: number = <number>defaultValue;
  try {
    result = isNotNullish(value) ? Number.parseInt(value) : <number>defaultValue;
    if (Number.isNaN(result)) {
      result = <number>defaultValue;
    }
  } catch (e) {
    if (!suppressErrors) {
      throw e;
    } else {
      console.log("[Error]", "asInt#asInt", "Could not parse");
    }
  }
  return result;
}

export function ensureInt(value?: NumberString | number | null | undefined,
                          defaultValue: IntegerValue = 0,
                          allowNaN:boolean = false): IntegerValue {
  let result: IntegerValue;
  if (isNumber(value)) {
    result = Math.floor(value);
  } else if (isString(value)) {
    result = asInt(value, defaultValue);
  }
  else {
    result = defaultValue;
  }
  if(!allowNaN && Number.isNaN(result)){
    result = defaultValue;
  }
  return result;
}
