class JakesFootballTrackerCard extends HTMLElement {
    /*
        type: custom:jakes-football-tracker-card
        entity: sensor.jft_team_wales
        show_upcoming_fixture: true (optional)
    */

    // Whenever the state changes, a new `hass` object is set. Use this to
    // update your content.
    set hass(hass) {
        // Initialize the content if it's not there yet.
        if (!this.content) {
            this.innerHTML = `
            <style>
                ${this.generateStyles()}
            </style>
            <ha-card>
                <div class="card-content"></div>
            </ha-card>
            `;
            this.content = this.querySelector("div");
        }

        const entityId = this.config.entity;
        const state = hass.states[entityId];

        if (this.config.show_upcoming_fixture) {
            if (state.attributes.next_fixture) {
                this.generateUpcomingFixtureCard(state.attributes.next_fixture);
            }
            else {
                // No upcoming fixture
            }
        }
        else
        {
            if (state.attributes.current_fixture) {
                this.generateFixtureCard(state.attributes.current_fixture, true);
            }
            else if (state.attributes.previous_fixture) {
                this.generateFixtureCard(state.attributes.previous_fixture, false);
            }
            else {
                // No current or previous fixture
            }
        }
    }

    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config) {
      if (!config.entity) {
        throw new Error("You need to define an entity");
      }
      this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      return 3;
    }

    generateStyles() {
        return `
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
            position: relative;
            overflow: hidden;
        }

        .container {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1;
            overflow: hidden;
        }

        .match-title {
            font-weight: bold;
            font-size: 1.1em;
        }

        .match-location {
            opacity: 0.6;
        }

        .match-status {
            font-weight: bold;
            font-size: 1.2em;
        }

        .scoreboard {
            display: flex;
            margin: 10px 0px;
        }

        .team {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .team-logo {
            width: 100px;
            height: 100px;
            object-fit: contain;
        }

        .team-name {
            font-size: 1.5em;
            margin: 10px 0;
            font-weight: bold;
        }

        .match-data {
            display: flex;
            flex-direction: column;
            opacity: 0.6;
            margin: auto 50px;
            align-items: center;
        }

        .score {
            display: flex;
            font-weight: bold;
            font-size: 2em;
            align-items: center;
        }

        .score-divider {
            margin: 5pt;
        }

        .timer {
            text-align: center;
        }

        .background-logo {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0.1;
            width: 150px;
            height: 150px;
            z-index: -1;
        }

        .background-logo img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
        `;
    }

    generateFixtureCard(fixture, match_in_progress) {
        var match_time = ""
        if (match_in_progress) {
            match_time = fixture.fixture.status.elapsed.toString() + '\'';
        }

        this.content.innerHTML = `
        <div class="container">
            <div class="match-title">
                ${fixture.competition.name} - ${fixture.competition.round}
            </div>
            <div class="match-location">
                ${this.getFixtureLocation(fixture)}
            </div>
            <div class="scoreboard">
                <div class="team">
                    <div class="background-logo">
                        <img src="${fixture.home_team.logo}" alt="${fixture.home_team.name} Background Logo">
                    </div>
                    <img src="${fixture.home_team.logo}" alt="${fixture.home_team.name} Logo" class="team-logo">
                    <span class="team-name">${fixture.home_team.name}</span>
                </div>
                <div class="match-data">
                    <div class="score">
                        <span class="team-score">${fixture.goals.home}</span><span class="score-divider"> - </span><span class="team-score">${fixture.goals.away}</span>
                    </div>
                    <div class="timer">${match_time}</div>
                </div>
                <div class="team">
                    <div class="background-logo">
                        <img src="${fixture.away_team.logo}" alt="${fixture.away_team.name} Background Logo">
                    </div>
                    <img src="${fixture.away_team.logo}" alt="${fixture.away_team.name} Logo" class="team-logo">
                    <span class="team-name">${fixture.away_team.name}</span>
                </div>
            </div>
            <div class="match-status">
                ${fixture.fixture.status.long}
            </div>
        </div>
        `;
    }

    generateUpcomingFixtureCard(fixture) {
        const date = new Date(fixture.fixture.date)
        this.content.innerHTML = `
        <div class="container">
            <div class="match-title">
                ${fixture.competition.name} - ${fixture.competition.round}
            </div>
            <div class="match-location">
                ${this.getFixtureLocation(fixture)}
            </div>
            <div class="scoreboard">
                <div class="team">
                    <div class="background-logo">
                        <img src="${fixture.home_team.logo}" alt="${fixture.home_team.name} Background Logo">
                    </div>
                    <img src="${fixture.home_team.logo}" alt="${fixture.home_team.name} Logo" class="team-logo">
                    <span class="team-name">${fixture.home_team.name}</span>
                </div>
                <div class="match-data">
                    <div class="score">
                        <span class="score-divider">vs</span>
                    </div>
                </div>
                <div class="team">
                    <div class="background-logo">
                        <img src="${fixture.away_team.logo}" alt="${fixture.away_team.name} Background Logo">
                    </div>
                    <img src="${fixture.away_team.logo}" alt="${fixture.away_team.name} Logo" class="team-logo">
                    <span class="team-name">${fixture.away_team.name}</span>
                </div>
            </div>
            <div class="match-status">
                KO: ${date.toLocaleString()}
            </div>
        </div>
        `;
    }

    getFixtureLocation(fixture) {
        var match_location = "";
        if (fixture.fixture.stadium !== null)
        {
            match_location += fixture.fixture.stadium;
        }

        if (fixture.fixture.location !== null)
        {
            if (match_location != "") {
                match_location += " || ";
            }

            match_location += fixture.fixture.location;
        }

        return match_location;
    }
}

console.info("%c Jake's Football Tracker Card %s IS INSTALLED",
"color: green; font-weight: bold",
    "v0.1.0");

customElements.define("jakes-football-tracker-card", JakesFootballTrackerCard);
