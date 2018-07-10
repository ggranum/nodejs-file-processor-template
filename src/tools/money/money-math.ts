import { DecimalMoney } from "../../util/helper-types";
import { Numeral } from "../../util/numeral-util";

/**
 * @todo ggranum: This class is a placeholder. All math against money types should be routed to here.
 *
 * At some point, this will be replaced with an actual BigDecimal or Money implementation.
 */
export class MoneyMath {

  static add(a: DecimalMoney, b: DecimalMoney): DecimalMoney {
    return Numeral(a).add(b).value();
  }

  static subtract(a: DecimalMoney, b: DecimalMoney) {
    return Numeral(a).subtract(b).value();
  }

  static multiply(a: DecimalMoney, b: number) {
    return Numeral(a).multiply(b).value();
  }
}
