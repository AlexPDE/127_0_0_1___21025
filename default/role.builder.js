"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = require("./analytics");
let roleBuilder;
exports.default = roleBuilder = {
    run(creep) {
        try {
            let energyPerTick = 0;
            for (let i of creep.body) {
                if (i.type == WORK) {
                    energyPerTick = energyPerTick + 5;
                }
            }
            switch (creep.memory.state) {
                case `justSpawned`:
                    creep.memory.state = "buildFlag";
                    break;
                case `buildFlag`:
                    if (creep.memory.flagId) {
                        let flag = Game.flags[creep.memory.flagId];
                        flag.memory.assignedBuilder = creep.id;
                        let constructionSite = Game.getObjectById(creep.memory.flagId);
                        if (constructionSite instanceof ConstructionSite) {
                            let ret = creep.build(constructionSite);
                            if (ret === OK) {
                                (0, analytics_1.addSinkBuild)(energyPerTick);
                            }
                            if (!creep.pos.inRangeTo(constructionSite, 3)) {
                                creep.moveTo(constructionSite);
                            }
                        }
                        else {
                            console.log(`constructionSite is finished`, flag);
                            flag.removeConstructionFlag(flag);
                            delete creep.memory.flagId;
                        }
                    }
                    else {
                        let constructionFlag = creep.room.find(FIND_FLAGS, { filter: { color: COLOR_BROWN } })[0];
                        if (constructionFlag) {
                            creep.memory.flagId = constructionFlag.name;
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
//# sourceMappingURL=role.builder.js.map