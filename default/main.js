"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
const role_harvester_1 = require("./role.harvester");
const baseManager_1 = require("./baseManager");
const structure_spawn_prototypes_1 = require("./structure.spawn.prototypes");
const role_upgrader_1 = require("./role.upgrader");
const role_builder_1 = require("./role.builder");
const memory_creep_1 = require("./memory.creep");
function loop() {
    try {
        (0, structure_spawn_prototypes_1.default)();
        console.log(`tick ${Game.time}`);
        (0, baseManager_1.default)(Game.spawns["Spawn1"].room);
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == memory_creep_1.default.HARVESTER) {
                role_harvester_1.default.run(creep);
            }
            if (creep.memory.role == memory_creep_1.default.UPGRADER) {
                role_upgrader_1.default.run(creep);
            }
            if (creep.memory.role == memory_creep_1.default.BUILDER) {
                role_builder_1.default.run(creep);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.loop = loop;
//# sourceMappingURL=main.js.map