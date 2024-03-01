import { ChatSendBeforeEvent } from '@minecraft/server'
import Command from './command'
import * as Bossbar from '../utils/bossbar'

export default class BossbarPosCommand extends Command {
    public constructor() {
        super('bosspos', false)
    }

    public run(event: ChatSendBeforeEvent) {
        const player = event.sender

        let str = ''
        for (const bar of Bossbar.getBossbarEntities()) {
            const pos = bar.location
            str += `(${pos.x}, ${pos.y}, ${pos.z}) `
        }

        player.sendMessage(str)
    }
}