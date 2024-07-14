import * as _ from "lodash"
import EnergyRequestFlagTypes from "./energyRequestFlagTypes"
import { spawn } from "child_process"

let initCreepPrototypes:Function


initCreepPrototypes= ()=>{
    Creep.prototype.getEnergy = (creep:Creep) =>{
        if(!creep.memory.targetId){
            if(creep.memory.base){
                let sources =  Memory.baseManager[creep.memory.base].sources
                for (let i of sources){
                    let flag= Game.flags[i]
                    if(flag.memory.energyAvailable){
                        if(flag.memory.energyAvailable >= creep.store.getFreeCapacity(RESOURCE_ENERGY)){
                            console.log(`flag.memory.energyAvailable ${flag.memory.energyAvailable}`)
                            creep.memory.targetId = i
                            break;
                        }
                    }
                    
                }
            }
            
        }else{
            
            let targetFlag = Game.flags[creep.memory.targetId]
            if(!creep.pos.inRangeTo(targetFlag,1)){
                creep.moveTo(targetFlag)
            }
            let droppedEnergy = targetFlag.pos.lookFor(RESOURCE_ENERGY)[0]
            if(droppedEnergy){
                creep.pickup(droppedEnergy)
            }
            let container = targetFlag.pos.lookFor(LOOK_STRUCTURES)[0]
            if(container instanceof StructureContainer){
                creep.withdraw(container,RESOURCE_ENERGY,creep.store.getFreeCapacity(RESOURCE_ENERGY))
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
                    console.log("test1")
                    let energyRequests = []
                    for (let i in Memory.baseManager[creep.memory.base].energyRequests){
                        console.log("test2")
                        //energyRequests.pushMemory.baseManager[creep.memory.base].energyRequests[i]
                    }
                    energyRequests.push(creep.room.find(FIND_MY_SPAWNS)[0].id)
                    console.log(energyRequests)
                    for(let i = 0 ; i < energyRequests.length; i++){
                        let flag = Game.flags[energyRequests[i]]
                        if(flag){
                            if(flag.memory.energyRequired){
                                if(flag.memory.energyRequired>0){
                                    creep.memory.targetId = energyRequests[i]
                                    break;
                                }
                            }
                        }else{
                            let spawn = Game.getObjectById(energyRequests[i])
                            console.log(`spawn ${spawn}`)
                            if(spawn instanceof Spawn){
                                flag = Game.flags[spawn.room.name]
                                console.log(flag)
                                if(flag.memory.energyRequired){
                                    if(flag.memory.energyRequired>0){
                                        creep.memory.targetId = spawn.room.name
                                        break;
                                    }
                                }
                            }
                        }
                        
                    }
                }
            }else{
                let targetFlag = Game.flags[creep.memory.targetId]
                if(targetFlag){     
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
                            }
                        }
                    }
                }else{
                    delete creep.memory.targetId
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