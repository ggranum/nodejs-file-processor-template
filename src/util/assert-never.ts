export function assertNever(x: never): never {
  throw new Error("Unexpected enum value: " + x);
}