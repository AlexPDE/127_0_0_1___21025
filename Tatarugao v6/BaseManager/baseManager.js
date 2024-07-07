var creepUtils = require('creepUtils');

amountMiner = creepUtils.countCreepsByRole("miner")
amountHauler = creepUtils.countCreepsByRole("hauler")

if(amountMiner == 0 && amountHauler == 0)