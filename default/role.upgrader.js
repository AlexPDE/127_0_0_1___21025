"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = require("./analytics");
let roleUpgrader;
exports.default = roleUpgrader = {
    run(creep) {
        try {
            let energyPerTick = 0;
            for (let i of creep.body) {
                if (i.type == WORK) {
                    energyPerTick = energyPerTick + 1;
                }
            }
            switch (creep.memory.state) {
                case `justSpawned`:
                    creep.memory.state = "hasNoEnergy";
                    break;
                case `hasNoEnergy`:
                    let source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.state = "hasEnergy";
                    }
                    break;
                case `hasEnergy`:
                    let controller = creep.room.controller;
                    if (controller) {
                        let RetUpgrade = creep.upgradeController(controller);
                        if (RetUpgrade === ERR_NOT_IN_RANGE) {
                            creep.moveTo(controller);
                        }
                        if (RetUpgrade === OK) {
                            (0, analytics_1.addSinkUpgrading)(energyPerTick);
                        }
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
            console.log(`error in role.upgrader`);
        }
    }
};
//# sourceMappingURL=role.upgrader.js.map