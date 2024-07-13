"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAverage = exports.saveHistory = exports.startAnalytics = exports.addSinkBuild = exports.addEnergyHarvested = exports.initialiseAnalytics = void 0;
let initialiseAnalytics = () => {
    let analyticsEntryPreSet = {
        perTickCurrent: 0,
        past100Ticks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        average10Ticks: 0,
        average100Ticks: 0,
    };
    Memory.analytics = {
        energyAvailable: analyticsEntryPreSet,
        energyGain: analyticsEntryPreSet,
        spawnTime: analyticsEntryPreSet,
        sinkBuild: analyticsEntryPreSet,
        sinkRepair: analyticsEntryPreSet,
        sinkSpawn: analyticsEntryPreSet,
        sinkUpgrading: analyticsEntryPreSet,
    };
};
exports.initialiseAnalytics = initialiseAnalytics;
let addEnergyHarvested = (amount) => {
    Memory.analytics.energyGain.perTickCurrent = Memory.analytics.energyGain.perTickCurrent + amount;
};
exports.addEnergyHarvested = addEnergyHarvested;
let addSinkBuild = (amount) => {
    Memory.analytics.sinkBuild.perTickCurrent = Memory.analytics.sinkBuild.perTickCurrent + amount;
};
exports.addSinkBuild = addSinkBuild;
let startAnalytics = () => {
    let i;
    for (i in Memory.analytics) {
        Memory.analytics[i].perTickCurrent = 0;
    }
};
exports.startAnalytics = startAnalytics;
let saveHistory = () => {
    let i;
    for (i in Memory.analytics) {
        let k = Game.time % 100;
        Memory.analytics[i].past100Ticks[k] = Memory.analytics[i].perTickCurrent;
        //Memory.analytics[i].past100Ticks[Game.time%100] = Memory.analytics[i]
    }
};
exports.saveHistory = saveHistory;
let calculateAverage = () => {
    let i;
    for (i in Memory.analytics) {
        let sum100Average = 0;
        let sum10Average = 0;
        for (let k = 0; k < 100; k++) {
            sum100Average = Memory.analytics[i].past100Ticks[k] + sum100Average;
            if (k < 10) {
                let tickRemainder = Game.time % 100;
                if (tickRemainder - k >= 0) {
                    sum10Average = Memory.analytics[i].past100Ticks[tickRemainder - k] + sum10Average;
                }
                else {
                    sum10Average = Memory.analytics[i].past100Ticks[100 - k] + sum10Average;
                }
            }
        }
        Memory.analytics[i].average100Ticks = sum100Average / 100;
        Memory.analytics[i].average10Ticks = sum10Average / 10;
    }
};
exports.calculateAverage = calculateAverage;
//# sourceMappingURL=analytics.js.map