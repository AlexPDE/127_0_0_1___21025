"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let initPrototypes;
initPrototypes = () => {
    StructureSpawn.prototype.spawnTypeCreep = (spawn, creepType) => {
        spawn.spawnCreep(creepType.body, creepType.name, { memory: { role: creepType.role, state: creepType.state } });
    };
};
exports.default = initPrototypes;
//# sourceMappingURL=structure.spawn.prototypes.js.map