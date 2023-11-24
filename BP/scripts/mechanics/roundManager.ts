import { world, system, Player } from '@minecraft/server'
import ScoreboardManager from './scoreboardManager'
import * as TeamUtils from '../utils/teams'

export default class RoundManager {
	private ongoingInterval?: number
	public scoreboardManager: ScoreboardManager

	public constructor() {
		this.scoreboardManager = new ScoreboardManager()
	}

	public startRound() {
		if (this.ongoingInterval) {
			world.sendMessage('There is already an ongoing round!')
			return
		}
		this.setTeams()
		this.setRoundTime(4800)
		this.ongoingInterval = system.runInterval(() => this.tick(), 1)
	}
	
	private setTeams() {
		for (const player of this.getPlayers()) {
			player.setProperty('class_pvp:team', TeamUtils.applyRandomTeam())
			player.nameTag = `§${TeamUtils.getColorCode(player)}${player.name}`
		}
	}

	public getPlayers(): Player[] {
		return world.getAllPlayers().filter(player => {
			const isPlaying = player.getDynamicProperty('class_pvp:playing')
			return isPlaying as boolean
		})
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
		if (this.ongoingInterval) {
			system.clearRun(this.ongoingInterval)
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

	public cleanup(): void {
		for (const player of this.getPlayers()) {
			this.cleanupPlayer(player)
		}
	}

	public cleanupPlayer(player: Player) {
		this.scoreboardManager.setScore(player, 'class_pvp:eliminations', 0)
	}
}