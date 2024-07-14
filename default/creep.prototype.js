"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const energyRequestFlagTypes_1 = require("./energyRequestFlagTypes");
let initCreepPrototypes;
initCreepPrototypes = () => {
    Creep.prototype.getEnergy = (creep) => {
        if (!creep.memory.flagId) {
            if (creep.memory.base) {
                let sources = Memory.baseManager[creep.memory.base].sources;
                for (let i of sources) {
                    let flag = Game.flags[i];
                    if (flag.memory.energyAvailable) {
                        if (flag.memory.energyAvailable >= creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                            creep.memory.flagId = i;
                            break;
                        }
                    }
                }
            }
        }
        else {
            let targetFlag = Game.flags[creep.memory.flagId];
            if (!creep.pos.inRangeTo(targetFlag, 1)) {
                creep.moveTo(targetFlag);
            }
            let droppedEnergy = targetFlag.pos.lookFor(RESOURCE_ENERGY)[0];
            if (droppedEnergy) {
                creep.pickup(droppedEnergy);
            }
            let container = targetFlag.pos.lookFor(LOOK_STRUCTURES)[0];
            if (container instanceof StructureContainer) {
                creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY));
            }
        }
        let source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.state = "hasEnergy";
            delete creep.memory.flagId;
        }
    };
    Creep.prototype.deliverEnergy = (creep) => {
        try {
            if (!creep.memory.flagId) {
                if (creep.memory.base) {
                    let energyRequests = [];
                    for (let i in Memory.baseManager[creep.memory.base].energyRequests) {
                        //energyRequests.pushMemory.baseManager[creep.memory.base].energyRequests[i]
                    }
                    energyRequests.push(Game.rooms[creep.memory.base].find(FIND_MY_SPAWNS)[0].id);
                    for (let i = 0; i < energyRequests.length; i++) {
                        let flag = Game.flags[creep.memory.base];
                        if (flag) {
                            if (flag.memory.energyRequired) {
                                if (flag.memory.energyRequired > 0) {
                                    creep.memory.flagId = energyRequests[i];
                                    if (flag.memory.scheduledDeliverys) {
                                        flag.memory.scheduledDeliverys.push({
                                            creepId: creep.id,
                                            amount: creep.store.getUsedCapacity(RESOURCE_ENERGY)
                                        });
                                    }
                                    if (Game.flags[creep.memory.flagId]) {
                                    }
                                    else {
                                        Game.flags[creep.memory.base].updateSpawnFlag(Game.flags[creep.memory.base]);
                                    }
                                    break;
                                }
                            }
                        }
                        else {
                            // try {
                            //     let spawn = Game.getObjectById(energyRequests[i])
                            //     console.log("test1---------------------------------------------------------")
                            //     if(spawn instanceof Spawn){
                            //         console.log("test2---------------------------------------------------------")
                            //         flag = Game.flags[spawn.room.name]
                            //         if(flag.memory.energyRequired){
                            //             if(flag.memory.energyRequired>0){
                            //                 creep.memory.flagId = spawn.room.name
                            //                 Game.flags[creep.memory.flagId].updateSpawnFlag(Game.flags[creep.memory.flagId])
                            //                 break;
                            //             }
                            //         }
                            //     }
                            // } catch (error) {
                            //     console.log("deliver energy has error in the delivering to base section ", error)
                            // }
                        }
                    }
                }
            }
            else {
                let targetFlag = Game.flags[creep.memory.flagId];
                if (targetFlag) {
                    if (targetFlag.memory.type == energyRequestFlagTypes_1.default.BUILDER) {
                        if (targetFlag.memory.assignedBuilder) {
                            let target = Game.getObjectById(targetFlag.memory.assignedBuilder);
                            if (target instanceof Creep) {
                                let ret = creep.transfer(target, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                                if (ret === ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target);
                                }
                            }
                        }
                    }
                }
                else {
                    let target = Game.getObjectById(creep.memory.flagId);
                    try {
                        if (target instanceof StructureSpawn) {
                            creep.moveTo(target);
                            let carryiedEnergy = creep.store.getUsedCapacity(RESOURCE_ENERGY);
                            let result = creep.transfer(target, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                            if (result === OK) {
                                if (Game.flags[creep.room.name]) {
                                    console.log(`delivery sucesfull to base ${target} this is located at the flag ${creep.memory.base}`);
                                    let scheduledDeliveries = Game.flags[creep.memory.base].memory.scheduledDeliverys;
                                    for (let i in scheduledDeliveries) {
                                        if ((scheduledDeliveries[i].creepId == creep.id) || !Game.getObjectById(scheduledDeliveries[i].creepId)) {
                                            Game.flags[creep.memory.base].memory.scheduledDeliverys, Game.flags[creep.memory.base].memory.scheduledDeliverys.splice(i, 1);
                                        }
                                    }
                                    if (Game.flags[creep.room.name].memory.energyAvailable) {
                                        let energyAvailable = Game.flags[creep.room.name].memory.energyAvailable;
                                        if (energyAvailable) {
                                            energyAvailable = energyAvailable - carryiedEnergy;
                                            Game.flags[creep.room.name].memory.energyAvailable = energyAvailable;
                                        }
                                    }
                                }
                            }
                            if (result === ERR_FULL) {
                                delete creep.memory.flagId;
                            }
                        }
                    }
                    catch (error) {
                        console.log("error in deliver Energy section base");
                    }
                }
                try {
                    if (creep.memory.flagId) {
                        let target = Game.getObjectById(creep.memory.flagId);
                        if (target instanceof StructureSpawn) {
                            creep.moveTo(target);
                            let carryiedEnergy = creep.store.getUsedCapacity(RESOURCE_ENERGY);
                            let result = creep.transfer(target, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                            if (result === OK) {
                                if (Game.flags[target.id]) {
                                    if (Game.flags[target.id].memory.energyAvailable) {
                                        let energyAvailable = Game.flags[target.id].memory.energyAvailable;
                                        if (energyAvailable) {
                                            energyAvailable = energyAvailable - carryiedEnergy;
                                            Game.flags[target.id].memory.energyAvailable = energyAvailable;
                                        }
                                    }
                                }
                            }
                            if (result === ERR_FULL) {
                                delete creep.memory.flagId;
                            }
                        }
                    }
                }
                catch (error) {
                    console.log("error in deliver Energy section base");
                }
                // }else{
                //     delete creep.memory.flagId
                // }
            }
        }
        catch (error) {
            console.log(`erroro in deliver Energy ${error}`);
        }
    };
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
};
exports.default = initCreepPrototypes;
//# sourceMappingURL=creep.prototype.js.map