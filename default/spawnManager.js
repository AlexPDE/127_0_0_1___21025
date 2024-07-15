"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnManager = exports.dynamicSpawn = exports.addSpawnRequest = exports.addRequestForHauler = exports.addRequestForMiner = exports.addRequestForFastFiller = void 0;
const memory_creep_1 = require("./memory.creep");
const _ = require("lodash");
const creepBodys_1 = require("./creepBodys");
let spawnManager;
let addRequestForFastFiller;
let addSpawnRequest;
let dynamicSpawn;
let addMaxSizeRequest;
let addRequestForMiner;
let addRequestForHauler;
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
                let ret;
                if (request[i].target) {
                    ret = spawn.spawnTypeCreep(request[i].body, spawn, request[i].role, request[i].target);
                }
                else {
                    ret = spawn.spawnTypeCreep(request[i].body, spawn, request[i].role, spawn);
                }
                // if(request[i].role == MemoryRole.MINER &&!spawning){
                //     ret = spawn.spawnTypeCreep(request[i].body,spawn,typeMiner,request[i].target)
                // }
                // if(request[i].role == MemoryRole.HAULER &&!spawning){
                //     let a:spawnRequestType
                //     ret = spawn.spawnTypeCreep(request[i].body,spawn,typeHauler)
                // }
                // if(request[i].role == MemoryRole.BUILDER &&!spawning){
                //     ret = spawn.spawnTypeCreep(request[i].body,spawn,typeBuilder,request[i].target)
                // }
                // if(request[i].role == MemoryRole.UPGRADER &&!spawning){
                //     ret = spawn.spawnTypeCreep(request[i].body,spawn,typeUpgrader)
                // }
                // if(request[i].role == MemoryRole.SCOUT &&!spawning){
                //     ret = spawn.spawnTypeCreep(request[i].body,spawn,typeScout)
                // }
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
    console.log("addSpawnRequest is running");
    console.log("target", target);
    if (target) {
        console.log("add spawn has target ", target);
        let entry = { body: body, role: role, target: target };
        console.log("add spawn has targer ");
        console.log("Memory.baseManager[baseRoom.name] ", Memory.baseManager[baseRoom.name]);
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry);
    }
    else {
        let entry = { body: body, role };
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry);
    }
};
exports.addRequestForMiner = addRequestForMiner = (baseRoom, target) => {
    let body = addMaxSizeRequest(creepBodys_1.typeMiner, baseRoom);
    console.log("typeMiner", creepBodys_1.typeMiner.role);
    addSpawnRequest(body, creepBodys_1.typeMiner.role, baseRoom, target);
};
exports.addRequestForHauler = addRequestForHauler = (size, baseRoom) => {
    switch (size) {
        case "min":
            addSpawnRequest(creepBodys_1.typeHauler.baseBody, creepBodys_1.typeHauler.role, baseRoom);
    }
};
exports.addRequestForFastFiller = addRequestForFastFiller = (size, baseRoom) => {
    switch (size) {
        case creepBodys_1.default.MAXFASTFILLER:
            let body = addMaxSizeRequest(creepBodys_1.typeFastfiller, baseRoom);
            addSpawnRequest(body, creepBodys_1.typeFastfiller.role, baseRoom);
            break;
        default: console.log(`in addRequestForFastFiller a bodyType is asked for that doesn´t exist ${size}`);
    }
};
addMaxSizeRequest = (creepBodyType, baseRoom) => {
    let body = [];
    let bodyToAdd = [];
    let basebody = creepBodyType.baseBody;
    let costBody = 0;
    let costBodyToAdd = 0;
    for (let i = 0; i < basebody.length; i++) {
        body.push(basebody[i]);
        costBody = costBody + BODYPART_COST[basebody[i]];
    }
    let addBody = creepBodyType.body;
    for (let k = 0; k < addBody.length; k++) {
        bodyToAdd.push(addBody[k]);
        costBodyToAdd = costBodyToAdd + BODYPART_COST[addBody[k]];
    }
    let numbBodyToAddMaxRoom = Math.floor((baseRoom.energyCapacityAvailable - costBody) / costBodyToAdd);
    let numbBodyToAdd = Math.min(numbBodyToAddMaxRoom, creepBodyType.max);
    for (let i = 0; i < numbBodyToAdd; i++) {
        for (let k = 0; k < bodyToAdd.length; k++) {
            body.push(bodyToAdd[k]);
        }
    }
    return body;
};
//# sourceMappingURL=spawnManager.js.map