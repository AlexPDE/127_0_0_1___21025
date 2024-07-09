import * as _ from "lodash"

let initFlagPrototypes:Function

initFlagPrototypes= ()=>{
    Flag.prototype.updateEnergySupply = (flag:Flag) =>{
        var scheduledPickupSum = 0
        if(!flag.memory.scheduledPickups){
            flag.memory.scheduledPickups = []
        }
        if(!flag.memory.energyAvailable){
            flag.memory.energyAvailable = 0
        }
        
        for (let i in flag.memory.scheduledPickups){
            console.log(i)
            // add all scheduled pickups here. 
        }
        var energyAvailable = 0
        let container = flag.pos.lookFor(LOOK_STRUCTURES)
        if (container instanceof StructureContainer){
            energyAvailable = container.store.getUsedCapacity(RESOURCE_ENERGY)
        }
        var groundEnergy = flag.pos.lookFor(LOOK_ENERGY)
        energyAvailable = energyAvailable + groundEnergy[0].amount - scheduledPickupSum
        flag.memory.energyAvailable = energyAvailable
    }
}

export default initFlagPrototypes