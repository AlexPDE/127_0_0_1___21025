"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const memory_creep_1 = require("./memory.creep");
const role_harvester_1 = require("./role.harvester");
const role_upgrader_1 = require("./role.upgrader");
const role_builder_1 = require("./role.builder");
let baseManager;
baseManager = (room) => {
    console.log(`base Manager is running`);
    const harvester = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.HARVESTER);
    const upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.UPGRADER);
    const builder = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.BUILDER);
    let spawn = room.find(FIND_MY_SPAWNS)[0];
    if (harvester.length < 4) {
        console.log(`trying to spawn harvester currently ${harvester.length} exist`);
        spawn.spawnTypeCreep(spawn, role_harvester_1.typeHarvester);
    }
    else if (upgrader.length < 3) {
        console.log(`trying to spawn upgrader currently ${upgrader.length} exist`);
        spawn.spawnTypeCreep(spawn, role_upgrader_1.typeUpgrader);
    }
    else if (builder.length < 1) {
        console.log(`trying to spawn upgrader currently ${builder.length} exist`);
        spawn.spawnTypeCreep(spawn, role_builder_1.typeBuilder);
    }
};
exports.default = baseManager;
//# sourceMappingURL=baseManager.js.map