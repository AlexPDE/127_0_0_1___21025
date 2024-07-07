Flag.prototype.test = function(){
    console.log("flag.prototype.test is running")
    source = Game.getObjectById(this.name)
    areas = this.room.lookForAtArea(LOOK_TERRAIN,source.pos.y -1,source.pos.x-1,source.pos.y+1,source.pos.x+1,true)
    availableSpots = _.filter(areas, i=> i.terrain !== `wall`)


}

//-------------------------------------------- source Flag --------------------------------------------
Flag.prototype.initialiseSourceFlag = function(baseFlagName){
    console.log("SourceFlag is beeing initated" + this + "associate to the following Base: " + baseFlagName)
    source = Game.getObjectById(this.name)
    areas = this.room.lookForAtArea(LOOK_TERRAIN,source.pos.y -1,source.pos.x-1,source.pos.y+1,source.pos.x+1,true)
    availableSpots = _.filter(areas, i=> i.terrain !== `wall`) 
    path = this.pos.findPathTo(Game.flags[baseFlagName].pos,{
        range: 1,
        ignoreCreeps: true,
        ignoreRoads:true,
        serialize: true,
   })
   
   newPath =Room.deserializePath(path)

   endPoint = new RoomPosition(newPath[0].x, newPath[0].y, Game.flags[baseFlagName].room.name) 
   startPoint = new RoomPosition(newPath[newPath.length-1].x, newPath[newPath.length-1].y, this.room.name) 

   secondPath = startPoint.findPathTo(endPoint,{
    range: 0,
    ignoreCreeps: true,
    ignoreRoads:true,
    serialize: true,
})

    let memoryEntryFlag = {
        miningEnable: false,
        baseFlag: baseFlagName,
        flagName: this.name,
        hasContainer: false,
        distanceToBase: PathFinder.search(Game.flags[baseFlagName].pos,{pos:this.pos , range:1}).path.length,
        assignedMiner: {},
        miningSpeed:0, // per Tick
        sendNextMiner: Game.tick,
        availableEnergy: 0,
        hasRoad: false,
        tripsPerHauler: Math.floor(750 / PathFinder.search(Game.flags[baseFlagName].pos,{pos:this.pos , range:1}).path.length),
        requiredHaulerParts : 0,
        assignedPickups: {},
        availableMiningSpots: availableSpots.length,
        additionalMinerRequired: true,
        pathToFlag: secondPath,
        pathToBase: path,
        startPoint: startPoint,
        endPoint: endPoint,
    }
    this.memory =memoryEntryFlag
    Game.flags[baseFlagName].memory.miningLocation.push(this.name)

}

Flag.prototype.updateSourceFlag = function(){
    miningSpeed = 0
    for(var i in this.memory.assignedMiner){
        try {
            var assignedMiner = Game.getObjectById(i)
            if(assignedMiner == null){
                delete this.memory.i
            }else{
                workBodyAmount = Game.getObjectById(i).body.filter(i => i.type === WORK).length
                miningSpeed += workBodyAmount *2
            }
        } catch (error) {
        }
    }
    this.memory.miningSpeed = miningSpeed
    try {
        sourceCapacity = Game.getObjectById(this.name).energyCapacity
    } catch (error) {
        sourceCapacity = 1500
    }
    if(sourceCapacity/300 > miningSpeed && Object.keys(this.memory.assignedMiner).length < this.memory.availableMiningSpots){
        this.memory.additionalMinerRequired = true
    }
    else{
        this.memory.additionalMinerRequired = false
    }
    requiredHaulerParts = Math.ceil(this.memory.miningSpeed / (50 * this.memory.tripsPerHauler/1500))
    this.memory.requiredHaulerParts = requiredHaulerParts
    haulerTask = {}
    baseFlag = Game.flags[this.memory.baseFlag]
    try {
        Game.flags[this.memory.baseFlag].memory.haulerTaskList[this.name] = requiredHaulerParts
    } catch (error) {
    }
}

Flag.prototype.addMinerToSourceFlag = function(creepId){
    this.memory.assignedMiner[creepId] = true
    this.memory.miningEnable = true
    this.updateSourceFlag()
} 

Flag.prototype.addHaulerToSourceFlag = function(baseFlag, creepId){
    console.log(creepId)
}

//-----------------------------------------------------controllerFlag-------------------------------------------------------------

Flag.prototype.initialiseControllerFlag = function(baseFlagName){
    console.log("ControllerFlag is beeing initated" + this + "associate to the following Base: " + baseFlagName)
    let memoryEntryFlag = {
        baseFlag: baseFlagName,
        hasContainer: false,
        distanceToBase: this.pos.getRangeTo(Game.flags[baseFlagName]),
        assignedUpgraders: [],
        sendNextUpgrader: Game.tick,
    }
    Game.flags[baseFlagName].memory.controller = memoryEntryFlag
}

//--------------------------------------------------------baseFlag-----------------------------------------------------------------------
Flag.prototype.updateAvailableEnergy = function(){
    if(this.memory.miningEnable){
        try {
            availableEnergy = 0
            container = this.pos.lookFor(LOOK_STRUCTURES)[0]
            if(container){
                console.log("Flag prototype updateAvailableEnergy function needs to add functionality for container " + container)
            }
            creep = this.pos.lookFor(LOOK_CREEPS)[0]
            if(creep){
                availableEnergy += creep.store.getUsedCapacity(RESOURCE_ENERGY)
            }

            groundEnergy = this.pos.lookFor(LOOK_ENERGY)[0]
            if(groundEnergy){
                availableEnergy += groundEnergy.energy
            }
            availableEnergy += this.memory.distanceToBase


            for(let i in this.memory.assignedPickups){
                availableEnergy -= this.memory.assignedPickups[i] 
            }

            this.memory.availableEnergy = availableEnergy
            return availableEnergy
        } catch (error) {
        }
    }
}

Flag.prototype.assignHaulers = function(){
    console.log(this)
    pickUpTask = []

    for(i in this.memory.pickUpTask){
        console.log(i)
    }
        /*
                
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
                    }*/

}




  


Flag.prototype.initialiseConstructionFlag = function (structureType,baseFlag){
    console.log("ConstructionFlag is beeing initated" + this + " associate to the following Base: " + baseFlagName)
    this.pos.createConstructionSite(structureType)
    memoryEntry = {
        energyRequired: CONSTRUCTION_COST[structureType],
        plannedDeliveries: [],
        assignedBuilders:[],
    }
    console.log(this.memory)
    this.memory = memoryEntry
    console.log(JSON.stringify(Game.flags[baseFlag].memory.deliveryTasks))
    result = Game.flags[baseFlag].memory.deliveryTasks.push({
        [this.name]:"deliverToBuilder",
        
    })
    console.log(Game.flags[baseFlag])   
    console.log(result)
}



Flag.prototype.updateConstructionFlag = function (structureType){
    
}