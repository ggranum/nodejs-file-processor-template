export class AsciiUtil {

  static toAscii(hex: string): string {
    hex       = hex + "";
    let ascii = "";
    for (let i = 0; i < hex.length; i += 2) {
      const char = parseInt(hex.substr(i, 2), 16);
      ascii += String.fromCharCode(char);
    }
    return ascii;
  }

  static toHex(ascii: string): string {
    ascii     = ascii + "";
    const hex = [];
    for (let i = 0, l = ascii.length; i < l; i++) {
      const char    = ascii.charCodeAt(i);
      const hexChar = Number(char).toString(16);
      hex.push(hexChar);
    }
    return hex.join("");
  }

}
