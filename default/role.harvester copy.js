"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeHarvester = void 0;
let roleHarvester;
exports.default = roleHarvester = {
    run(creep) {
        console.log("creep run fuction is running");
        try {
            console.log(creep.memory.state);
            switch (creep.memory.state) {
                case `justSpawned`:
                    console.log("new creep just spawned");
                    creep.memory.state = "hasNoEnergy";
                    break;
                case `hasNoEnergy`:
                    let source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
                    if (creep.harvest(source)) { }
                    else {
                        creep.moveTo(source);
                    }
                    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.state = "hasEnergy";
                    }
                    break;
                case `hasEnergy`:
                    let spawn = creep.room.find(FIND_MY_SPAWNS)[0];
                    if (creep.transfer(spawn, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY)) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                    break;
                default:
                    console.log(`creep ${creep} has the memory state ${creep.memory.state}, this is not defined`);
            }
        }
        catch (error) {
            console.log(`error in role.harvester`);
        }
    }
};
exports.typeHarvester = {
    role: "harvester",
    body: [MOVE, WORK, CARRY],
    name: "Harvester",
    state: "justSpawned",
};
//# sourceMappingURL=role.harvester%20copy.js.map