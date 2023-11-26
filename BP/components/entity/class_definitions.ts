export default defineComponent((context) => {
    context.name('class_pvp:class_definitions')
    context.schema({
        type: 'object',
        propertyNames: {
            type: 'string'
        },
        patternProperties: {
            '.': {
                type: 'object',
                additionalProperties: false,
                properties: {
                    max_health: {
                        type: 'integer'
                    },
                    movement_speed: {
                        type: 'number'
                    },
                    scale: {
                        type: 'number'
                    }
                }
            }
        }
    })
    context.template((args, templateContext) => {
        const permutations = []
        const values = []

        for (const playerClass of Object.keys(args)) {
            const classData = args[playerClass]
            permutations.push({
                condition: `query.property('class_pvp:player_class') == '${playerClass}'`,
                components: {
                    'minecraft:health': {
                        value: classData.max_health,
                        max: classData.max_health
                    },
                    'minecraft:movement': {
                        value: classData.movement_speed
                    },
                    'minecraft:scale': {
                        value: classData.scale
                    }
                }
            })
            values.push(playerClass)
        }
        templateContext.create({ permutations }, 'minecraft:entity')
        templateContext.create({
            'class_pvp:player_class': {
                type: 'enum',
                default: 'none',
                values
            }
        }, 'minecraft:entity/description/properties')
    })
})