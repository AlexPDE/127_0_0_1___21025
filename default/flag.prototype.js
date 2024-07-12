"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let initFlagPrototypes;
initFlagPrototypes = () => {
    Flag.prototype.updateEnergySupplyFlag = (flag) => {
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
        console.log(`energy Available ${energyAvailable}`);
    };
    Flag.prototype.removeConstructionFlag = (flag) => {
        if (flag.memory.assignedBase) {
            let requestFlags = Memory.baseManager[flag.memory.assignedBase].energyRequests;
            if (requestFlags) {
                for (let i in requestFlags) {
                    if (requestFlags[i] == flag.name) {
                        console.log(i);
                        console.log(Memory.baseManager[flag.memory.assignedBase].energyRequests[i]);
                    }
                }
            }
        }
        flag.remove();
    };
};
exports.default = initFlagPrototypes;
//# sourceMappingURL=flag.prototype.js.map