import {Numeral} from "../import-helpers/numeral-util"
import {PositiveIntegerValue} from "../helper-types"


export class Perf {
  private static indents:string[] = ['\t']
  private static depth:PositiveIntegerValue = 0;
  static enabled:boolean = true
  private static active: Map<Symbol, number> = new Map();

  static start(): Symbol {
    const token = Symbol()
    if(Perf.enabled){
      Perf.depth++
      Perf.active.set(token, Date.now())
    }
    return token
  }

  static getIndent(count:number){
    let tabs = Perf.indents[count]
    if(!tabs){
      tabs = Perf.indents[0]
      for (let i = 1; i <= count; i++) {
        tabs = tabs + '\t';
        Perf.indents[i] = tabs;
      }
    }
    return tabs
  }


  static end(token:Symbol, msg:string){
    if(Perf.enabled){
      Perf.depth--
      const delta = Date.now() - Perf.active.get(token)!
      Perf.active.delete(token)
      const indent = Perf.getIndent(Perf.depth)
      console.log(`[Perf] ${indent}${Numeral(delta/1000).format("0.000")}`, msg)
    }
  }

}
