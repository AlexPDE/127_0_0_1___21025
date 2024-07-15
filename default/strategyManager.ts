import { initial } from "lodash"
import baseManager from "./baseManager"
import taskManager from "./taskManager"

let startegyManager: {
    /**
     * @param {Creep} creep
     */
    initiate(): void,
    run(): void,
}

export default startegyManager = {
    initiate():void{
        Memory.strategyManager = {
            TasksManager: {
                potentialMiningTask: [],
                miningTasks: [],
                militaryTasks: [],
                haulerTask:[],

            },
            explorationManager: {
                exploredRooms:[],
                priorityExploration:[],
                exploration:[],
            },
            roomManager:{}   
        }
        let spawn = Game.spawns["Spawn1"]
        baseManager.initiate(spawn.pos)
    },

    run():void {
        taskManager.scheduleMiningSubTasks()
        for (var name in Memory.strategyManager.roomManager){
            var room:Room = Game.rooms[name]
            taskManager.scheduleSpawn(room)
        }
        
    }
}
