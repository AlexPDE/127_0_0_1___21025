"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = require("./analytics");
let roleMiner;
exports.default = roleMiner = {
    run(creep) {
        try {
            let energyPerTick = 0;
            for (let i of creep.body) {
                if (i.type == WORK) {
                    energyPerTick = energyPerTick + 2;
                }
            }
            switch (creep.memory.state) {
                case `justSpawned`:
                    creep.memory.state = "hasNoEnergy";
                    break;
                case `hasNoEnergy`:
                    if (creep.memory.flagId) {
                        var sourceId = creep.memory.flagId;
                        let flag = Game.flags[sourceId];
                        creep.moveTo(flag);
                        if (creep.pos.isEqualTo(Game.flags[sourceId].pos)) {
                            creep.memory.state = "mining";
                        }
                    }
                    else {
                        console.log(`Miner has a flagId in  memory that is not defined`);
                    }
                    break;
                case `mining`:
                    if (creep.memory.flagId) {
                        var sourceId = creep.memory.flagId;
                        let source = Game.getObjectById(sourceId);
                        if (source instanceof Source) {
                            if (creep.harvest(source) === OK) {
                                (0, analytics_1.addEnergyHarvested)(energyPerTick);
                            }
                        }
                        else {
                            console.log(`miner trys to havest something that i snot a source`);
                        }
                    }
                    break;
                case `hasEnergy`:
                    let spawn = creep.room.find(FIND_MY_SPAWNS)[0];
                    if (creep.transfer(spawn, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY)) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.state = "hasNoEnergy";
                    }
                    break;
                default:
                    console.log(`creep ${creep} has the memory state ${creep.memory.state}, this is not defined`);
            }
        }
        catch (error) {
            console.log(`error in role.miner`);
        }
    }
};
//# sourceMappingURL=role.miner.js.map