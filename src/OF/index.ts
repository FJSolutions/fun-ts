import * as Option from "./option"
import * as Sequence from "./sequence";
import * as Result from "./result"
/**
 * All the modules in this namespace can be labelled as being implemented using the Object/Funcional (OF) approach.
 * That is: smart objects (class based implementation) with Functional methods that can be chained together.
 */
export const OF = {
   O: Option,
   Seq: Sequence,
   R: Result
}
