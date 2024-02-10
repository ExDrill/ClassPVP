import { Player, EquipmentSlot } from '@minecraft/server'
import PlayerClass from './playerClass'

export default class WarriorClass extends PlayerClass {

    public constructor() {
        super('warrior')
    }

    public enableEvents(): void {

    }

    public disableEvents(): void {
    }

    public equip(player: Player): void {
        const inventory = player.getComponent('minecraft:inventory')
        const equippable = player.getComponent('minecraft:equippable')
        const container = inventory.container

        equippable.setEquipment(EquipmentSlot.Head, PlayerClass.createItemStack('class_pvp:warrior_helmet'))
        equippable.setEquipment(EquipmentSlot.Chest, PlayerClass.createItemStack('class_pvp:warrior_chestplate'))
        equippable.setEquipment(EquipmentSlot.Legs, PlayerClass.createItemStack('class_pvp:warrior_leggings'))
        equippable.setEquipment(EquipmentSlot.Feet, PlayerClass.createItemStack('class_pvp:warrior_boots'))

        container.setItem(0, PlayerClass.createItemStack('minecraft:stone_sword'))
    }
}