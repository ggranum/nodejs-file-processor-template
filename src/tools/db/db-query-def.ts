export interface DbQueryIF {
  name: string;
  text: string;
  values: any[]
}

export class DbQueryDef {

  constructor(public readonly name: string, public readonly text: string) {
  }

  forValues(values: any[]): DbQueryIF {
    return {
      name:   this.name,
      text:   this.text,
      values: values,
    };
  }

}
