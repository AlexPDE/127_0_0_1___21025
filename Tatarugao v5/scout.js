
// scout.js
var Room = require('roomPrototype')
var Creep = require('creepPrototype');
module.exports = {
    body: [MOVE],
    memory: {
        role: "scout",
        state: "assignRoom"

    },
    run: function(creep) {
        switch(creep.memory.state){

            case "assignRoom": 
                creep.memory.target = Game.flags[creep.memory.assignedBase].memory.roomsToScout[0]
                creep.memory.state = "moveToNewRoom"
            break;

            case "moveToRoom":
            case "moveToNewRoom":
                
                try {
                    const pos = new RoomPosition(25, 25 ,  creep.memory.target);
                    creep.moveTo(pos)
                    if (creep.room.name === creep.memory.target){
                        var arrayId = Game.flags[creep.memory.assignedBase].memory.roomsToScout.findIndex(element => element === creep.memory.target)
                        try {
                            Game.flags[creep.memory.assignedBase].memory.roomsToScout.splice(arrayId,1)
                            creep.memory.state = "assignRoom"
                        } catch (error) {
                            console.log(`Error in scout logic: ${error}`);
                        }
                        console.log(arrayId)
                        creep.room.initateRoom(creep.memory.assignedBase)
                        Game.flags[creep.memory.assignedBase].memory.roomsToScout
                    }
                } catch (error) {
                    
                }
                
                
            break;
        }
    }
}