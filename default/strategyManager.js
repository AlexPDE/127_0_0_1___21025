"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseManager_1 = require("./baseManager");
const taskManager_1 = require("./taskManager");
let startegyManager;
exports.default = startegyManager = {
    initiate() {
        Memory.strategyManager = {
            TasksManager: {
                potentialMiningTask: [],
                miningTasks: [],
                militaryTasks: [],
                haulerTask: [],
            },
            explorationManager: {
                exploredRooms: [],
                priorityExploration: [],
                exploration: [],
            },
            roomManager: {}
        };
        let spawn = Game.spawns["Spawn1"];
        baseManager_1.default.initiate(spawn.pos);
    },
    run() {
        taskManager_1.default.scheduleMiningSubTasks();
        for (var name in Memory.strategyManager.roomManager) {
            var room = Game.rooms[name];
            taskManager_1.default.scheduleSpawn(room);
        }
    }
};
//# sourceMappingURL=strategyManager.js.map