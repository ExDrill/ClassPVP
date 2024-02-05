import { ChatSendBeforeEvent } from '@minecraft/server'
import Command from './command'
import ArcherClass from '../playerClasses/archer'
import { playerClasses } from '../main'

export default class EquipCommand extends Command {
    public constructor() {
        super('equip', true, ['string'])
    }

    public run(event: ChatSendBeforeEvent, args?: (string|number)[]): void {
        const player = event.sender
        const chosenClass = args[0] as string
        const playerClass = playerClasses.find(query => query.getID() == chosenClass)

        if (chosenClass == 'none') {
            player.runCommand('clear @s')
            player.setProperty('class_pvp:player_class', 'none')
            player.sendMessage('Cleared player class!')
            return
        }
        if (!playerClass) {
            player.sendMessage(`Failed to equip class. Player class '${chosenClass}' does not exist.`)
            return
        }
        playerClass.equip(player)
        player.setProperty('class_pvp:player_class', playerClass.getID())

        player.sendMessage(`Successfully equipped '${playerClass.getID()}'`)
    }
}