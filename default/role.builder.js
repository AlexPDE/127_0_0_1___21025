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
                    creep.memory.state = "buildFlag";
                    break;
                case `buildFlag`:
                    if (creep.memory.targetId) {
                        let flag = Game.flags[creep.memory.targetId];
                        flag.memory.assignedBuilder = creep.id;
                        let constructionSite = Game.getObjectById(creep.memory.targetId);
                        if (constructionSite instanceof ConstructionSite) {
                            let ret = creep.build(constructionSite);
                            if (!creep.pos.inRangeTo(constructionSite, 3)) {
                                creep.moveTo(constructionSite);
                            }
                        }
                        else {
                            console.log(`constructionSite is finished`, flag);
                            flag.removeConstructionFlag(flag);
                            delete creep.memory.targetId;
                        }
                    }
                    else {
                        let constructionFlag = creep.room.find(FIND_FLAGS, { filter: { color: COLOR_BROWN } })[0];
                        if (constructionFlag) {
                            creep.memory.targetId = constructionFlag.name;
                        }
                    }
                    break;
                case `hasNoEnergy`:
                    creep.memory.state = "buildFlag";
                    // type source= Source
                    // let source = creep.room.find(FIND_SOURCES_ACTIVE)[0]
                    // if(creep.harvest(source)===ERR_NOT_IN_RANGE){
                    //     creep.moveTo(source)
                    // }
                    // if(creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                    //     creep.memory.state = "hasEnergy"
                    // }
                    break;
                case `hasEnergy`:
                    // type constructionSite = ConstructionSite
                    // let constructionSite = creep.room.find(FIND_CONSTRUCTION_SITES)[0]
                    // if (constructionSite){
                    //     if(creep.build(constructionSite)===ERR_NOT_IN_RANGE){
                    //         creep.moveTo(constructionSite)
                    //     }
                    // }
                    // if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
                    //     creep.memory.state = "hasNoEnergy"
                    // }
                    break;
                default:
                    console.log(`creep ${creep} has the memory state ${creep.memory.state}, this is not defined`);
            }
        }
        catch (error) {
            console.log(`error in role.builder ${error}`);
        }
    }
};
exports.typeBuilder = {
    role: "builder",
    baseBody: [MOVE, WORK, CARRY],
    body: [MOVE, WORK],
    name: "Builder " + Game.time,
    state: "justSpawned",
};
//# sourceMappingURL=role.builder.js.map