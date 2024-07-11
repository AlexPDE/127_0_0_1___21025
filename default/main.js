"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
const role_harvester_1 = require("./role.harvester");
const baseManager_1 = require("./baseManager");
const prototypesInit_1 = require("./prototypesInit");
const role_upgrader_1 = require("./role.upgrader");
const role_builder_1 = require("./role.builder");
const memory_creep_1 = require("./memory.creep");
const role_miner_1 = require("./role.miner");
const role_Hauler_1 = require("./role.Hauler");
function loop() {
    try {
        (0, prototypesInit_1.default)();
        console.log(`-----------------------tick ${Game.time}-----------------------------------`);
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
            if (creep.memory.role == memory_creep_1.default.MINER) {
                role_miner_1.default.run(creep);
            }
            if (creep.memory.role == memory_creep_1.default.HAULER) {
                role_Hauler_1.default.run(creep);
            }
            //testing Functions here--------------------------
        }
    }
    catch (error) {
        console.log(`${error}`);
    }
}
exports.loop = loop;
//# sourceMappingURL=main.js.map