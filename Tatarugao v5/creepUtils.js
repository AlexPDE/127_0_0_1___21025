/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creepUtils');
 * mod.thing == 'a thing'; // true
 */
const _ = require('lodash');

module.exports = {
    countCreepsByRole: function (role) {
        return _.filter(Object.values(Game.creeps), (creep) => creep.memory.role === role).length;
    }
};

