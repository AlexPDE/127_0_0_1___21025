"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const memory_creep_1 = require("./memory.creep");
const role_harvester_1 = require("./role.harvester");
const role_upgrader_1 = require("./role.upgrader");
const role_builder_1 = require("./role.builder");
let baseManager;
let initBaseManager;
initBaseManager = (room) => {
    var baseflag = room.find(FIND_FLAGS, { filter: { color: COLOR_GREEN } });
    if (!baseflag[0]) {
        console.log(`there is no base flag`);
        var spawn = room.find(FIND_MY_SPAWNS)[0];
        console.log(spawn);
        if (spawn) {
            let baseFlagName = spawn.pos.createFlag(spawn.name, COLOR_GREEN);
            let baseflag = Game.flags[baseFlagName];
            let flagMemory;
            baseflag.memory.BaseManager = {
                requiredScreeps: {
                    miner: 0
                }
            };
        }
    }
    var sourceflags = room.find(FIND_FLAGS, { filter: { color: COLOR_ORANGE } });
    if (!sourceflags[0]) {
        console.log(`there is no source flag`);
        var sources = room.find(FIND_SOURCES);
        for (let source of sources) {
            var baseflag = room.find(FIND_FLAGS, { filter: { color: COLOR_GREEN } });
            if (baseflag) {
                let path = source.pos.findPathTo(baseflag[0], { ignoreCreeps: true });
                let flagName = room.createFlag(path[0].x, path[0].y, source.id, COLOR_ORANGE);
                Game.flags[flagName].pos.createConstructionSite(STRUCTURE_CONTAINER);
                Game.flags[flagName].memory.hasMiner = false;
                Game.flags[flagName].memory.assignedBase = baseflag[0].name;
                if (baseflag[0].memory.BaseManager) {
                    baseflag[0].memory.BaseManager.requiredScreeps.miner = baseflag[0].memory.BaseManager.requiredScreeps.miner + 1;
                }
            }
        }
    }
};
baseManager = (room) => {
    initBaseManager(room);
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