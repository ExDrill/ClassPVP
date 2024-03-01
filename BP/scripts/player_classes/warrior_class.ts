import { world, Player, EquipmentSlot, ItemStack } from '@minecraft/server'
import * as Events from '../events/warrior_events'
import PlayerClass from './player_class'

export default class WarriorClass extends PlayerClass {
    display = new ItemStack('minecraft:stone_sword')

    public constructor() {
        super('warrior')
    }

    public enableEvents(): void {
        world.afterEvents.entityHurt.subscribe(Events.performSweepAttack)
    }

    public disableEvents(): void {
        world.afterEvents.entityHurt.unsubscribe(Events.performSweepAttack)
    }

    public equip(player: Player): void {
        const inventory = player.getComponent('minecraft:inventory')
        const equippable = player.getComponent('minecraft:equippable')
        const container = inventory.container

        equippable.setEquipment(EquipmentSlot.Chest, PlayerClass.createItemStack('class_pvp:warrior_armor'))
        container.setItem(0, PlayerClass.createItemStack('minecraft:stone_sword'))
    }
}