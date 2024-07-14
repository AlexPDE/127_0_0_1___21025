import * as _ from "lodash"
import EnergyRequestFlagTypes from "./energyRequestFlagTypes"
import { spawn } from "child_process"

let initCreepPrototypes:Function
let deleteDeliverySchedule:Function
let deliverToBase:Function


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
                let flag = Game.flags[energyRequests[i]]
                if(flag.memory.energyRequired){
                    if(flag.memory.energyRequired >0){
                        if(flag.memory.type == "base"){
                            creep.memory.targetId = flag.pos.lookFor(LOOK_STRUCTURES)[0].id
                            creep.memory.flagId = flag.name
                            console.log(`creep.memory.flagId ${creep.memory.flagId}`)
                            
                        }else{
                            creep.memory.flagId = flag.name
                        }
                        // adding the delivery to scheduled deliveries
                        if(flag.memory.scheduledDeliverys){
                            flag.memory.scheduledDeliverys.push({
                                creepId: creep.id,
                                amount: creep.store.getUsedCapacity(RESOURCE_ENERGY)
                            })
                        }
                        
                        break
                    }
                }
                
            }
        }else{
            // there is a target defined now we need to deliver to it
            let flag = Game.flags[creep.memory.flagId]
            if(flag){
                let retTransfer:ScreepsReturnCode
                switch(flag.memory.type){
                    case "base":
                        let target = deliverToBase(creep)
                        creep.moveTo(target)
                        retTransfer = creep.transfer(target,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
                        break;
                    
                    case "construction":
                        let targetFlag = Game.flags[creep.memory.flagId]
                        if(targetFlag.memory.assignedBuilder){
                            let target = Game.getObjectById(targetFlag.memory.assignedBuilder)
                            if(target instanceof Creep){
                                retTransfer = creep.transfer(target,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
                                if(retTransfer ===ERR_NOT_IN_RANGE){
                                    creep.moveTo(target)
                                }
                            }else{
                                retTransfer = ERR_BUSY
                            }
                        }else{
                            retTransfer = ERR_BUSY
                        }
                        break;

                    default:
                        retTransfer = ERR_BUSY
                        console.log(`flag.memory.type in creep prototype is not defined: ${flag.memory.type}`)
                }
                if(retTransfer === OK){
                    deleteDeliverySchedule(Game.flags[creep.memory.flagId],creep.id)
                }
            }else{
                // this can happen if for example the build flag is complete or similiar instances 
                delete creep.memory.flagId
            }

        }
    }


    deliverToBase = (creep:Creep) =>{
        if(Memory.baseManager[creep.memory.base].fastFillerActive && creep.memory.flagId){
            let flag = Game.flags[creep.memory.flagId] 
            if(flag.room){
                let containerPos = new RoomPosition(flag.pos.x , flag.pos.y+1 , flag.room.name )
                let container = containerPos.lookFor(LOOK_STRUCTURES)[0]
                return container
            }else{
                console.log(`error in deliver to base look why this path is taken`)
                return 1
            }
            
                
            
            
            
        }else{
            let targetId = Game.creeps[creep.name].memory.targetId
            if(targetId){
                return Game.getObjectById(targetId)
            }else{
                console.log(`error in deliver to base look why this path is taken`)
                return 1
            }

            
        }
    }

    deleteDeliverySchedule = (flag:Flag, creepId:string) =>{
        let scheduledDeliverys = flag.memory.scheduledDeliverys
        if(scheduledDeliverys){
            for (let i = 0; i < scheduledDeliverys?.length;i++){
                if(scheduledDeliverys[i].creepId == creepId){
                    scheduledDeliverys.splice(i,1)
                }
            }
        }
    }
}
   
    export default initCreepPrototypes



