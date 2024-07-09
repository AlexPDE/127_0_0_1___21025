"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeHarvester = void 0;
let roleHarvester;
exports.default = roleHarvester = {
    run(creep) {
        try {
            switch (creep.memory.state) {
                case `justSpawned`:
                    console.log("new creep just spawned");
                    creep.memory.state = "hasNoEnergy";
                    break;
                case `hasNoEnergy`:
                    creep.getEnergy(creep);
                    break;
                case `hasEnergy`:
                    let spawn = creep.room.find(FIND_MY_SPAWNS)[0];
                    if (creep.transfer(spawn, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY)) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.state = "hasNoEnergy";
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
    name: "Harvester" + Game.time,
    state: "justSpawned",
};
//# sourceMappingURL=role.harvester.js.map