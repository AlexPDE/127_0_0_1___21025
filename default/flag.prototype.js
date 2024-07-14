"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllFlags = void 0;
const baseManager_1 = require("./baseManager");
const lodash_1 = require("lodash");
let initFlagPrototypes;
let updateAllFlags;
exports.updateAllFlags = updateAllFlags = () => {
    console.log("updateAllFlags is running");
    for (let flagName of (0, lodash_1.keys)(Game.flags)) {
        switch (Game.flags[flagName].memory.type) {
            case "base":
                break;
            default: console.log(`Update all flags is not defined for type: ${Game.flags[flagName].memory.type}`);
        }
    }
};
initFlagPrototypes = () => {
    Flag.prototype.updateEnergySupplyFlag = (flag) => {
        if (flag.room) {
            var scheduledPickupSum = 0;
            if (!flag.memory.scheduledPickups) {
                flag.memory.scheduledPickups = [];
            }
            if (!flag.memory.energyAvailable) {
                flag.memory.energyAvailable = 0;
            }
            for (let i in flag.memory.scheduledPickups) {
                // add all scheduled pickups here. 
            }
            var energyAvailable = 0;
            let container = flag.pos.lookFor(LOOK_STRUCTURES)[0];
            if (container instanceof StructureContainer) {
                energyAvailable = energyAvailable + container.store.getUsedCapacity(RESOURCE_ENERGY);
            }
            var groundEnergy = flag.pos.lookFor(LOOK_ENERGY);
            if (groundEnergy[0]) {
                energyAvailable = energyAvailable + groundEnergy[0].amount;
            }
            let miner = flag.pos.lookFor(LOOK_CREEPS)[0];
            if (miner) {
                energyAvailable = miner.store.getUsedCapacity(RESOURCE_ENERGY) + energyAvailable;
            }
            energyAvailable = energyAvailable - scheduledPickupSum;
            flag.memory.energyAvailable = energyAvailable;
        }
    };
    Flag.prototype.removeConstructionFlag = (flag) => {
        if (flag.memory.assignedBase) {
            let requestFlags = Memory.baseManager[flag.memory.assignedBase].energyRequests;
            if (requestFlags) {
                for (let i in requestFlags) {
                    if (requestFlags[i] == flag.name) {
                        requestFlags.splice(i, 1);
                        flag.remove();
                    }
                }
            }
        }
    };
    Flag.prototype.updateUpgraderFlag = (flag) => {
        let container = flag.pos.lookFor(LOOK_STRUCTURES)[0];
        if (container instanceof StructureContainer) {
            flag.memory.energyRequired = container.store.getFreeCapacity(RESOURCE_ENERGY);
        }
    };
    Flag.prototype.updateSpawnFlag = (flag) => {
        console.log("updateSpawnFlag is running");
        // check the energy required
        let scheduledDeliverys = flag.memory.scheduledDeliverys;
        let eneryOnRoute = 0;
        for (let scheduledDelivery of scheduledDeliverys) {
            eneryOnRoute = eneryOnRoute + scheduledDelivery["amount"];
        }
        flag.memory.energyRequired = flag.room.energyCapacityAvailable - eneryOnRoute;
        //add Extensions to the room 
        if (flag.room) {
            let extensions = flag.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_EXTENSION });
            for (let i = 0; i < extensions.length; i++) {
                let willAdd = true;
                for (let k of flag.memory.extensions) {
                    if (k == extensions[i].id) {
                        willAdd = false;
                    }
                }
                if (willAdd) {
                    flag.memory.extensions.push(extensions[i].id);
                    (0, baseManager_1.addEnergyRequestFlag)(extensions[i].pos, extensions[i].room, extensions[i].id, "extension");
                }
            }
        }
    };
};
exports.default = initFlagPrototypes;
//# sourceMappingURL=flag.prototype.js.map