import * as _ from "lodash"
import EnergyRequestFlagTypes from "./energyRequestFlagTypes"
import { spawn } from "child_process"

let initCreepPrototypes:Function
let deleteDeliverySchedule:Function


initCreepPrototypes= ()=>{
    Creep.prototype.getEnergy = (creep:Creep) =>{
        if(!creep.memory.flagId){
            if(creep.memory.base){
                let sources =  Memory.baseManager[creep.memory.base].sources
                for (let i of sources){
                    let flag= Game.flags[i]
                    if(flag.memory.energyAvailable){
                        if(flag.memory.energyAvailable >= creep.store.getFreeCapacity(RESOURCE_ENERGY)){
                            creep.memory.flagId = i
                            break;
                        }
                    }
                    
                }
            }
            
        }else{
            
            let targetFlag = Game.flags[creep.memory.flagId]
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
            delete creep.memory.flagId
        }
    }

    Creep.prototype.deliverEnergy = (creep) => {
        let deliverToBase = false
        let deliverToContainer = false
        let deliverToCreep = false

        // no target selected therefore choosing where to deliver to.
        if (!creep.memory.flagId){
            console.log(`creep.memory.flagId ${creep.memory.flagId}`)
            let energyRequests = [];
            //adding the spawn flag
            energyRequests.push(creep.memory.base) 
            //adding energyRequest from the memory
            for (let i in Memory.baseManager[creep.memory.base].energyRequests) {
                energyRequests.push( Memory.baseManager[creep.memory.base].energyRequests[i])  
            }
            let targetfound = false
            
            for (let i in energyRequests){
                console.log("energyRequests:", energyRequests )
                let flag = Game.flags[energyRequests[i]]
                if(flag.memory.energyRequired >0){
                    if(flag.memory.type == "base"){
                        creep.memory.targetId = flag.pos.lookFor(LOOK_STRUCTURES)[0].id
                        creep.memory.flagId = flag.name
                        console.log(`creep.memory.flagId ${creep.memory.flagId}`)
                        
                    }else{
                        creep.memory.flagId = flag.name
                    }
                    // adding the delivery to scheduled deliveries
                    flag.memory.scheduledDeliverys.push({
                        creepId: creep.id,
                        amount: creep.store.getUsedCapacity(RESOURCE_ENERGY)
                    })
                    break
                }
                
            }
        }else{
            // there is a target defined now we need to deliver to it
            let flag = Game.flags[creep.memory.flagId]
            console.log("flag" , flag )
            if(flag){
                let retTransfer:ScreepsReturnCode
                switch(flag.memory.type){
                    case "base":
                        let target = Game.getObjectById(creep.memory.targetId)
                        creep.moveTo(target)
                        retTransfer = creep.transfer(target,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
                        break;
                    
                    case "construction":
                        let targetFlag = Game.flags[creep.memory.flagId]
                        if(targetFlag.memory.assignedBuilder){
                            let target = Game.getObjectById(targetFlag.memory.assignedBuilder)
                            if(target instanceof Creep){
                                let ret = creep.transfer(target,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
                                if(ret ===ERR_NOT_IN_RANGE){
                                    creep.moveTo(target)
                                }
                            }
                        }
                        break;

                    default:
                        console.log(`flag.memory.type in creep prototype is not defined: ${flag.memory.type}`)

                }
                if(retTransfer === OK){
                    deleteDeliverySchedule(Game.flags[creep.memory.flagId])
                }
            }else{
                // this can happen if for example the build flag is complete or similiar instances 
                console.log("test1")
                delete creep.memory.flagId
            }

        }
    }
    deleteDeliverySchedule = (flag:Flag, creepId:string) =>{
        console.log("deleteDeliverySchedule")
        le  t scheduledDeliverys = flag.memory.scheduledDeliverys
        for (let i in scheduledDeliverys){
            console.log(`scheduledDeliverys: ${scheduledDeliverys} , i: ${i} , scheduledDeliverys[i]: ${scheduledDeliverys[i]}`)
            if(scheduledDeliverys[i].creepId == creepId){
                scheduledDeliverys.splice(i,1)
            }
        }
    }
}
   
    
    export default initCreepPrototypes

//     Creep.prototype.deliverEnergy = (creep:Creep) => {
//         try {
//             if(!creep.memory.flagId){
//                 if(creep.memory.base){
//                     let energyRequests = []
//                     for (let i in Memory.baseManager[creep.memory.base].energyRequests){
//                         console.log("test1")
//                         energyRequests.push(Memory.baseManager[creep.memory.base].energyRequests[i])
//                     }
//                     energyRequests.push(Game.rooms[creep.memory.base].find(FIND_MY_SPAWNS)[0].id)
//                     for(let i = 0 ; i < energyRequests.length; i++){
//                             console.log(`test 2`)
//                             let flag = Game.flags[energyRequests[i]]
//                             if (!flag){
//                                 let flag = Game.flags[creep.memory.base]
//                             }
                            
//                             console.log(flag,energyRequests[i])
//                             if(flag.memory.energyRequired){
//                                 if(flag.memory.energyRequired>0){
//                                     creep.memory.flagId = energyRequests[i]
//                                     if(flag.memory.scheduledDeliverys){
//                                         flag.memory.scheduledDeliverys.push({
//                                             creepId:creep.id,
//                                             amount:creep.store.getUsedCapacity(RESOURCE_ENERGY)
//                                         })
//                                     }
                                    
//                                     if(Game.flags[creep.memory.flagId]){

//                                     }else{
//                                         Game.flags[creep.memory.base].updateSpawnFlag(Game.flags[creep.memory.base])
//                                     }
                                    
//                                     break;
//                                 }
//                             }
//                         }else{
//                             // try {
//                             //     let spawn = Game.getObjectById(energyRequests[i])
//                             //     console.log("test1---------------------------------------------------------")
//                             //     if(spawn instanceof Spawn){
//                             //         console.log("test2---------------------------------------------------------")
//                             //         flag = Game.flags[spawn.room.name]
//                             //         if(flag.memory.energyRequired){
//                             //             if(flag.memory.energyRequired>0){
//                             //                 creep.memory.flagId = spawn.room.name
//                             //                 Game.flags[creep.memory.flagId].updateSpawnFlag(Game.flags[creep.memory.flagId])
//                             //                 break;
//                             //             }
//                             //         }
//                             //     }
//                             // } catch (error) {
//                             //     console.log("deliver energy has error in the delivering to base section ", error)
//                             // }
                            
//                         }
                        
//                     }
//                 }
//             }else{
//                 let targetFlag = Game.flags[creep.memory.flagId]
//                 console.log(`targetFlag ${targetFlag}`)
//                 if(targetFlag){  
                    
//                     if(targetFlag.memory.type == EnergyRequestFlagTypes.BUILDER){
//                         console.log("test 1 deliver to builder flag ")
//                         if(targetFlag.memory.assignedBuilder){
//                             let target = Game.getObjectById(targetFlag.memory.assignedBuilder)
//                             if(target instanceof Creep){
//                                 let ret = creep.transfer(target,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
//                                 if(ret ===ERR_NOT_IN_RANGE){
//                                     creep.moveTo(target)
//                                 }
//                             }
//                         }
//                     }
//                 }else{
//                         let target = Game.getObjectById(creep.memory.flagId)
//                         try {
//                             if(target instanceof StructureSpawn){
//                                 creep.moveTo(target)
//                                 let carryiedEnergy = creep.store.getUsedCapacity(RESOURCE_ENERGY)
//                                 let result = creep.transfer(target,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
//                                 if(result === OK){
//                                     if(Game.flags[creep.room.name]){
//                                         console.log(`delivery sucesfull to base ${target} this is located at the flag ${creep.memory.base}`)
//                                         let scheduledDeliveries  = Game.flags[creep.memory.base].memory.scheduledDeliverys
//                                         for (let i in scheduledDeliveries){
//                                             if((scheduledDeliveries[i].creepId == creep.id) || !Game.getObjectById(scheduledDeliveries[i].creepId)){
//                                                 Game.flags[creep.memory.base].memory.scheduledDeliverys,Game.flags[creep.memory.base].memory.scheduledDeliverys.splice(i,1)                                       
//                                             }
//                                         }
//                                         if(Game.flags[creep.room.name].memory.energyAvailable){
//                                             let energyAvailable = Game.flags[creep.room.name].memory.energyAvailable
//                                             if(energyAvailable){
//                                                 energyAvailable = energyAvailable -carryiedEnergy
//                                                 Game.flags[creep.room.name].memory.energyAvailable = energyAvailable
//                                             }
//                                         }
//                                     }
//                                 }
                                
//                                 if(result === ERR_FULL){
//                                     delete creep.memory.flagId
//                                 }
//                             }
//                         } catch (error) {
//                             console.log("error in deliver Energy section base")
//                         }   
                        
//                     }
                    
//                     try {
//                         if(creep.memory.flagId){
//                             let target = Game.getObjectById(creep.memory.flagId)                        
//                             if(target instanceof StructureSpawn){
//                                 creep.moveTo(target)
//                                 let carryiedEnergy = creep.store.getUsedCapacity(RESOURCE_ENERGY)
//                                 let result = creep.transfer(target,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
//                                 if(result === OK){
//                                     if(Game.flags[target.id]){
//                                         if(Game.flags[target.id].memory.energyAvailable){
//                                             let energyAvailable = Game.flags[target.id].memory.energyAvailable
//                                             if(energyAvailable){
//                                                 energyAvailable = energyAvailable -carryiedEnergy
//                                                 Game.flags[target.id].memory.energyAvailable = energyAvailable
//                                             }
//                                         }
//                                     }
//                                 }
//                                 if(result === ERR_FULL){
//                                     delete creep.memory.flagId
//                                 }
//                             }
//                         }  
//                     } catch (error) {
//                         console.log("error in deliver Energy section base")
//                     }
                        
                    
//                 // }else{
//                 //     delete creep.memory.flagId
//                 // }
                
//             }
//         } catch (error) {
//             console.log(`erroro in deliver Energy ${error}`)
//         }
//     }
//             // if(builderCreep instanceof Creep){
//             //     let ret = creep.transfer(builderCreep,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
//             //     if (ret === ERR_NOT_IN_RANGE){
//             //         creep.moveTo(builderCreep)
//             //     }
//             // }

//         // let spawn = creep.room.find(FIND_MY_SPAWNS)[0]
//         // if(spawn){
//         //     let ret:ScreepsReturnCode = creep.transfer(spawn,RESOURCE_ENERGY)
//         //     if(ret ==ERR_NOT_IN_RANGE){
//         //         creep.moveTo(spawn)
                
//         //     }
//         // }

// }



