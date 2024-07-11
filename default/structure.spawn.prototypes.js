"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memory_creep_1 = require("./memory.creep");
let initStructureSpawnPrototypes;
initStructureSpawnPrototypes = () => {
    StructureSpawn.prototype.spawnTypeCreep = (spawn, creepType, targetId) => {
        if (creepType.role == memory_creep_1.default.MINER || creepType.role == memory_creep_1.default.BUILDER) {
            var spawnCreepReturn = spawn.spawnCreep(creepType.body, creepType.name + Game.time, { memory: { role: creepType.role, state: creepType.state, targetId: targetId, base: spawn.room.name } });
        }
        else {
            var spawnCreepReturn = spawn.spawnCreep(creepType.body, creepType.name + Game.time, { memory: { role: creepType.role, state: creepType.state, base: spawn.room.name } });
        }
        return spawnCreepReturn;
    };
};
exports.default = initStructureSpawnPrototypes;
//# sourceMappingURL=structure.spawn.prototypes.js.map