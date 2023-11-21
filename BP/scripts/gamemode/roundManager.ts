import { world, system, Player } from '@minecraft/server'
import * as TeamUtils from '../utils/teams'

export default class RoundManager {
	private ongoingRound?: number

	public constructor(roundTimeTicks: number = 4800) {
		world.setDynamicProperty('class_pvp:round_time', roundTimeTicks)
	}

	public startRound() {
		if (this.ongoingRound) {
			world.sendMessage('There is already an ongoing round!')
			return
		}
		this.setTeams()
		this.ongoingRound = system.runInterval(() => this.tick(), 1)
	}
	
	private setTeams() {
		for (const player of this.getPlayers()) {
			player.setProperty('class_pvp:team', TeamUtils.applyRandomTeam())
			player.nameTag = `§${TeamUtils.getColorCode(player)}${player.name}`
		}
	}

	public getPlayers(): Player[] {
		return world.getAllPlayers().filter(player => 
			player.getDynamicProperty('class_pvp:playing')
		)
	}

	public tick() {
		const roundTime = this.getRoundTime()
		
		if (roundTime <= 0) {
			this.endRound()
		}
		else {
			this.setRoundTime(roundTime - 1)
		}
	}
	
	public endRound() {
		if (this.ongoingRound) {
			system.clearRun(this.ongoingRound)
			return
		}
		world.sendMessage('There is currently no ongoing round!')
	}

	public isOngoingRound(): boolean {
		return world.getDynamicProperty('class_pvp:round_time') > 0
	}

	public setRoundTime(timeTicks: number): void {
		world.setDynamicProperty('class_pvp:round_time', timeTicks)
	}

	public getRoundTime(): number {
		return world.getDynamicProperty('class_pvp:round_time') as number
	}
}