import { world, ProjectileHitEntityAfterEvent, ProjectileHitBlockAfterEvent } from '@minecraft/server'

export function hitEntityEffects(event: ProjectileHitEntityAfterEvent) {
    const entity = event.getEntityHit().entity
    const projectile = event.projectile
    const location = event.location

    if (projectile.typeId != 'class_pvp:throwing_dagger') return
    if (!projectile.lifetimeState) return

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
    const location = event.location

    if (projectile.typeId != 'class_pvp:throwing_dagger') return
    if (!projectile.lifetimeState) return

    world.playSound('item.throwing_dagger.land', location)
    projectile.remove()
}