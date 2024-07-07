// builder.js

var Creep = require('creepPrototype');
module.exports = {
    body: [WORK, CARRY, MOVE],
    memory: {
        role: "builder",
        state: "assignConstructionSide"

    },
    run: function(creep) {
        switch(creep.memory.state){
            case "assignConstructionSide": 
                if(!Game.flags[creep.memory.assignedBase].memory.hasContainer){
                    creep.memory.state = "buildFirstContainer"
                }
                try {
                    if(!creep.spawning)
                    target = _.filter(Game.flags, flag => flag.color === COLOR_BROWN, flag.secondaryColor === COLOR_RED)[0]
                    creep.memory.target = target.name
                    target.memory.assignedBuilders.push(creep.id)
                    creep.memory.state = "moveToTarget"
                } catch (error) {
                    console.log("no construction site available for builder")
                }
                
            break;

            case "buildFirstContainer": 
                if(creep.store.getUsedCapacity(RESOURCE_ENERGY)>0){
                    target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
                    creep.build(target)
                    
                }else{
                    target = creep.room.find(FIND_MY_SPAWNS)[0]
                    creep.withdraw(target,RESOURCE_ENERGY)
                }
            break;

            case "moveToTarget": 
                target = Game.flags[creep.memory.target]
                creep.moveTo(target)
                if(creep.pos.inRangeTo(target,3)){
                    creep.memory.state = "build"
                }
            break;

            case "build": 
                target = Game.flags[creep.memory.target].pos.lookFor(LOOK_CONSTRUCTION_SITES)
                creep.build(target)
                if(creep.pos.inRangeTo(target,3)){
                    creep.memory.state = "build"
                }
                console.log("has builder ready to build")
            break;
        }
    }
}