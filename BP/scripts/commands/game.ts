import { ChatSendBeforeEvent, system, Player } from '@minecraft/server'
import Command, { ArgType } from './command'
import { endGame, endVote, startGame, stopCountdown } from '../events/lobby_events'
import Gamemode from '../modes/gamemode'

export default class GameCommand extends Command {
    public constructor() {
        super('game', true, ['string'])
    }

    public run(event: ChatSendBeforeEvent, args: ArgType[]) {
        const player = event.sender
        const subcommand = args[0] as string

        if (subcommand === 'start')
            GameCommand.start()
        else if (subcommand === 'end')
            GameCommand.end(player)
    }

    private static start() {
        stopCountdown()
        endVote()
        system.runTimeout(() => startGame(), 1)
    }

    private static end(player: Player) {
        if (Gamemode.isOngoingRound())
            endGame()
        else
            player.sendMessage('There is no ongoing round!')
    }
}