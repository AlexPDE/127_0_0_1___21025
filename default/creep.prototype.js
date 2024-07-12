"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const energyRequestFlagTypes_1 = require("./energyRequestFlagTypes");
let initCreepPrototypes;
initCreepPrototypes = () => {
    Creep.prototype.getEnergy = (creep) => {
        if (!creep.memory.targetId) {
            if (creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)) {
                let resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                creep.memory.targetId = resource === null || resource === void 0 ? void 0 : resource.id;
            }
        }
        else {
            let target = Game.getObjectById(creep.memory.targetId);
            if (target instanceof Resource) {
                let ret = creep.pickup(target);
                if (ret = ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                delete creep.memory.targetId;
            }
        }
        let source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.state = "hasEnergy";
            delete creep.memory.targetId;
        }
    };
    Creep.prototype.deliverEnergy = (creep) => {
        try {
            if (!creep.memory.targetId) {
                if (creep.memory.base) {
                    let energyRequest = Memory.baseManager[creep.memory.base].energyRequests;
                    for (let i = 0; i < energyRequest.length; i++) {
                        let flag = Game.flags[energyRequest[i]];
                        if (flag.memory.energyRequired) {
                            if (flag.memory.energyRequired > 0) {
                                creep.memory.targetId = energyRequest[i];
                                break;
                            }
                        }
                    }
                }
            }
            else {
                let targetFlag = Game.flags[creep.memory.targetId];
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
                if (targetFlag.memory.type == energyRequestFlagTypes_1.default.BASE) {
                    let target = creep.room.find(FIND_MY_SPAWNS)[0];
                    if (target) {
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
                            delete creep.memory.targetId;
                            Game.flags[target.id].memory.energyRequired = 0;
                        }
                    }
                }
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