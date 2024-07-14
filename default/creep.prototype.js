"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const energyRequestFlagTypes_1 = require("./energyRequestFlagTypes");
let initCreepPrototypes;
initCreepPrototypes = () => {
    Creep.prototype.getEnergy = (creep) => {
        if (!creep.memory.targetId) {
            if (creep.memory.base) {
                let sources = Memory.baseManager[creep.memory.base].sources;
                for (let i of sources) {
                    let flag = Game.flags[i];
                    if (flag.memory.energyAvailable) {
                        if (flag.memory.energyAvailable >= creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
                            console.log(`flag.memory.energyAvailable ${flag.memory.energyAvailable}`);
                            creep.memory.targetId = i;
                            break;
                        }
                    }
                }
            }
        }
        else {
            let targetFlag = Game.flags[creep.memory.targetId];
            if (!creep.pos.inRangeTo(targetFlag, 1)) {
                creep.moveTo(targetFlag);
            }
            let droppedEnergy = targetFlag.pos.lookFor(RESOURCE_ENERGY)[0];
            if (droppedEnergy) {
                creep.pickup(droppedEnergy);
            }
            let container = targetFlag.pos.lookFor(LOOK_STRUCTURES)[0];
            if (container instanceof StructureContainer) {
                creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY));
            }
        }
        let source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.state = "hasEnergy";
            delete creep.memory.targetId;
        }
    };
    Creep.prototype.deliverEnergy = (creep) => {
        try {
            if (!creep.memory.targetId) {
                console.log("deciding where to deliver Energy");
                if (creep.memory.base) {
                    console.log("wants to deliver to Base");
                    let energyRequests = [];
                    for (let i in Memory.baseManager[creep.memory.base].energyRequests) {
                        //energyRequests.pushMemory.baseManager[creep.memory.base].energyRequests[i]
                    }
                    energyRequests.push(Game.rooms[creep.memory.base].find(FIND_MY_SPAWNS)[0].id);
                    for (let i = 0; i < energyRequests.length; i++) {
                        console.log(`checking delivery Option ${energyRequests[i]}`);
                        let flag = Game.flags[creep.memory.base];
                        if (flag) {
                            if (flag.memory.energyRequired) {
                                if (flag.memory.energyRequired > 0) {
                                    console.log("energy is required ad delivery Option");
                                    creep.memory.targetId = energyRequests[i];
                                    console.log("creep will deliver to Base");
                                    if (flag.memory.scheduledDeliverys) {
                                        console.log(`this are the curred schedule deliveries ${flag.memory.scheduledDeliverys}`);
                                        flag.memory.scheduledDeliverys.push({
                                            creepId: "test",
                                            amount: 10.
                                        });
                                    }
                                    break;
                                }
                            }
                        }
                        else {
                            try {
                                let spawn = Game.getObjectById(energyRequests[i]);
                                if (spawn instanceof Spawn) {
                                    flag = Game.flags[spawn.room.name];
                                    if (flag.memory.energyRequired) {
                                        if (flag.memory.energyRequired > 0) {
                                            creep.memory.targetId = spawn.room.name;
                                            break;
                                        }
                                    }
                                }
                            }
                            catch (error) {
                                console.log("deliver energy has error in the delivering to base section ", error);
                            }
                        }
                    }
                }
            }
            else {
                let targetFlag = Game.flags[creep.memory.targetId];
                if (targetFlag) {
                    console.log(targetFlag);
                    if (targetFlag.memory.type == energyRequestFlagTypes_1.default.BUILDER) {
                        if (targetFlag.memory.assignedBuilder) {
                            let target = Game.getObjectById(targetFlag.memory.assignedBuilder);
                            if (target instanceof Creep) {
                                let ret = creep.transfer(target, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                                if (ret === ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target);
                                }
                            }
                        }
                    }
                }
                else {
                    console.log("this is testinf the delivery to base");
                    let target = Game.getObjectById(creep.memory.targetId).pos.lookFor(LOOK_STRUCTURES)[0];
                    try {
                        let target = Game.getObjectById(creep.memory.targetId);
                        console.log("creep is targeting this for the delivery ", target);
                        if (target) {
                            creep.moveTo(target);
                            let carryiedEnergy = creep.store.getUsedCapacity(RESOURCE_ENERGY);
                            let result = creep.transfer(target, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                            if (result === OK) {
                                if (Game.flags[creep.room.name]) {
                                    if (Game.flags[creep.room.name].memory.energyAvailable) {
                                        let energyAvailable = Game.flags[creep.room.name].memory.energyAvailable;
                                        if (energyAvailable) {
                                            energyAvailable = energyAvailable - carryiedEnergy;
                                            Game.flags[creep.room.name].memory.energyAvailable = energyAvailable;
                                        }
                                    }
                                }
                                if (result === ERR_FULL) {
                                    delete creep.memory.targetId;
                                }
                            }
                        }
                        try { }
                        catch (error) {
                            console.log("error in deliver Energy section base");
                        }
                    }
                    finally {
                    }
                    if (targetFlag.memory.type == energyRequestFlagTypes_1.default.BASE) {
                        try {
                            let target = targetFlag.pos.lookFor(LOOK_STRUCTURES)[0];
                            console.log("creep is targeting this for the delivery ", target);
                            if (target) {
                                creep.moveTo(target);
                                let carryiedEnergy = creep.store.getUsedCapacity(RESOURCE_ENERGY);
                                let result = creep.transfer(target, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
                                if (result === OK) {
                                    if (Game.flags[target.id]) {
                                        if (Game.flags[target.id].memory.energyAvailable) {
                                            let energyAvailable = Game.flags[target.id].memory.energyAvailable;
                                            if (energyAvailable) {
                                                energyAvailable = energyAvailable - carryiedEnergy;
                                                Game.flags[target.id].memory.energyAvailable = energyAvailable;
                                            }
                                        }
                                    }
                                }
                                if (result === ERR_FULL) {
                                    delete creep.memory.targetId;
                                }
                            }
                        }
                        catch (error) {
                            console.log("error in deliver Energy section base");
                        }
                    }
                }
                {
                    delete creep.memory.targetId;
                }
            }
        }
        catch (error) {
            console.log(`erroro in deliver Energy ${error}`);
        }
    };
    // if(builderCreep instanceof Creep){
    //     let ret = creep.transfer(builderCreep,RESOURCE_ENERGY,creep.store.getUsedCapacity(RESOURCE_ENERGY))
    //     if (ret === ERR_NOT_IN_RANGE){
    //         creep.moveTo(builderCreep)
    //     }
    // }
    // let spawn = creep.room.find(FIND_MY_SPAWNS)[0]
    // if(spawn){
    //     let ret:ScreepsReturnCode = creep.transfer(spawn,RESOURCE_ENERGY)
    //     if(ret ==ERR_NOT_IN_RANGE){
    //         creep.moveTo(spawn)
    //     }
    // }
};
exports.default = initCreepPrototypes;
//# sourceMappingURL=creep.prototype.js.map