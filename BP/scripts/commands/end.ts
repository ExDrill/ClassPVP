import { ChatSendBeforeEvent } from '@minecraft/server'
import Command from './command'
import { endGame, } from '../events/lobbyEvents'
import Gamemode from '../modes/gamemode'

export default class EndCommand extends Command {
    public constructor() {
        super('end', true)
    }

    public run(event: ChatSendBeforeEvent) {
        const player = event.sender

        if (Gamemode.isOngoingRound()) {
            endGame()
        } else
            player.sendMessage('There is no ongoing round!')
    }
}