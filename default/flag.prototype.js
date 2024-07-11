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
        let container = flag.pos.lookFor(LOOK_STRUCTURES);
        if (container instanceof StructureContainer) {
            energyAvailable = container.store.getUsedCapacity(RESOURCE_ENERGY);
        }
        var groundEnergy = flag.pos.lookFor(LOOK_ENERGY);
        if (groundEnergy[0]) {
            energyAvailable = energyAvailable + groundEnergy[0].amount;
        }
        energyAvailable = energyAvailable - scheduledPickupSum;
        flag.memory.energyAvailable = energyAvailable;
    };
};
exports.default = initFlagPrototypes;
//# sourceMappingURL=flag.prototype.js.map