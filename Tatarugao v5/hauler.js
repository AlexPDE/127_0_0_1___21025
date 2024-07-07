var Creep = require('creepPrototype');
// hauler.js
module.exports = {
    body: [CARRY, MOVE],
    memory: {
        role: "hauler",
        state: "notAssigned",
        hasEnergy: false,

    },
    run: function(creep) {
        switch(creep.memory.state){
            case "notAssigned":
                if(!creep.spawning){
                    console.log("Unassigned Hauler is gettign assigned: " + Game.flags[creep.memory.assignedFlag])
                    Game.flags[creep.memory.assignedBase].memory.freeHaulers.push(creep.id)     
                    creep.memory.state = "freeHauler"
                }
                
            break;

            case "directDelivery":
               
                
            break;

            case "freeHauler": 
                
                if(creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                    creep.memory.hasEnergy = true
                }else{
                    creep.memory.hasEnergy = false
                }
                /*
                deliveryTargets = []
                if(creep.memory.hasEnergy){
                
                    for(let i in Game.flags[creep.memory.assignedBase].memory.deliveryTasks){
                        //Game.flags[i].memory.energyRequired = 1
                        if(!Game.flags[i].memory.assignedEnergyDeliveries){
                            Game.flags[i].memory.assignedEnergyDeliveries = []
                        }
                        if(!Game.flags[i].memory.requiredEnergy){
                            Game.flags[i].memory.requiredEnergy = 0
                        }
                        console.log(Game.flags[i].memory.energyRequired > 0)
                        if (Game.flags[i].memory.energyRequired > 0){
                            console.log("this runs")
                            deliveryTargets.push({[i]:Game.flags[i].memory.energyRequired})
                        }

                        /*
                        const _ = require('lodash');
                        const target = deliveryTargets.reduce((min, obj) => (obj.value < min.value ? obj : min), deliveryTargets[0]);
                        for (let name in target){
                            Game.flags[name].energyRequired -= creep.store.getUsedCapacity(RESOURCE_ENERGY)
                            Game.flags[name].assignedEnergyDeliveries[creep.id] =creep.store.getUsedCapacity(RESOURCE_ENERGY)
                        }
                        







                            task = Game.flags[creep.memory.assignedBase].memory.deliveryTasks[i]
                            creep.memory.state = task.type
                            creep.memory.assignedFlag = task.flagName
                            var arrayId = Game.flags[creep.memory.assignedBase].memory.freeHaulers.findIndex(element => element === creep.id)
                            if(arrayId){
                                Game.flags[creep.memory.assignedBase].memory.freeHaulers = Game.flags[creep.memory.assignedBase].memory.freeHaulers.splice(arrayId,1)
                            }
                            Game.flags[Game.flags[creep.memory.assignedBase].memory.deliveryTasks[i].flagName].memory.assignedEnergyDeliveries[creep.id] = creep.store.getUsedCapacity(RESOURCE_ENERGY)

                        }                
                    }  
                    
                }else{
                    for(var i = 0; i < Game.flags[creep.memory.assignedBase].memory.pickUpTask.length;i++){
                        if(Game.flags[creep.memory.assignedBase].memory.pickUpTask[i].amount >= creep.store.getFreeCapacity(RESOURCE_ENERGY)){
                            task = Game.flags[creep.memory.assignedBase].memory.pickUpTask[i]
                            creep.memory.state = task.type
                            creep.memory.returning = false
                            creep.memory.onPath = false
                            creep.memory.assignedFlag = task.flagName
                            var arrayId = Game.flags[creep.memory.assignedBase].memory.freeHaulers.findIndex(element => element === creep.id)
                            Game.flags[creep.memory.assignedBase].memory.freeHaulers = Game.flags[creep.memory.assignedBase].memory.freeHaulers.splice(arrayId,1)
                            creepId = creep.id                    
                            Game.flags[Game.flags[creep.memory.assignedBase].memory.pickUpTask[i].flagName].memory.assignedPickups[creepId] = creep.store.getFreeCapacity(RESOURCE_ENERGY)
                            Game.flags[creep.memory.assignedBase].memory.pickUpTask[i].amount -= creep.store.getFreeCapacity(RESOURCE_ENERGY)
                            creep.memory.path = Game.flags[Game.flags[creep.memory.assignedBase].memory.pickUpTask[i].flagName].memory.pathToFlag
                            creep.memory.startPoint = Game.flags[Game.flags[creep.memory.assignedBase].memory.pickUpTask[i].flagName].memory.startPoint
                            creep.memory.endPoint = Game.flags[Game.flags[creep.memory.assignedBase].memory.pickUpTask[i].flagName].memory.endPoint
                        }   
                                    
                    }   
                }
                 

              
                */
                
            break;
                

            case "pickUpFromSource":
                    if(creep.memory.onPath){
                        endPoint = new RoomPosition (creep.memory.endPoint.x , creep.memory.endPoint.y , creep.memory.endPoint.roomName)
                        result = creep.moveByPath(creep.memory.path)
                        if(creep.pos.isEqualTo(endPoint)){
                            creep.getEnergyfromFlag(creep.memory.assignedFlag)
                            console.log("is at end point")
                        }
                    }else{
                        startPoint = new RoomPosition (creep.memory.startPoint.x , creep.memory.startPoint.y , creep.memory.startPoint.roomName)
                        console.log(startPoint)
                        creep.moveTo(startPoint)
                        if(creep.pos.isEqualTo(startPoint)){
                            creep.memory.onPath = true
                        }
                        
                    }

                    //var end = new RoomPosition (creep.memory._move.dest.x,creep.memory._move.dest.y,creep.memory._move.dest.roomName);

                
            break;

            case "deliverToBase": 
                result = creep.deliverEnergyToBase([creep.memory.assignedBase])
                if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
                    creep.memory.state = "freeHauler"
                    Game.flags[creep.memory.assignedBase].memory.freeHaulers.push(creep.id)
                }

            break;

            case "deliverToController": 
                if(creep.store.getFreeCapacity(RESOURCE_ENERGY) <= creep.store.getCapacity(RESOURCE_ENERGY)){
                    flag = Game.flags[creep.memory.assignedFlag]
                    creep.moveTo(flag)
                    var upgrader = flag.pos.lookFor(LOOK_CREEPS)[0];
                    creep.transfer(upgrader,RESOURCE_ENERGY)
                    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
                        creep.memory.state = "freeHauler"
                        Game.flags[creep.memory.assignedBase].memory.freeHaulers.push(creep.id)
                    }
                    
                }else{
                    console.log("Hauler deliver tO Controller has no energy")
                }
            break;





        }
    }
}