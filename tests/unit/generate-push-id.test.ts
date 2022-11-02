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
