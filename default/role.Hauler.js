"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeHauler = void 0;
let roleHauler;
exports.default = roleHauler = {
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
                    break;
                default:
                    console.log(`creep ${creep} has the memory state ${creep.memory.state}, this is not defined`);
            }
        }
        catch (error) {
            console.log(`error in role.hauler`);
        }
    }
};
exports.typeHauler = {
    role: "hauler",
    body: [MOVE, CARRY],
    name: "Hauler" + Game.time,
    state: "justSpawned",
};
//# sourceMappingURL=role.Hauler.js.map