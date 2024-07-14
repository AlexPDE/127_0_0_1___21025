"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnManager = void 0;
const memory_creep_1 = require("./memory.creep");
const _ = require("lodash");
let spawnManager;
exports.spawnManager = spawnManager = (room) => {
    console.log("spawnManager is running");
    const fastFillers = _.filter(Game.creeps, (creep) => creep.memory.role == memory_creep_1.default.FASTFILLER);
    if (Memory.baseManager[room.name].fastFillerActive) {
    }
};
//# sourceMappingURL=spawnManager.js.map