"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeBuilder = void 0;
let roleBuilder;
exports.default = roleBuilder = {
    run(creep) {
        try {
            switch (creep.memory.state) {
                case `justSpawned`:
                    console.log("new creep just spawned");
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
                    let constructionSite = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
                    if (constructionSite) {
                        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(constructionSite);
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
            console.log(`error in role.`);
        }
    }
};
exports.typeBuilder = {
    role: "builder",
    body: [MOVE, WORK, CARRY],
    name: "Builder " + Game.time,
    state: "justSpawned",
};
//# sourceMappingURL=role.builder.js.map