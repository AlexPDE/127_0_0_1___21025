"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeHauler = void 0;
let roleHauler;
exports.default = roleHauler = {
    run(creep) {
        try {
            switch (creep.memory.state) {
                case `justSpawned`:
                    creep.memory.state = "hasNoEnergy";
                    break;
                case `hasNoEnergy`:
                    creep.getEnergy(creep);
                    break;
                case `hasEnergy`:
                    creep.deliverEnergy(creep);
                    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.state = "hasNoEnergy";
                        delete creep.memory.flagId;
                    }
                    break;
                default:
                    console.log(`creep ${creep} has the memory state ${creep.memory.state}, this is not defined`);
            }
        }
        catch (error) {
            console.log(`error in role.hauler ${error}`);
        }
    }
};
exports.typeHauler = {
    role: "hauler",
    baseBody: [MOVE, CARRY],
    body: [MOVE, CARRY],
    name: "Hauler",
    state: "justSpawned",
};
//# sourceMappingURL=role.Hauler.js.map