"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const memory_creep_1 = require("./memory.creep");
const role_builder_1 = require("./role.builder");
const role_miner_1 = require("./role.miner");
const role_Hauler_1 = require("./role.Hauler");
let baseManager;
let initBaseManager;
let addBaseFlag;
let addSourceFlagsForRoom;
let removeSourceFlag;
let addEnergyRequestFlag;
let addSpawnRequest;
let dynamicSpawn;
dynamicSpawn = (baseRoom) => {
    let spawning = false;
    let request = Memory.baseManager[baseRoom.name].RecquestesSpawns;
    let i = 0;
    if (request[0]) {
        for (i; i < request.length; i++) {
            if (!spawning) {
                let spawn = baseRoom.find(FIND_MY_SPAWNS)[0];
                let ret = -1;
                if (request[i].role == memory_creep_1.default.MINER) {
                    ret = spawn.spawnTypeCreep(spawn, role_miner_1.typeMiner, request[i].target);
                }
                if (request[i].role == memory_creep_1.default.HAULER) {
                    ret = spawn.spawnTypeCreep(spawn, role_Hauler_1.typeHauler);
                }
                if (ret == OK) {
                    spawning = true;
                    Memory.baseManager[baseRoom.name].RecquestesSpawns.splice(i, 1);
                }
            }
        }
    }
};
addBaseFlag = (pos) => {
    pos.createFlag(pos.roomName + " base", COLOR_GREEN);
};
addSpawnRequest = (type, baseRoom, target) => {
    if (target) {
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push({ role: type, target });
    }
    else {
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push({ role: type });
    }
};
addSourceFlagsForRoom = (room, baseRoom) => {
    var sources = room.find(FIND_SOURCES);
    for (let source of sources) {
        let baseFlagName = baseRoom.name + " base";
        let baseFlag = Game.flags[baseFlagName];
        if (baseFlag) {
            let path = source.pos.findPathTo(baseFlag, { ignoreCreeps: true });
            let flagName = room.createFlag(path[0].x, path[0].y, source.id, COLOR_ORANGE);
            addSpawnRequest(memory_creep_1.default.MINER, baseRoom, flagName);
            Memory.baseManager;
            if ((flagName != -3 && -10) && Memory.baseManager) {
                Memory.baseManager[baseRoom.name].sources.push(source.id);
                Game.flags[flagName].memory.hasMiner = false;
                Game.flags[flagName].pos.createConstructionSite(STRUCTURE_CONTAINER);
            }
        }
    }
};
removeSourceFlag = (flag, baseRoom) => {
    if (Memory.baseManager) {
        let memEntry;
        if (flag) {
            flag.remove();
        }
        else {
            console.log(`remove Source Flag is trying to remove flag ${flag} that does't exist.`);
        }
    }
};
addEnergyRequestFlag = (pos, baseRoom, name, type) => {
    let flagName = pos.createFlag(name, COLOR_YELLOW);
    let flag = Game.flags[flagName];
    flag.memory.assignedBase = baseRoom.name;
    flag.memory.type = type;
};
initBaseManager = (room) => {
    if (!Memory.baseManager) {
        //initialisation first tick. 
        console.log(`base Memory is initiated, this should only happen on the first tick.`);
        let baseName = Game.spawns["Spawn1"].room.name;
        let baseRoom = Game.spawns["Spawn1"].room;
        Memory.baseManager = {
            [baseName]: {
                sources: [],
                energyRequestsFlags: [],
                RecquestesSpawns: []
            }
        };
        addBaseFlag(Game.spawns["Spawn1"].pos);
        addSpawnRequest(memory_creep_1.default.HAULER, Game.spawns["Spawn1"].room, Game.spawns["Spawn1"].room.name + " base");
        addSourceFlagsForRoom(baseRoom, baseRoom);
    }
    else {
        //------------------------------------------this is only for testing puposes--------------------------------------------
        // removeSourceFlag(Game.flags["26f20772347f879"],Game.spawns["Spawn1"].room)
        // removeSourceFlag(Game.flags["71ac0772347ffe6"],Game.spawns["Spawn1"].room)
        // delete Memory.baseManager
    }
    //--------------------------------------------------------------------------------------------------------
    var baseflag = room.find(FIND_FLAGS, { filter: { color: COLOR_GREEN } });
    if (!baseflag[0]) {
        console.log(`there is no base flag`);
        var sourceflags = room.find(FIND_FLAGS, { filter: { color: COLOR_ORANGE } });
        for (var i in sourceflags) {
            sourceflags[i].updateEnergySupplyFlag(sourceflags[i]);
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
    }
};
baseManager = (room) => {
    initBaseManager(room);
    dynamicSpawn(room);
    const harvester = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.HARVESTER);
    const upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.UPGRADER);
    const builder = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.BUILDER);
    const miner = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.MINER);
    let spawn = room.find(FIND_MY_SPAWNS)[0];
    var baseflag = room.find(FIND_FLAGS, { filter: { color: COLOR_GREEN } })[0];
    // if(!spawn.spawning){
    //     if(baseflag){
    //         if(baseflag.memory.BaseManager){
    //             let i: keyof typeof baseflag.memory.BaseManager.requestedCreeps
    //             for(i in baseflag.memory.BaseManager.requestedCreeps){
    //                 var request = baseflag.memory.BaseManager.requestedCreeps[i]
    //                 for (var k in request){
    //                     if( i == "minerRequest"){
    //                         console.log(`miner is requested for source ${request}`)
    //                         var ret = spawn.spawnTypeCreep(spawn,typeMiner,request[k])
    //                         if(ret===OK){
    //                             var index = request.indexOf(request[k]);
    //                             if (index !== -1) {
    //                                 baseflag.memory.BaseManager.requestedCreeps[i].splice(index, 1);
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }else
    // if (harvester.length <1){
    //     console.log(`trying to spawn harvester currently ${harvester.length} exist`)
    //     spawn.spawnTypeCreep(spawn,typeHarvester)
    // }else
    // if (miner.length <1){
    //     console.log(`trying to spawn upgrader currently ${builder.length} exist`)
    //     spawn.spawnTypeCreep(spawn,typeMiner)
    // }else
    // if (upgrader.length <1){
    //     console.log(`trying to spawn upgrader currently ${upgrader.length} exist`)
    //     spawn.spawnTypeCreep(spawn,typeUpgrader)
    // }else
    if (builder.length < 1) {
        console.log(`trying to spawn upgrader currently ${builder.length} exist`);
        spawn.spawnTypeCreep(spawn, role_builder_1.typeBuilder);
    }
};
exports.default = baseManager;
//# sourceMappingURL=baseManager.js.map