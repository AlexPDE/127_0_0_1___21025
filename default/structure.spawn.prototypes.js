"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memory_creep_1 = require("./memory.creep");
let initStructureSpawnPrototypes;
initStructureSpawnPrototypes = () => {
    StructureSpawn.prototype.spawnTypeCreep = (body, spawn, role, flagId) => {
        if (role == memory_creep_1.default.MINER || role == memory_creep_1.default.BUILDER) {
            var spawnCreepReturn = spawn.spawnCreep(body, role + Game.time, { memory: { role: role, state: "justSpawned", flagId: flagId, base: spawn.room.name } });
        }
        else {
            var spawnCreepReturn = spawn.spawnCreep(body, role + Game.time, { memory: { role: role, state: "justSpawned", base: spawn.room.name } });
        }
        return spawnCreepReturn;
    };
};
exports.default = initStructureSpawnPrototypes;
//# sourceMappingURL=structure.spawn.prototypes.js.map