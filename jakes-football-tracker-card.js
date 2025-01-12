class JakesFootballTrackerCard extends HTMLElement {
    /*
        type: custom:jakes-football-tracker-card
        entity: sensor.jft_team_wales
        show_upcoming_fixture: true (optional)
        show_background_logos: false (optional)
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

        if (!hass)
        {
            return;
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
            padding: 5px 0px;
        }

        .match-title {
            font-weight: bold;
            font-size: 1.1em;
            text-align: center;
        }

        .match-location {
            opacity: 0.6;
            text-align: center;
        }

        .match-status {
            font-weight: bold;
            font-size: 1.2em;
            text-align: center;
        }

        .scoreboard {
            display: flex;
        }

        .team {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 45%;
        }

        .team-logo {
            width: 100px;
            height: 100px;
            object-fit: contain;
        }

        .team-name {
            font-size: 1.5em;
            margin: 0px 0px 10px 0;
            font-weight: bold;
            text-align: center;
        }

        .match-data {
            display: flex;
            flex-direction: column;
            opacity: 0.6;
            margin: auto 10px;
            align-items: center;
            width: 10%;
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

        .penalty-shootout {
            align-items: center;
        }
        
        .penalty-shootout-heading {
            display: flex;
            font-size: 1em;
            text-align: center
        }

        .penalty-shootout-score {
            font-weight: bold;
            font-size: 1em;
            text-align: center
        }

        .timer {
            text-align: center;
        }

        .background-logo {
            position: absolute;
            opacity: 0.1;
            width: 150px;
            height: 150px;
            z-index: -1;
            overflow: visible;
        }
        `;
    }

    generateFixtureCard(fixture, match_in_progress) {
        var match_time = "0'";
        if (match_in_progress) {
            if (fixture.fixture.status.elapsed)
            {
                match_time = fixture.fixture.status.elapsed.toString() + '\'';
            }
        }
        else
        {
            match_time = ""
        }

        var goals_home = 0;
        var goals_away = 0;
        if (fixture.goals)
        {
            goals_home = fixture.goals.home;
            goals_away = fixture.goals.away;
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
                    ${ this.showBackgroundLogos(fixture.home_team) }
                    <img src="${fixture.home_team.logo}" alt="${fixture.home_team.name} Logo" class="team-logo">
                    <span class="team-name">${fixture.home_team.name}</span>
                </div>
                <div class="match-data">
                    <div class="score">
                        <span class="team-score">${goals_home}</span><span class="score-divider"> - </span><span class="team-score">${goals_away}</span>
                    </div>
                    ${ this.showPenaltyShootout(fixture.penalty_shootout) }
                    <div class="timer">${match_time}</div>
                </div>
                <div class="team">
                    ${ this.showBackgroundLogos(fixture.away_team) }
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
                    ${ this.showBackgroundLogos(fixture.home_team) }
                    <img src="${fixture.home_team.logo}" alt="${fixture.home_team.name} Logo" class="team-logo">
                    <span class="team-name">${fixture.home_team.name}</span>
                </div>
                <div class="match-data">
                    <div class="score">
                        <span class="score-divider">vs</span>
                    </div>
                </div>
                <div class="team">
                    ${ this.showBackgroundLogos(fixture.away_team) }
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
                match_location += ", ";
            }

            match_location += fixture.fixture.location;
        }

        return match_location;
    }

    showBackgroundLogos(team) {
        if (!this.config.show_background_logos) {
            return ''
        }

        return `
        <div class="background-logo">
            <img src="${team.logo}" alt="${team.name} Background Logo">
        </div>
        `
    }

    showPenaltyShootout(penalty_shootout) {
        if (!penalty_shootout.home == null || !penalty_shootout.away) {
            return ''
        }

        return `
        <div>
        <div class="penalty-shootout-score">
            <span>${penalty_shootout.home}</span><span class="score-divider"> - </span><span>${penalty_shootout.away}</span>
        </div>
        <div class="penalty-shootout-heading">(penalties)</div>
        </div>
        `
    }
}

console.info("%c Jake's Football Tracker Card %s IS INSTALLED",
    "color: green; font-weight: bold",
    "v0.2.0");

customElements.define("jakes-football-tracker-card", JakesFootballTrackerCard);
