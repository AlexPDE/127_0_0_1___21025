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
                    ret = spawn.spawnTypeCreep(spawn, role_miner_1.typeMiner, request[i].target);
                }
                if (request[i].role == memory_creep_1.default.HAULER && !spawning) {
                    ret = spawn.spawnTypeCreep(spawn, role_Hauler_1.typeHauler);
                }
                if (request[i].role == memory_creep_1.default.BUILDER && !spawning) {
                    ret = spawn.spawnTypeCreep(spawn, role_builder_1.typeBuilder, request[i].target);
                }
                if (request[i].role == memory_creep_1.default.UPGRADER && !spawning) {
                    ret = spawn.spawnTypeCreep(spawn, role_upgrader_1.typeUpgrader);
                }
                if (ret == OK) {
                    spawning = true;
                    Memory.baseManager[baseRoom.name].RecquestesSpawns.splice(i, 1);
                    let requiredEnergy = baseRoom.energyCapacityAvailable;
                    console.log(baseRoom.energyCapacityAvailable, baseRoom.energyAvailable, requiredEnergy);
                    Game.flags[baseRoom.memory.baseFlagName].memory.energyRequired = requiredEnergy;
                }
            }
        }
    }
};
exports.addSpawnRequest = addSpawnRequest = (type, baseRoom, target) => {
    if (target) {
        let entry = { role: type, target: target };
        Memory.baseManager[baseRoom.name].RecquestesSpawns.push(entry);
    }
    else {
        let entry = { role: type };
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
    console.log(room);
    var sources = room.find(FIND_SOURCES);
    console.log(sources);
    for (let source of sources) {
        let baseFlag = Game.flags[baseRoom.memory.baseFlagName];
        if (baseFlag) {
            let path = source.pos.findPathTo(baseFlag, { ignoreCreeps: true });
            let flagName = room.createFlag(path[0].x, path[0].y, source.id, COLOR_ORANGE);
            if ((flagName != -3 && -10) && Memory.baseManager) {
                addSpawnRequest(memory_creep_1.default.MINER, baseRoom, flagName);
                addSpawnRequest(memory_creep_1.default.HAULER, baseRoom);
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
        addSpawnRequest(memory_creep_1.default.UPGRADER, baseRoom);
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
                sources: [],
                energyRequests: [Game.spawns["Spawn1"].id],
                RecquestesSpawns: []
            }
        };
        addBaseFlag(Game.spawns["Spawn1"]);
        //addSpawnRequest(MemoryRole.HAULER,Game.spawns["Spawn1"].room,Game.spawns["Spawn1"].room.name + " base")
        addSourceFlagsForRoom(baseRoom, baseRoom);
        addUpgraderFlag(room);
        Flag;
    }
    else {
        //------------------------------------------this is only for testing puposes--------------------------------------------
        //addSpawnRequest(MemoryRole.HAULER,Game.rooms["W8N3"])
        //addUpgraderFlag(Game.rooms["W8N3"])
        //removeEnergyRequestFlag("1bc30772347c388")
        // removeSourceFlag(Game.flags["26f20772347f879"],Game.spawns["Spawn1"].room)
        // removeSourceFlag(Game.flags["71ac0772347ffe6"],Game.spawns["Spawn1"].room)
        // delete Memory.baseManager
    }
    //--------------------------------------------------------------------------------------------------------
    //     var baseflag = room.find(FIND_FLAGS,{filter:{color:COLOR_GREEN}})
    //     if(!baseflag[0]){
    //         console.log(`there is no base flag`)
    //     var sourceflags = room.find(FIND_FLAGS,{filter:{color:COLOR_ORANGE}})
    //             for ( var i in sourceflags){
    //                 sourceflags[i].updateEnergySupplyFlag(sourceflags[i])
    //             }
    //         var demandFlags = room.find(FIND_FLAGS,{filter:{color:COLOR_YELLOW}})
    //         if(!demandFlags[0]){
    //             if(room.controller){
    //                 let path:PathStep[] = room.controller.pos.findPathTo(baseflag[0],{ignoreCreeps:true})
    //                 let flagName = room.createFlag(path[0].x,path[0].y,room.controller.id, COLOR_YELLOW)
    //                 Game.flags[flagName].memory.energyRequired = 0
    //                 Game.flags[flagName].memory.scheduledDeliverys = []
    //                 if((flagName!= -3 && -10)&&Memory.baseManager){
    //                     addSpawnRequest(MemoryRole.UPGRADER,room,flagName)
    //                 }
    //             }        
    //         }
    //     }
};
baseManager = (room) => {
    initBaseManager(room);
    dynamicSpawn(room);
    const harvester = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.HARVESTER);
    const upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.UPGRADER);
    const miner = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.MINER);
    const builder = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.BUILDER);
    let constructionFlag = room.find(FIND_FLAGS, { filter: { color: COLOR_BROWN } })[0];
    let constructionsSite = room.find(FIND_MY_CONSTRUCTION_SITES)[0];
    if (!constructionFlag && constructionsSite) {
        addConstructionFlag(constructionsSite, room);
        if (builder.length == 0) {
            addSpawnRequest(memory_creep_1.default.BUILDER, room, constructionsSite.id);
        }
    }
    // let spawn:StructureSpawn = room.find(FIND_MY_SPAWNS)[0];
    // var baseflag = room.find(FIND_FLAGS,{filter:{color:COLOR_GREEN}})[0]
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
    //  if (builder.length <1){
    //      console.log(`trying to spawn upgrader currently ${builder.length} exist`)
    //     spawn.spawnTypeCreep(spawn,typeBuilder)
    //  }
};
exports.default = baseManager;
//# sourceMappingURL=baseManager.js.map