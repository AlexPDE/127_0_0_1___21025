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
        }
    };
    Creep.prototype.deliverEnergy = (creep) => {
        console.log("deliver energy prototype");
        if (!creep.memory.targetId) {
            if (creep.memory.base) {
                console.log("test1");
                let energyRequest = Memory.baseManager[creep.memory.base].energyRequests;
                for (let i = 0; i < energyRequest.length; i++) {
                    let flag = Game.flags[energyRequest[i]];
                    if (flag.memory.energyRequired) {
                        if (flag.memory.energyRequired > 0) {
                            creep.memory.targetId = energyRequest[i];
                        }
                    }
                }
            }
        }
        else {
            let targetFlag = Game.flags[creep.memory.targetId];
            if (targetFlag.memory.type = energyRequestFlagTypes_1.default.BUILDER) {
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