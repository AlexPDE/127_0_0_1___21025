"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let initStructureSpawnPrototypes;
initStructureSpawnPrototypes = () => {
    StructureSpawn.prototype.spawnTypeCreep = (spawn, creepType) => {
        spawn.spawnCreep(creepType.body, creepType.name, { memory: { role: creepType.role, state: creepType.state } });
    };
};
exports.default = initStructureSpawnPrototypes;
//# sourceMappingURL=structure.spawn.prototypes.js.map