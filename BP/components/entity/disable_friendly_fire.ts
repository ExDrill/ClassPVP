const teams = [
	'none',
	'quartz',
	'iron',
	'netherite',
	'redstone',
	'copper',
	'gold',
	'emerald',
	'diamond',
	'lapis',
	'amethyst'
]

export default defineComponent((context) => {
	context.name('class_pvp:disable_friendly_fire')
	context.schema({
		type: 'object',
		additionalProperties: false
	})
	context.template((args, { create }) => {
		create({
			'minecraft:damage_sensor': {
				'triggers': [
					{
						'on_damage': {
							'filters': {
								'any_of': getDamageFilters()
							}
						},
						'deals_damage': false
					}
				]
			}
		}, 'minecraft:entity/components')
	})
})

function getDamageFilters() {
	const data = []
	for (const team of teams) {
		data.push({
			'all_of': [
				{
					'test': 'enum_property',
					'domain': 'class_pvp:team',
					'subject': 'self',
					'value': team
				},
				{
					'test': 'enum_property',
					'domain': 'class_pvp:team',
					'subject': 'other',
					'value': team
				}
			]
		})
	}
	return data
}