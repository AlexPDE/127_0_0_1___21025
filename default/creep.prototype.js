"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            }else{
                delete(creep.memory.targetId)
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
        let spawn = creep.room.find(FIND_MY_SPAWNS)[0];
        if (spawn) {
            let ret = creep.transfer(spawn, RESOURCE_ENERGY);
            if (ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    };
};
exports.default = initCreepPrototypes;
//# sourceMappingURL=creep.prototype.js.map