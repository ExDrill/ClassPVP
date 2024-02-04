import { world, system, Player } from '@minecraft/server'



export function init() {
    for (const player of world.getAllPlayers()) {
        system.runInterval(async () => tryRefill(player), 5)
    }
}


async function tryRefill(player: Player) {
    const inventory = player.getComponent('minecraft:inventory')
    const container = inventory.container

    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);

        


    }
}
