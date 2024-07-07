/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('upgrader');
 * mod.thing == 'a thing'; // true
 */

// upgrader.js

var Creep = require('creepPrototype');
module.exports = {
    body: [WORK, CARRY, MOVE],
    memory: {
        role: "assignController",
        state: "upgrade"

    },
    run: function(creep) {
        switch(creep.memory.state){
            case "assignController": 
                creep.memory.assignedFlag = creep.room.controller.id
                creep.memory.state = "upgrade"
            break;

            case "upgrade": 
                var target = creep.room.controller
                result = creep.upgradeController(target)
                console.log(result)

                if(result===ERR_NOT_IN_RANGE || ERR_NOT_ENOUGH_ENERGY){
                    creep.moveTo(Game.flags[creep.memory.assignedFlag])
                }
            break;
        }
    }
}