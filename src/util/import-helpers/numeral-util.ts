import numeral from "numeral"

/**
 * Importing "numeral" directly isn't as automatic as this import when using WebStorm. So, this is purely a hack to avoid having to
 * manually type 'import * as numeral from "numeral"'. So lazy.
 * @type {Numeral}
 */
export const Numeral = numeral;
