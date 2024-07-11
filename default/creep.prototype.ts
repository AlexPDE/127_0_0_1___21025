import * as _ from "lodash"

let initCreepPrototypes:Function


initCreepPrototypes= ()=>{
    Creep.prototype.getEnergy = (creep:Creep) =>{
        if(!creep.memory.targetId){
            if(creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)){
                let resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
                creep.memory.targetId = resource?.id
            }
        }else{
            let target = Game.getObjectById(creep.memory.targetId)
            if (target instanceof Resource){
                let ret:ScreepsReturnCode = creep.pickup(target)
                if(ret = ERR_NOT_IN_RANGE){
                    creep.moveTo(target)
                }
            }
        }
        

        type source= Source
        let source = creep.room.find(FIND_SOURCES_ACTIVE)[0]
        if(creep.harvest(source)===ERR_NOT_IN_RANGE){
            creep.moveTo(source)
        }   
        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            creep.memory.state = "hasEnergy"
        }
    }

    
    Creep.prototype.deliverEnergy = (creep:Creep) => {
        let spawn = creep.room.find(FIND_MY_SPAWNS)[0]
        if(spawn){
            let ret:ScreepsReturnCode = creep.transfer(spawn,RESOURCE_ENERGY)
            if(ret ==ERR_NOT_IN_RANGE){
                creep.moveTo(spawn)
                
            }
        }

    }
}

export default initCreepPrototypes