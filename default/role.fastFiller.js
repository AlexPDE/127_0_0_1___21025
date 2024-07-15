"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memory_creep_1 = require("./memory.creep");
let roleFastFiller;
exports.default = roleFastFiller = {
    run(creep) {
        switch (creep.memory.state) {
            case `justSpawned`:
                let fastfillerPosition1 = new RoomPosition(Game.flags[creep.memory.base].pos.x + 1, Game.flags[creep.memory.base].pos.y, creep.memory.base);
                let arrayPositions = [fastfillerPosition1];
                for (let i = 0; i < arrayPositions.length; i++) {
                    let creepInPosition = arrayPositions[i].lookFor(LOOK_CREEPS)[0];
                    if (creepInPosition.memory.role != memory_creep_1.default.FASTFILLER) {
                        console.log("there is a creep in the position of the fast filler creep");
                    }
                    else {
                        creep.memory.targetPos = arrayPositions[i];
                        creep.memory.state = "moveToPosition";
                        break;
                    }
                }
                break;
            case "moveToPosition":
                if (creep.memory.targetPos) {
                    let targetPos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);
                    console.log(targetPos);
                    if (targetPos) {
                        creep.moveTo(targetPos);
                        if (creep.pos.isEqualTo(targetPos)) {
                            creep.memory.state = "fastFill";
                        }
                    }
                    else {
                        console.log(`something wrong in the state moveToPosition in the FastFiller`);
                    }
                }
                break;
            case "fastFill":
                let strucutres = creep.room.lookForAtArea(LOOK_STRUCTURES, creep.pos.y - 1, creep.pos.x - 1, creep.pos.y + 1, creep.pos.x + 1, true);
                console.log("strucutre: ", JSON.stringify(strucutres));
                let fillStructures = [];
                var structureContainer;
                for (let i = 0; i < strucutres.length; i++) {
                    let structure = strucutres[i].structure;
                    console.log("structure instanceof StructureContainer ", structure instanceof StructureContainer);
                    if (structure instanceof StructureContainer) {
                        let structureContainer = strucutres[i].structure;
                        creep.withdraw(structureContainer, RESOURCE_ENERGY, creep.store.getFreeCapacity());
                    }
                    else {
                        fillStructures.push(strucutres[i].structure);
                    }
                }
                for (let i = 0; i < fillStructures.length; i++) {
                    creep.transfer(fillStructures[i], RESOURCE_ENERGY);
                }
                break;
            default: console.log(`roleFastFiller has a state that is not defined:  ${creep.memory.state}`);
        }
    }
};
//# sourceMappingURL=role.fastFiller.js.map