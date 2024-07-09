"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let initStructureSpawnPrototypes;
initStructureSpawnPrototypes = () => {
    StructureSpawn.prototype.spawnTypeCreep = (spawn, creepType) => {
        console.log(`creepType.name = ${creepType.name}`);
        var spawnCreepReturn = spawn.spawnCreep(creepType.body, creepType.name, { memory: { role: creepType.role, state: creepType.state } });
        console.log(`spawnCreepReturn = ${spawnCreepReturn}`);
    };
};
exports.default = initStructureSpawnPrototypes;
//# sourceMappingURL=structure.spawn.prototypes.js.map