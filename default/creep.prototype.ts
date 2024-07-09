import * as _ from "lodash"

let initCreepPrototypes:Function

initCreepPrototypes= ()=>{
    Creep.prototype.getEnergy = () =>{
        console.log(this)
    }
}

export default initCreepPrototypes