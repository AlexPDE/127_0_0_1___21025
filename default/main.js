"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
const role_harvester_1 = require("./role.harvester");
const baseManager_1 = require("./baseManager");
const prototypesInit_1 = require("./prototypesInit");
const role_upgrader_1 = require("./role.upgrader");
const role_builder_1 = require("./role.builder");
const memory_creep_1 = require("./memory.creep");
const role_miner_1 = require("./role.miner");
const role_Hauler_1 = require("./role.Hauler");
const diedCreepManagment_1 = require("./diedCreepManagment");
const role_scout_1 = require("./role.scout");
const analytics_1 = require("./analytics");
function loop() {
    try {
        console.log(`-----------------------tick ${Game.time}-----------------------------------`);
        var totalEnergyHarvested = 0;
        (0, prototypesInit_1.default)();
        for (let i in Game.flags) {
            let flag = Game.flags[i];
            if (flag.memory.type == "source") {
                flag.updateEnergySupplyFlag(flag);
            }
        }
        (0, diedCreepManagment_1.default)();
        (0, baseManager_1.default)(Game.spawns["Spawn1"].room);
        (0, analytics_1.startAnalytics)();
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == memory_creep_1.default.HARVESTER) {
                role_harvester_1.default.run(creep);
            }
            if (creep.memory.role == memory_creep_1.default.UPGRADER) {
                role_upgrader_1.default.run(creep);
            }
            if (creep.memory.role == memory_creep_1.default.BUILDER) {
                role_builder_1.default.run(creep);
            }
            if (creep.memory.role == memory_creep_1.default.MINER) {
                role_miner_1.default.run(creep);
            }
            if (creep.memory.role == memory_creep_1.default.HAULER) {
                role_Hauler_1.default.run(creep);
            }
            if (creep.memory.role == memory_creep_1.default.SCOUT) {
                role_scout_1.default.run(creep);
            }
            //testing Functions here--------------------------
        }
        //setStrategy here every 10 ticks
        if (Game.time % 10 == 0) {
        }
        //analytics
        (0, analytics_1.genericAnalyticsCalculations)();
        let CPUBeforAnalytics = Game.cpu.getUsed();
        (0, analytics_1.calculateAverage)();
        let CPUAfterAnalytics = Game.cpu.getUsed();
    }
    catch (error) {
        console.log(`mn loop ran into ${error}`);
    }
}
exports.loop = loop;
//# sourceMappingURL=main.js.map