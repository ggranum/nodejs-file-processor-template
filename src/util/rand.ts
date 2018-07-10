import {IntegerValue} from "./helper-types"

export class Rand {
  static intInRange(min:IntegerValue, max:IntegerValue, maxInclusive:boolean = false):IntegerValue {
    if(maxInclusive){
      max++
    }
    return min + Math.floor(Math.random() * (max - min));
  }

  static nextBoolean() {
    return Math.random() >= 0.5
  }
}
