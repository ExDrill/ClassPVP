import { world, system, ProjectileHitEntityAfterEvent, ItemUseAfterEvent, ProjectileHitBlockAfterEvent } from '@minecraft/server'
import ArcherClass from '../playerClasses/archer'

export function hitEntityEffects(event: ProjectileHitEntityAfterEvent) {
    const entity = event.getEntityHit().entity
    const projectile = event.projectile
    const location = event.location

    if (projectile.typeId != 'class_pvp:thrown_dagger') return

    const mobEffect = projectile.getProperty('class_pvp:mob_effect') as string

    if (mobEffect == 'poison') {
        entity.addEffect(mobEffect, 60, {
            amplifier: 2,
            showParticles: true
        })   
    }
    if (mobEffect == 'slowness') {
        entity.addEffect(mobEffect, 200, {
            amplifier: 3,
            showParticles: true
        })
    }
    world.playSound(`item.throwing_dagger.hit_${mobEffect}`, location)
    projectile.remove()
}

export function hitBlockEffects(event: ProjectileHitBlockAfterEvent) {
    const projectile = event.projectile

    if (projectile.typeId != 'class_pvp:thrown_dagger') return

    if (projectile.lifetimeState) {
        projectile.remove()
    }
}

export function reloadDaggers(event: ItemUseAfterEvent): void {
    const user = event.source
    const inventory = user.getComponent('minecraft:inventory')
    const container = inventory.container
    const stack = event.itemStack
    
    if (user.getItemCooldown('throwing_dagger') > 0) return
    
    if (stack.amount == 1) {
        if (stack.typeId == 'class_pvp:slowness_throwing_dagger') {
            const stack = ArcherClass.createThrowingDagger('slowness', 3)
            system.runTimeout(() => container.setItem(1, stack), 50)
        }
        if (stack.typeId == 'class_pvp:poison_throwing_dagger') {
            const stack = ArcherClass.createThrowingDagger('poison', 1)
            system.runTimeout(() => container.setItem(2, stack), 100)
        }
    }
}