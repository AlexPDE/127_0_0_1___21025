"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const memory_creep_1 = require("./memory.creep");
const role_harvester_1 = require("./role.harvester");
const role_upgrader_1 = require("./role.upgrader");
const role_builder_1 = require("./role.builder");
const role_miner_1 = require("./role.miner");
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
                },
                requestedCreeps: {
                    minerRequest: [],
                    upgraderRequest: [],
                },
            };
            baseflag.memory.energyGainRate = 0;
            baseflag.memory.energyRequired = 0;
            baseflag.memory.scheduledDeliverys = [];
            baseflag.memory.energyTransportTicket = [];
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
                    if (typeof (flagName) === 'string') {
                        console.log(flagName);
                        baseflag[0].memory.BaseManager.requestedCreeps.minerRequest.push(flagName);
                    }
                }
            }
        }
    }
    else {
        for (var i in sourceflags) {
            sourceflags[i].updateEnergySupply(sourceflags[i]);
        }
    }
    var demandFlags = room.find(FIND_FLAGS, { filter: { color: COLOR_YELLOW } });
    if (!demandFlags[0]) {
        if (room.controller) {
            let path = room.controller.pos.findPathTo(baseflag[0], { ignoreCreeps: true });
            let flagName = room.createFlag(path[0].x, path[0].y, room.controller.id, COLOR_YELLOW);
            Game.flags[flagName].memory.energyRequired = 0;
            Game.flags[flagName].memory.scheduledDeliverys = [];
        }
    }
};
baseManager = (room) => {
    initBaseManager(room);
    const harvester = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.HARVESTER);
    const upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.UPGRADER);
    const builder = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.BUILDER);
    const miner = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.MINER);
    let spawn = room.find(FIND_MY_SPAWNS)[0];
    var baseflag = room.find(FIND_FLAGS, { filter: { color: COLOR_GREEN } })[0];
    if (!spawn.spawning) {
        if (baseflag) {
            if (baseflag.memory.BaseManager) {
                let i;
                for (i in baseflag.memory.BaseManager.requestedCreeps) {
                    var request = baseflag.memory.BaseManager.requestedCreeps[i];
                    for (var k in request) {
                        if (i == "minerRequest") {
                            console.log(`miner is requested for source ${request}`);
                            var ret = spawn.spawnTypeCreep(spawn, role_miner_1.typeMiner, request[k]);
                            if (ret === OK) {
                                var index = request.indexOf(request[k]);
                                if (index !== -1) {
                                    baseflag.memory.BaseManager.requestedCreeps[i].splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (harvester.length < 1) {
            console.log(`trying to spawn harvester currently ${harvester.length} exist`);
            spawn.spawnTypeCreep(spawn, role_harvester_1.typeHarvester);
        }
        else if (miner.length < 1) {
            console.log(`trying to spawn upgrader currently ${builder.length} exist`);
            spawn.spawnTypeCreep(spawn, role_miner_1.typeMiner);
        }
        else if (upgrader.length < 1) {
            console.log(`trying to spawn upgrader currently ${upgrader.length} exist`);
            spawn.spawnTypeCreep(spawn, role_upgrader_1.typeUpgrader);
        }
        else if (builder.length < 1) {
            console.log(`trying to spawn upgrader currently ${builder.length} exist`);
            spawn.spawnTypeCreep(spawn, role_builder_1.typeBuilder);
        }
    }
};
exports.default = baseManager;
//# sourceMappingURL=baseManager.js.map