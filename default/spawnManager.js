"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnManager = exports.dynamicSpawn = exports.addSpawnRequest = void 0;
const memory_creep_1 = require("./memory.creep");
const _ = require("lodash");
const creepBodys_1 = require("./creepBodys");
let spawnManager;
let addRequestForFastFiller;
let addSpawnRequest;
let dynamicSpawn;
exports.spawnManager = spawnManager = (room) => {
    console.log("spawnManager is running");
    const fastFillers = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.FASTFILLER);
    if (Memory.baseManager[room.name].fastFillerActive) {
    }
};
exports.dynamicSpawn = dynamicSpawn = (baseRoom) => {
    let spawning = false;
    let request = Memory.baseManager[baseRoom.name].RecquestesSpawns;
    let i = 0;
    if (request[0]) {
        for (i; i < request.length; i++) {
            if (!spawning) {
                let spawn = baseRoom.find(FIND_MY_SPAWNS)[0];
                let ret = -1;
                if (request[i].role == memory_creep_1.default.MINER && !spawning) {
                    ret = spawn.spawnTypeCreep(request[i].body, spawn, creepBodys_1.typeMiner, request[i].target);
                }
                if (request[i].role == memory_creep_1.default.HAULER && !spawning) {
                    let a;
                    ret = spawn.spawnTypeCreep(request[i].body, spawn, creepBodys_1.typeHauler);
                }
                if (request[i].role == memory_creep_1.default.BUILDER && !spawning) {
                    ret = spawn.spawnTypeCreep(request[i].body, spawn, creepBodys_1.typeBuilder, request[i].target);
                }
                if (request[i].role == memory_creep_1.default.UPGRADER && !spawning) {
                    ret = spawn.spawnTypeCreep(request[i].body, spawn, creepBodys_1.typeUpgrader);
                }
                if (request[i].role == memory_creep_1.default.SCOUT && !spawning) {
                    ret = spawn.spawnTypeCreep(request[i].body, spawn, creepBodys_1.typeScout);
                }
                if (ret == OK) {
                    spawning = true;
                    Memory.baseManager[baseRoom.name].RecquestesSpawns.splice(i, 1);
                    let requiredEnergy = baseRoom.energyCapacityAvailable;
                    Game.flags[baseRoom.memory.baseFlagName].memory.energyRequired = requiredEnergy;
                }
            }
        }
    }
};
exports.addSpawnRequest = addSpawnRequest = (body, role, baseRoom, target) => {
    if (target) {
        let entry = { body: body, role: role, target: target };
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry);
    }
    else {
        let entry = { body: body, role };
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry);
    }
};
addRequestForFastFiller = (size, typeFastfiller, baseRoom) => {
    switch (size) {
        case creepBodys_1.default.MAXFASTFILLER:
            addSpawnRequest(creepBodys_1.default.MAXFASTFILLER, typeFastfiller, baseRoom);
            break;
    }
};
//# sourceMappingURL=spawnManager.js.map