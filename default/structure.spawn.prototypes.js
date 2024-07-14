"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memory_creep_1 = require("./memory.creep");
let initStructureSpawnPrototypes;
initStructureSpawnPrototypes = () => {
    StructureSpawn.prototype.spawnTypeCreep = (body, spawn, creepType, flagId) => {
        // if(maxSize){
        //     let room = spawn.room
        //     let energyBody = 0
        //     for(let i = 0; i < body.length;i++){
        //         energyBody = energyBody + BODYPART_COST[body[i]]
        //     }
        //     let availableEnergy = spawn.room.energyCapacityAvailable-energyBody
        //     let costBodyAddition = 0
        //     for (let i = 0; i < creepType.body.length;i++){
        //         costBodyAddition = costBodyAddition + BODYPART_COST[creepType.body[i]]
        //     }
        //     //console.log(availableEnergy/costBodyAddition)
        // }
        if (creepType.role == memory_creep_1.default.MINER || creepType.role == memory_creep_1.default.BUILDER) {
            var spawnCreepReturn = spawn.spawnCreep(body, creepType.name + Game.time, { memory: { role: creepType.role, state: creepType.state, flagId: flagId, base: spawn.room.name } });
        }
        else {
            var spawnCreepReturn = spawn.spawnCreep(body, creepType.name + Game.time, { memory: { role: creepType.role, state: creepType.state, base: spawn.room.name } });
        }
        return spawnCreepReturn;
    };
};
exports.default = initStructureSpawnPrototypes;
//# sourceMappingURL=structure.spawn.prototypes.js.map