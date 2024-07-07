Creep.prototype.getEnergyfromFlag = function(flagName){
    groundEnergy = Game.flags[flagName].pos.lookFor(LOOK_ENERGY)[0]
    this.pickup(groundEnergy)
    Game.flags[flagName].pos.lookFor(LOOK_CREEPS)[0].transfer(this,RESOURCE_ENERGY)
    if(this.store.getFreeCapacity(RESOURCE_ENERGY)==0){
        this.memory.state = "freeHauler"
        this.memory.hasEnergy = true
    }
}

Creep.prototype.deliverEnergyToBase = function(flagName){
    var target = Game.flags[flagName].room.find(FIND_MY_SPAWNS)[0]
    var result = this.transfer(target,RESOURCE_ENERGY)
    if (result == OK){
        this.memory.state.hasEnergy = false
    }
    if( result === ERR_NOT_IN_RANGE){
        this.moveTo(target)
    }
    if(result === ERR_INVALID_TARGET){
        this.memory.state = "deliverToController"
        this.memory.assignedFlag = target.room.controller.id
    }
    return result
}

Creep.prototype.test = function(){
    console.log("test function for creep prototype is running")
}

Creep.prototype.getEnergyfromBase = function(flagName){
    target = Game.flags[flagName].room.find(FIND_MY_SPAWNS)[0]
    console.log("1: "+ target) // <---------------------------------------------------------
    this.withdraw(target,RESOURCE_ENERGY)
}