//noinspection TypeScriptPreferShortImport
import { generatePushID } from "../../src/util/generate-push-id";

describe("generate-push-id", () => {

  it("Generates 20 char long identifiers", () => {
    const key = generatePushID();
    expect(key).toBeDefined();
    expect(key.length).toBe(20);//, 'Key length should be 20 characters')
  });

  it("Generates many unique identifiers per second", () => {
    const count = 100;
    const start = new Date().getTime()

    const keyAry = [];
    const keyMap = {};
    for (let i = 0; i < count; i++) {
      const key = generatePushID();
      keyAry.push(key);
      (<any>keyMap)[ key ] = true;
    }
    const end = new Date().getTime()
    const delta = end - start;
    expect(keyAry.length).toBeDefined();

    expect(delta).toBeLessThan(10);
  });
});



describe("scratch", () => {

  function mult(x=0, y=0) {
    return x * y;
  }

  function encode(text="") {
    if(text.length === 0){
      return ''
    }

    let result = ""
    let L = text[0];
    let count = 1;
    for (let i = 1; i < text.length; i++) {
       if(text[i] === L){
         count++
       } else {
         result = result + count + L;
         L = text[i];
         count = 1;
       }
    }
    result = result + count + L;

    return result;
  }
  it("Works", () => {
    var foo = encode("a")
    expect(foo).toBe("1a");//, 'Key length should be 20 characters')
  });
});
