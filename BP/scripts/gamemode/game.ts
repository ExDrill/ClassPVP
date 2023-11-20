import { Player } from '@minecraft/server';
import Team from '../team'
import { Color } from './colors'

export default class Game {
	public teams: Team[];

	public constructor(teams: Team[]) {
		this.teams = teams;
	}

	public getTeamByColor(color: Color): Team {
		return this.teams.find((team) =>
			Color[team.color].valueOf() === Color[color].valueOf());
	}

	public getPlayerTeam(player: Player): Team {
		return this.teams.find((team) =>
			team.players.includes(player));
	}

	public start() {
		for (const team of this.teams) {
			team.start();
		}
	}

	public end() {
		for (const team of this.teams) {
			team.end();
		}
	}
}