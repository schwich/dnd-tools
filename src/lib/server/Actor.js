export class Actor {
	constructor(
		id,
		type,
		name,
		maxHealth,
		currentHealth,
		tempHealth,
		initiative,
		conditions,
		markedNonLethal
	) {
		this.id = id;
		this.type = type; // 'player' | 'enemy'
		this.name = name;
		this.maxHealth = maxHealth;

		this.currentHealth = currentHealth ?? maxHealth;
		this.tempHealth = tempHealth ?? 0;
		this.initiative = initiative ?? 0;
		this.conditions = [];
		this.conditions = conditions ?? [];
		this.markedNonLethal = markedNonLethal ?? false;

		this.determineStatus();
	}

	damage(amount) {
		let damage = amount;
		if (this.tempHealth) {
			if (damage > this.tempHealth) {
				damage -= this.tempHealth;
				this.tempHealth = 0;
			} else {
				this.tempHealth -= damage;
				damage = 0;
			}
		}

		this.currentHealth -= damage;
		this.determineStatus();
	}

	heal(amount) {
		this.currentHealth += amount;
		if (this.currentHealth > this.maxHealth) {
			this.currentHealth = this.maxHealth;
		}

		this.determineStatus();
	}

	addTempHealth(amount) {
		this.tempHealth = amount;
	}

	healthPercentage() {
		return Math.round((100 * (this.currentHealth + this.tempHealth)) / this.maxHealth);
	}

	addCondition(condition) {
		this.conditions.push(condition);
	}

	clearConditions() {
		this.conditions = [];
	}

	removeCondition(condition) {
		const index = this.conditions.indexOf(condition);
		if (index !== -1) {
			this.conditions.splice(index, 1);
		}
	}

	determineStatus() {
		const h = this.healthPercentage();
		if (h > 80) {
			this.currentStatus = 'healthy';
		} else if (h > 30) {
			this.currentStatus = 'winded';
		} else if (h > 0) {
			this.currentStatus = 'bloodied';
		} else {
			if (this.currentHealth <= 0) {
				if (this.markedNonLethal) {
					this.currentStatus = 'knockedOut';
				} else {
					this.currentStatus = 'dead';
				}
			}
		}
	}

	/**
	 * Instantiate the correct child class based on actor type
	 * @param {Actor} actor
	 * @returns {Player | Enemy} based on @field actor.type
	 */
	static instantiateByType(actor) {
		if (actor.type === 'player') {
			return new Player(actor);
		} else if (actor.type === 'enemy') {
			return new Enemy(actor);
		}
	}
}

export class Player extends Actor {
	static fromJson(playerJson) {
		return new Player(JSON.parse(playerJson));
	}

	constructor({
		id,
		type,
		name,
		initiative,
		maxHealth,
		currentHealth,
		tempHealth,
		conditions,
		markedNonLethal
	}) {
		super(
			id,
			type,
			name,
			maxHealth,
			currentHealth,
			tempHealth,
			initiative,
			conditions,
			markedNonLethal
		);
	}

	determineStatus() {
		const h = this.healthPercentage();
		if (h > 80) {
			this.currentStatus = 'healthy';
		} else if (h > 30) {
			this.currentStatus = 'winded';
		} else if (h > 0) {
			this.currentStatus = 'bloodied';
		} else {
			if (this.currentHealth <= 0) {
				if (this.markedNonLethal) {
					this.currentStatus = 'knockedOut';
				} else if (this.currentHealth <= -this.maxHealth) {
					this.currentStatus = 'dead';
				} else {
					this.currentStatus = 'knockedOut';
				}
			}
		}
	}
}

export class Enemy extends Actor {
	static fromJson(enemyJson) {
		return new Enemy(JSON.parse(enemyJson));
	}

	constructor({
		id,
		type,
		name,
		initiative,
		maxHealth,
		tags,
		currentHealth,
		tempHealth,
		conditions,
		markedNonLethal
	}) {
		super(
			id,
			type,
			name,
			maxHealth,
			currentHealth,
			tempHealth,
			initiative,
			conditions,
			markedNonLethal
		);

		// to keep track of specific enemies during combat
		this.tags = tags;
	}
}
