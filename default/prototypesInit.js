"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structure_spawn_prototypes_1 = require("./structure.spawn.prototypes");
const creep_prototype_1 = require("./creep.prototype");
let initPrototypes;
initPrototypes = () => {
    (0, structure_spawn_prototypes_1.default)();
    (0, creep_prototype_1.default)();
};
exports.default = initPrototypes;
//# sourceMappingURL=prototypesInit.js.map