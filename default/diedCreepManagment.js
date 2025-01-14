"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spawnManager_1 = require("./spawnManager");
let diedCreepManager;
diedCreepManager = () => {
    for (let i in Memory.creeps) {
        if (!Game.creeps[i]) {
            console.log(`creep ${i} has died`);
            let creepMemory = Memory.creeps[i];
            if (creepMemory.base) {
                switch (creepMemory.role) {
                    case "miner":
                        if (creepMemory.base) {
                            (0, spawnManager_1.addSpawnRequest)(true, "miner", Game.rooms[creepMemory.base], creepMemory.flagId);
                            delete Memory.creeps[i];
                        }
                        break;
                    case "hauler":
                        (0, spawnManager_1.addSpawnRequest)(true, "hauler", Game.rooms[creepMemory.base]);
                        delete Memory.creeps[i];
                        break;
                    case "builder":
                        (0, spawnManager_1.addSpawnRequest)(true, "builder", Game.rooms[creepMemory.base]);
                        delete Memory.creeps[i];
                        break;
                    case "upgrader":
                        (0, spawnManager_1.addSpawnRequest)(false, "upgrader", Game.rooms[creepMemory.base]);
                        delete Memory.creeps[i];
                        break;
                    case "scout":
                        (0, spawnManager_1.addSpawnRequest)(false, "scout", Game.rooms[creepMemory.base]);
                        delete Memory.creeps[i];
                        break;
                    default:
                        console.log(`creep has died that has no clarification in diedCreepManagment creepRole: ${creepMemory.role}`);
                }
            }
        }
    }
};
exports.default = diedCreepManager;
//# sourceMappingURL=diedCreepManagment.js.map