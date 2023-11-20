import { system, world } from '@minecraft/server'
import Team from '../Team'

class Game {
	public teams: Team[];

	public constructor(teams: Team[]) {
		this.teams = teams;
	}

	public start() {
		for (const team of this.teams) {
			team.start();
		}
	}
}