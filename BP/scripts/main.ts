import { world, Player } from '@minecraft/server'
import RoundManager from './mechanics/roundManager';

export const ROUND: RoundManager = new RoundManager()

world.afterEvents.chatSend.subscribe(event => {
    const msg = event.message
    const sender = event.sender

    if (msg == 'ready') {
        sender.setDynamicProperty('class_pvp:playing', true)
    }
    if (msg == 'unready') {
        sender.setDynamicProperty('class_pvp:playing', false)
    }
    if (sender.isOp()) {
        if (msg == 'start') {
            ROUND.startRound()
        }
        if (msg == 'end') {
            ROUND.endRound()
        }
    }
})

world.afterEvents.worldInitialize.subscribe(event => {
    ROUND.cleanup()
})

world.afterEvents.playerSpawn.subscribe(event => {
    if (event.initialSpawn) {
        ROUND.cleanupPlayer(event.player)
    }
})