"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeScout = void 0;
const explorationManager_1 = require("./explorationManager");
let roleScout;
exports.default = roleScout = {
    run(creep) {
        if (creep.memory.scoutRoom) {
            let targetPos = new RoomPosition(25, 25, creep.memory.scoutRoom);
            creep.moveTo(targetPos);
            if (creep.pos.inRangeTo(targetPos, 24)) {
                (0, explorationManager_1.addRoomToExploration)(creep.memory.scoutRoom, creep.memory.base);
                delete creep.memory.scoutRoom;
            }
        }
        else {
            console.log("scout is running");
            let exits = Game.map.describeExits(creep.room.name);
            let searchRoom = true;
            let targetPos;
            let knownRoom = Memory.baseManager[creep.memory.base].exploredRooms;
            if (exits[1] && !(exits[1] in knownRoom)) {
                let roomName = exits[1];
                if (searchRoom) {
                    creep.memory.scoutRoom = roomName;
                }
                else {
                    Memory.baseManager[creep.memory.base].unexploredRooms[roomName] = { distance: Object.keys(Game.map.findRoute(roomName, creep.memory.base)).length };
                }
                searchRoom = false;
            }
            if (exits[3] && !(exits[3] in knownRoom)) {
                let roomName = exits[3];
                if (searchRoom) {
                    creep.memory.scoutRoom = roomName;
                }
                else {
                    Memory.baseManager[creep.memory.base].unexploredRooms[roomName] = { distance: Object.keys(Game.map.findRoute(roomName, creep.memory.base)).length };
                }
                searchRoom = false;
            }
            if (exits[5] && !(exits[5] in knownRoom)) {
                let roomName = exits[5];
                if (searchRoom) {
                    creep.memory.scoutRoom = roomName;
                }
                else {
                    Memory.baseManager[creep.memory.base].unexploredRooms[roomName] = { distance: Object.keys(Game.map.findRoute(roomName, creep.memory.base)).length };
                }
                searchRoom = false;
            }
            if (exits[7] && !(exits[7] in knownRoom)) {
                let roomName = exits[7];
                if (searchRoom) {
                    creep.memory.scoutRoom = roomName;
                }
                else {
                    Memory.baseManager[creep.memory.base].unexploredRooms[roomName] = { distance: Object.keys(Game.map.findRoute(roomName, creep.memory.base)).length };
                }
                searchRoom = false;
            }
            if (searchRoom == true) {
                console.log(`Scout has not found an adjacent room to scout, terefore uncheckedRooms will be checked.`);
                for (let i in Memory.baseManager[creep.memory.base].unexploredRooms) {
                }
            }
        }
    },
};
exports.typeScout = {
    role: "scout",
    baseBody: [MOVE],
    body: [],
    name: "scout",
    state: "justSpawned",
};
//# sourceMappingURL=role.scout.js.map