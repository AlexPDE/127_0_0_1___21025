"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeUpgrader = void 0;
let roleUpgrader;
exports.default = roleUpgrader = {
    run(creep) {
        try {
            console.log(creep.memory.state);
            switch (creep.memory.state) {
                case `justSpawned`:
                    console.log("new creep just spawned");
                    creep.memory.state = "hasNoEnergy";
                    break;
                case `hasNoEnergy`:
                    let source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
                    console.log(creep.harvest(source));
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        console.log("test2");
                        creep.moveTo(source);
                    }
                    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.state = "hasEnergy";
                    }
                    break;
                case `hasEnergy`:
                    let controller = creep.room.controller;
                    if (controller) {
                        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(controller);
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
            console.log(`error in role.harvester`);
        }
    }
};
exports.typeUpgrader = {
    role: "upgrader",
    body: [MOVE, WORK, CARRY],
    name: "Upgrader" + Game.time,
    state: "justSpawned",
};
//# sourceMappingURL=role.upgrader%20copy.js.map