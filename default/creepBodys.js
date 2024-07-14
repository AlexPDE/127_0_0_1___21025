"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeFastfiller = exports.typeRemoteMiner = exports.typeMiner = exports.typeUpgrader = exports.typeBuilder = exports.typeHauler = exports.typeScout = void 0;
exports.typeScout = {
    role: "scout",
    baseBody: [MOVE],
    body: [],
    name: "scout",
    state: "justSpawned",
    max: 0,
};
exports.typeHauler = {
    role: "hauler",
    baseBody: [MOVE, CARRY],
    body: [MOVE, CARRY],
    name: "Hauler",
    state: "justSpawned",
    max: 1,
};
exports.typeBuilder = {
    role: "builder",
    baseBody: [MOVE, WORK, WORK, CARRY],
    body: [MOVE, WORK],
    name: "Builder ",
    state: "justSpawned",
    max: 1,
};
exports.typeUpgrader = {
    role: "upgrader",
    baseBody: [MOVE, WORK, CARRY],
    body: [WORK],
    name: "Upgrader",
    state: "justSpawned",
    max: 1,
};
exports.typeMiner = {
    role: "miner",
    baseBody: [MOVE, WORK, WORK],
    body: [WORK],
    name: "Miner",
    state: "justSpawned",
    max: 3,
};
exports.typeRemoteMiner = {
    role: "miner",
    baseBody: [MOVE, CARRY, WORK],
    body: [WORK],
    name: "Miner",
    state: "justSpawned",
    max: 5,
};
exports.typeFastfiller = {
    role: "miner",
    baseBody: [MOVE, CARRY],
    body: [CARRY],
    name: "Miner",
    state: "justSpawned",
    max: 1,
};
var bodyTypes;
(function (bodyTypes) {
    bodyTypes["MAXFASTFILLER"] = "maxFastFiller";
})(bodyTypes || (bodyTypes = {}));
exports.default = bodyTypes;
//# sourceMappingURL=creepBodys.js.map