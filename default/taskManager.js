"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const creepBodys_1 = require("./creepBodys");
const memory_creep_1 = require("./memory.creep");
let taskManager;
exports.default = taskManager = {
    addPotentialMiningTask(sourceId, base, sourceType) {
        let source = Game.getObjectById(sourceId);
        let baseFlag = Game.flags[base.name];
        let distanceBase = 0;
        if (source instanceof Source && baseFlag instanceof Flag) {
            let path = source.pos.findPathTo(baseFlag);
            distanceBase = path.length;
            let flagPos = new RoomPosition(path[0].x, path[0].y, base.name);
            flagPos.createFlag(source.id);
        }
        else {
            console.log(`error in addMiningTask was expecting to get a sourceId.`);
        }
        Memory.strategyManager.TasksManager.potentialMiningTask.push({
            sourceId: sourceId,
            base: base.name,
            distanceBase: distanceBase,
            taskExpectedEnergyCostRate: 2,
            sourceType: sourceType,
        });
    },
    enableMiningTask(sourceId) {
        let potentialMiningtasks = Memory.strategyManager.TasksManager.potentialMiningTask;
        for (let i = 0; potentialMiningtasks.length; i++) {
            if (potentialMiningtasks[i].sourceId == sourceId) {
                let miningTask = {
                    sourceId: sourceId,
                    base: potentialMiningtasks[i].base,
                    distanceBase: potentialMiningtasks[i].distanceBase,
                    hasContainer: false,
                    nextMinerSpawnTask: 0,
                    workPartsPresent: 0,
                    assignedMiners: [],
                    incomingHaulers: [],
                    taskEnergyGainRate: 0,
                    taskEnergyCostRate: 2,
                    taskSpawnCostMiner: 0,
                    taskSpawnCostRepairer: 0,
                    sourceType: potentialMiningtasks[i].sourceType
                };
                Memory.strategyManager.TasksManager.miningTasks.push(miningTask);
                Memory.strategyManager.TasksManager.potentialMiningTask.splice(i, 1);
            }
        }
    },
    scheduleMiningSubTasks() {
        let tasks = Memory.strategyManager.TasksManager.miningTasks;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].nextMinerSpawnTask < 20) {
                switch (tasks[i].sourceType) {
                    case "base":
                        taskManager.addSpawnTask(tasks[i].base, memory_creep_1.default.MINER, tasks[i].nextMinerSpawnTask, 2, "medium", tasks[i].sourceId); // 5 for max five work parts on the body. Here needs to come some more logic on how many workParts can be build in order to schedule multiple suporting Miners. 
                }
            }
        }
    },
    addSpawnTask(baseName, type, inTicks, addSize, prio, target) {
        Memory.strategyManager.roomManager[baseName].spawnTask[prio].push({
            type: type,
            inTicks: inTicks,
            addSize: addSize,
            targetSource: target
        });
    },
    scheduleSpawn(room) {
        let spawnTaskAtPrio = Memory.strategyManager.roomManager[room.name].spawnTask;
        let spawnPrios = ["high", `medium`, "low"];
        let spawnDefined = false;
        for (let k of spawnPrios) {
            for (let i = 0; i < spawnTaskAtPrio[k].length; i++) {
                taskManager.spawnFromTask(room, spawnTaskAtPrio[k][i]);
                spawnTaskAtPrio[k].splice(i, 0);
            }
        }
    },
    spawnFromTask(room, spawnTask) {
        let spawn = room.find(FIND_MY_SPAWNS)[0];
        let body = taskManager.returnBodyForCreep(spawnTask.type, spawnTask.addSize);
        let sourceId = spawnTask.targetSource;
        if (sourceId) {
            spawn.spawnCreep(body, spawnTask.type + Game.time, { memory: {
                    role: spawnTask.type,
                    base: room.name,
                    targetId: sourceId,
                    state: "justSpawned"
                } });
        }
    },
    returnBodyForCreep(type, numberAddBody) {
        let baseBody = [];
        let addBody = [];
        switch (type) {
            case memory_creep_1.default.MINER:
                baseBody = creepBodys_1.typeMiner.baseBody;
                addBody = creepBodys_1.typeMiner.body;
                break;
            case memory_creep_1.default.UPGRADER:
            case memory_creep_1.default.BUILDER:
            case memory_creep_1.default.MINER:
            case memory_creep_1.default.HAULER:
            case memory_creep_1.default.SCOUT:
            case memory_creep_1.default.FASTFILLER:
                break;
            default:
        }
        let body = [];
        for (let i = 0; i < baseBody.length; i++) {
            body.push(baseBody[i]);
        }
        for (let i = 0; i < numberAddBody; i++) {
            for (let i = 0; i < addBody.length; i++) {
                body.push(addBody[i]);
            }
        }
        return body;
    }
};
//# sourceMappingURL=taskManager.js.map