/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawnLogic');
 * mod.thing == 'a thing'; // true
 */
 
 
// creepFactory.js
const roles = {
    //builder: require('builder'),
    miner:      require('miner'),
    upgrader:      require('upgrader'),
    hauler:      require('hauler'),
    scout:      require('scout'),
    // Add other creep classes here.
};


module.exports = {
    spawnCreep: function(spawn, requestedSpawn, memoryAddition) {
        
        var result 
        if (roles[requestedSpawn.role]) {
            const body = roles[requestedSpawn.role].body;
            const memory = roles[requestedSpawn.role].memory;
            const name = `${requestedSpawn.role}_${Game.time}`;
            result = spawn.spawnCreep(body, name, { dryRun: true });
            if (result === OK) {
                spawn.spawnCreep(body, name)
                console.log(`Spawning new ${requestedSpawn.role}: ${name}`);
                console.log("assigning the following memory to the spawnign creep: " + JSON.stringify(memoryAddition))
                Memory.creeps[name] = memory;
                Memory.creeps[name].assignedBase = "Base" + spawn.room.name
                Memory.creeps[name].role = requestedSpawn.role
                Memory.creeps[name].assignedFlag = requestedSpawn.flag
            }
            if (result ===ERR_NOT_ENOUGH_ENERGY){
                //console.log("spawnLogic: not enough energy")
            }
        }
        return result
    }
};