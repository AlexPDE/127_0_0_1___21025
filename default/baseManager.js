"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSpawnRequest = void 0;
const _ = require("lodash");
const memory_creep_1 = require("./memory.creep");
const role_upgrader_1 = require("./role.upgrader");
const role_builder_1 = require("./role.builder");
const role_miner_1 = require("./role.miner");
const role_Hauler_1 = require("./role.Hauler");
const energyRequestFlagTypes_1 = require("./energyRequestFlagTypes");
let baseManager;
let initBaseManager;
let addBaseFlag;
let addSourceFlagsForRoom;
let removeSourceFlag;
let addEnergyRequestFlag;
let addSpawnRequest;
let dynamicSpawn;
let addUpgraderFlag;
let removeEnergyRequestFlag;
let addConstructionFlag;
let removeConstructionFlag;
dynamicSpawn = (baseRoom) => {
    let spawning = false;
    let request = Memory.baseManager[baseRoom.name].RecquestesSpawns;
    let i = 0;
    if (request[0]) {
        for (i; i < request.length; i++) {
            if (!spawning) {
                let spawn = baseRoom.find(FIND_MY_SPAWNS)[0];
                let ret = -1;
                if (request[i].role == memory_creep_1.default.MINER && !spawning) {
                    ret = spawn.spawnTypeCreep(request[i].maxSize, spawn, role_miner_1.typeMiner, request[i].target);
                }
                if (request[i].role == memory_creep_1.default.HAULER && !spawning) {
                    let a;
                    ret = spawn.spawnTypeCreep(request[i].maxSize, spawn, role_Hauler_1.typeHauler);
                }
                if (request[i].role == memory_creep_1.default.BUILDER && !spawning) {
                    ret = spawn.spawnTypeCreep(request[i].maxSize, spawn, role_builder_1.typeBuilder, request[i].target);
                }
                if (request[i].role == memory_creep_1.default.UPGRADER && !spawning) {
                    ret = spawn.spawnTypeCreep(request[i].maxSize, spawn, role_upgrader_1.typeUpgrader);
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
exports.addSpawnRequest = addSpawnRequest = (maxSize, type, baseRoom, target) => {
    if (target) {
        let entry = { maxSize: maxSize, role: type, target: target };
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry);
    }
    else {
        let entry = { maxSize: maxSize, role: type };
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry);
    }
};
addBaseFlag = (spawn) => {
    let flagName = spawn.pos.createFlag(spawn.id, COLOR_GREEN);
    if (flagName != -3 && flagName != -10) {
        Memory.baseManager[spawn.pos.roomName].energyRequests.push(flagName);
        Game.flags[flagName].memory.type = "base";
        spawn.room.memory.baseFlagName = flagName;
    }
};
addSourceFlagsForRoom = (room, baseRoom) => {
    var sources = room.find(FIND_SOURCES);
    for (let source of sources) {
        let baseFlag = Game.flags[baseRoom.memory.baseFlagName];
        if (baseFlag) {
            let path = source.pos.findPathTo(baseFlag, { ignoreCreeps: true });
            let flagName = room.createFlag(path[0].x, path[0].y, source.id, COLOR_ORANGE);
            if ((flagName != -3 && -10) && Memory.baseManager) {
                addSpawnRequest(true, memory_creep_1.default.MINER, baseRoom, flagName);
                addSpawnRequest(false, memory_creep_1.default.HAULER, baseRoom);
                Memory.baseManager[baseRoom.name].sources.push(source.id);
                Game.flags[flagName].memory.hasMiner = false;
                Game.flags[flagName].memory.type = "source";
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
addConstructionFlag = (constructionsSite, baseRoom) => {
    let flagName = constructionsSite.pos.createFlag(constructionsSite.id, COLOR_BROWN);
    Memory.baseManager[baseRoom.name].energyRequests.push(constructionsSite.id);
    if (flagName != -3 && flagName != -10) {
        Game.flags[flagName].memory.energyRequired = constructionsSite.progressTotal;
        Game.flags[flagName].memory.type = "construction";
        Game.flags[flagName].memory.assignedBase = baseRoom.name;
    }
};
addEnergyRequestFlag = (pos, baseRoom, name, type) => {
    let flagName = pos.createFlag(name, COLOR_YELLOW);
    if ((flagName != -3 && -10) && Memory.baseManager) {
        let flag = Game.flags[flagName];
        flag.memory.assignedBase = baseRoom.name;
        flag.memory.type = type;
        Memory.baseManager[baseRoom.name].energyRequests.push(name);
    }
};
removeEnergyRequestFlag = (name) => {
    let flag = Game.flags[name];
    if (flag.memory.assignedBase) {
        for (let i = 0; i < Memory.baseManager[flag.memory.assignedBase].energyRequests.length; i++)
            if (Memory.baseManager[flag.memory.assignedBase].energyRequests[i] == name) {
                Memory.baseManager[flag.memory.assignedBase].energyRequests.splice(i, 1);
            }
    }
    flag.remove();
};
addUpgraderFlag = (baseRoom) => {
    if (baseRoom.controller) {
        let path = baseRoom.controller.pos.findPathTo(Game.flags[baseRoom.name], { ignoreCreeps: true });
        let pos = new RoomPosition(path[0].x, path[0].y, baseRoom.name);
        addEnergyRequestFlag(pos, baseRoom, baseRoom.controller.id, energyRequestFlagTypes_1.default.UPGRADER);
        addSpawnRequest(false, memory_creep_1.default.UPGRADER, baseRoom);
    }
};
initBaseManager = (room) => {
    if (!Memory.baseManager) {
        //initialisation first tick. 
        console.log(`base Memory is initiated, this should only happen on the first tick.`);
        let baseName = room.name;
        let baseRoom = room;
        Memory.baseManager = {
            [baseName]: {
                RCL: 1,
                sources: [],
                energyRequests: [Game.spawns["Spawn1"].id],
                RecquestesSpawns: [],
                strategy: "initiate",
            }
        };
        addBaseFlag(Game.spawns["Spawn1"]);
        //addSpawnRequest(MemoryRole.HAULER,Game.spawns["Spawn1"].room,Game.spawns["Spawn1"].room.name + " base")
        addSourceFlagsForRoom(baseRoom, baseRoom);
        addUpgraderFlag(room);
    }
    else {
        //------------------------------------------this is only for testing puposes--------------------------------------------
    }
};
baseManager = (room) => {
    initBaseManager(room);
    dynamicSpawn(room);
    // ---------------------------------------------- construction Management----------------------------------------------------
    const builder = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.BUILDER);
    let constructionFlag = room.find(FIND_FLAGS, { filter: { color: COLOR_BROWN } })[0];
    let constructionsSite = room.find(FIND_MY_CONSTRUCTION_SITES)[0];
    if (!constructionFlag && constructionsSite) {
        addConstructionFlag(constructionsSite, room);
        if (builder.length == 0) {
            addSpawnRequest(true, memory_creep_1.default.BUILDER, room, constructionsSite.id);
        }
    }
    //------------------------------------- base stategy -----------------------------------
    let strategy = Memory.baseManager[room.name].strategy;
    let spawn = room.find(FIND_MY_SPAWNS)[0];
    switch (strategy) {
        case "initiate":
            Memory.baseManager[room.name].strategy = "pushToRCL2";
        case "pushToRCL2":
            if (room.controller) {
                if (room.controller.level == 2) {
                    Memory.baseManager[room.name].strategy = "planRCL2Base";
                }
            }
            break;
        case "planRCL2Base":
            let extensionPos;
            extensionPos = new RoomPosition(spawn.pos.x + 1, spawn.pos.y, room.name);
            extensionPos.createConstructionSite(STRUCTURE_EXTENSION);
            extensionPos = new RoomPosition(spawn.pos.x + 2, spawn.pos.y, room.name);
            extensionPos.createConstructionSite(STRUCTURE_EXTENSION);
            extensionPos = new RoomPosition(spawn.pos.x + 3, spawn.pos.y, room.name);
            extensionPos.createConstructionSite(STRUCTURE_EXTENSION);
            extensionPos = new RoomPosition(spawn.pos.x + 4, spawn.pos.y, room.name);
            extensionPos.createConstructionSite(STRUCTURE_EXTENSION);
            extensionPos = new RoomPosition(spawn.pos.x + 5, spawn.pos.y, room.name);
            extensionPos.createConstructionSite(STRUCTURE_EXTENSION);
            Memory.baseManager[room.name].strategy = "buildRCL2BaseExtenstions";
            break;
        case "buildRCL2BaseExtenstions":
            if (spawn.room.energyCapacityAvailable == 550) {
                Memory.baseManager[room.name].strategy = "planRCL2UpgraderContainer";
            }
            break;
        case "planRCL2UpgraderContainer":
            let upgraderFlag = spawn.room.find(FIND_FLAGS, { filter: { color: COLOR_YELLOW } })[0];
            if (upgraderFlag) {
                upgraderFlag.pos.createConstructionSite(STRUCTURE_CONTAINER);
            }
            Memory.baseManager[room.name].strategy = "buildRCL2UpgraderContainer";
            break;
        case "buildRCL2UpgraderContainer":
            break;
        case "buildRCL2Base":
            Memory.baseManager[room.name].strategy = "buildRCL2BaseExtenstions";
            break;
        default: console.log(`strategy set in BaseManager for ${room.name} is not defined: ${strategy}`);
    }
};
exports.default = baseManager;
//# sourceMappingURL=baseManager.js.map