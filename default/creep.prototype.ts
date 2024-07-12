import * as _ from "lodash"
import EnergyRequestFlagTypes from "./energyRequestFlagTypes"

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
            }else{
                delete creep.memory.targetId
            }
        }
        

        type source= Source
        let source = creep.room.find(FIND_SOURCES_ACTIVE)[0]
        if(creep.harvest(source)===ERR_NOT_IN_RANGE){
            creep.moveTo(source)
        }   
        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            creep.memory.state = "hasEnergy"
            delete creep.memory.targetId
        }
    }


    Creep.prototype.deliverEnergy = (creep:Creep) => {
        try {
            if(!creep.memory.targetId){
                if(creep.memory.base){
                    let energyRequest = Memory.baseManager[creep.memory.base].energyRequests
                    for(let i = 0 ; i < energyRequest.length; i++){
                        let flag = Game.flags[energyRequest[i]]
                        if(flag.memory.energyRequired){
                            if(flag.memory.energyRequired>0){
                                creep.memory.targetId = energyRequest[i]
                                break;
                            }
                        }
                    }
                }
            }else{
                let targetFlag = Game.flags[creep.memory.targetId]
                if(targetFlag.memory.type == EnergyRequestFlagTypes.BUILDER){
                    if(targetFlag.memory.assignedBuilder){
                        let target = Game.getObjectById(targetFlag.memory.assignedBuilder)
                        if(target instanceof Creep){
                            let ret = creep.transfer(target,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
                            if(ret ===ERR_NOT_IN_RANGE){
                                creep.moveTo(target)
                            }
                        }
                    }
                }
                if(targetFlag.memory.type == EnergyRequestFlagTypes.BASE){
                    let target = creep.room.find(FIND_MY_SPAWNS)[0]
                    if(target){
                        creep.moveTo(target)
                        let carryiedEnergy = creep.store.getUsedCapacity(RESOURCE_ENERGY)
                        let result = creep.transfer(target,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
                        if(result === OK){
                            if(Game.flags[target.id]){
                                
                                if(Game.flags[target.id].memory.energyAvailable){
                                    let energyAvailable = Game.flags[target.id].memory.energyAvailable
                                    if(energyAvailable){
                                        energyAvailable = energyAvailable -carryiedEnergy
                                        Game.flags[target.id].memory.energyAvailable = energyAvailable
                                    }
                                }
                            }
                        }
                        if(result === ERR_FULL){
                            delete creep.memory.targetId
                            Game.flags[target.id].memory.energyRequired = 0 
                        }
                    }
                }
                
            }
        } catch (error) {
            console.log(`erroro in deliver Energy ${error}`)
        }
    }
            // if(builderCreep instanceof Creep){
            //     let ret = creep.transfer(builderCreep,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
            //     if (ret === ERR_NOT_IN_RANGE){
            //         creep.moveTo(builderCreep)
            //     }
            // }

        // let spawn = creep.room.find(FIND_MY_SPAWNS)[0]
        // if(spawn){
        //     let ret:ScreepsReturnCode = creep.transfer(spawn,RESOURCE_ENERGY)
        //     if(ret ==ERR_NOT_IN_RANGE){
        //         creep.moveTo(spawn)
                
        //     }
        // }

}


export default initCreepPrototypes