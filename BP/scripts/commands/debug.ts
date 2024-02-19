import { ChatSendBeforeEvent, system } from '@minecraft/server'
import Command, { ArgType } from './command'

export default class DebugCommand extends Command {
    public constructor() {
        super('debug', false, ['boolean'])
    }

    public run(event: ChatSendBeforeEvent, args: ArgType[]) {
        const value = args[0] as boolean
        const player = event.sender

        player.setProperty('class_pvp:debugging', value)
        system.runTimeout(() =>
            player.sendMessage(`Debug ${player.getProperty('class_pvp:debugging') as boolean === true ? 'enabled' : 'disabled'}`),
            1
        )
    }
}