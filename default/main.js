"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
const prototypesInit_1 = require("./prototypesInit");
const role_upgrader_1 = require("./role.upgrader");
const role_builder_1 = require("./role.builder");
const memory_creep_1 = require("./memory.creep");
const role_miner_1 = require("./role.miner");
const role_Hauler_1 = require("./role.Hauler");
const diedCreepManagment_1 = require("./diedCreepManagment");
const role_scout_1 = require("./role.scout");
const analytics_1 = require("./analytics");
const role_fastFiller_1 = require("./role.fastFiller");
const strategyManager_1 = require("./strategyManager");
function loop() {
    //addRequestForFastFiller(bodyTypes.MAXFASTFILLER,Game.rooms["W8N3"])
    console.log(`-----------------------tick ${Game.time}-----------------------------------`);
    if (!Memory.strategyManager) {
        strategyManager_1.default.initiate();
    }
    (0, analytics_1.startAnalytics)();
    strategyManager_1.default.run();
    (0, prototypesInit_1.default)();
    //updateAllFlags()
    (0, diedCreepManagment_1.default)();
    for (let i in Game.flags) {
        let flag = Game.flags[i];
        if (flag.memory.type == "source") {
            //flag.updateEnergySupplyFlag(flag)
        }
    }
    //baseManager(Game.spawns["Spawn1"].room)
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == memory_creep_1.default.UPGRADER) {
            role_upgrader_1.default.run(creep);
        }
        if (creep.memory.role == memory_creep_1.default.FASTFILLER) {
            role_fastFiller_1.default.run(creep);
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
    // if(Game.time%4 == 0){
    //     for (let i of keys(Game.flags)){
    //         Game.flags[i].remove()
    //         delete Memory.baseManager
    //     }
    // }
    //analytics
    //genericAnalyticsCalculations()
    let CPUBeforAnalytics = Game.cpu.getUsed();
    //calculateAverage()
    let CPUAfterAnalytics = Game.cpu.getUsed();
    console.log(`Game.cpu.getUsed(): ${Game.cpu.getUsed()}`);
}
exports.loop = loop;
//# sourceMappingURL=main.js.map