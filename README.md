# Jake's Football Tracker Card
A Home Assistant Lovelace card to display JakeP121/HASS-Football data

## Installation

### Option A (HACS)
- Go to HACS > Integration.
- Click the three dots in the upper right corner and click 'Custom Repositories'.
- Add https://github.com/JakeP121/jakes-football-tracker-card/ to your repositories.
- Jake's Football Tracker Card should now show up on your HACS integration page, click it and click download.
- Restart Home Assistant.
### Option B (Manual Installation)
- Install https://github.com/JakeP121/HASS-Football
- Download jakes-football-tracker-card.js 
- In Home Assistant, go to file editor and create a /homeassistant/www/community/jakes-football-tracker-card/ directory
- Copy jakes-football-tracker-card.js into the directory.
- Go to Settings > Dashboards and click the hamburger menu in the top right to go to Resources.
- Add a resource with the following values:
  -  url: /local/community/jakes-football-tracker-card/jakes-football-tracker-card.js
  - type: Javascript Module
- Reload HomeAssistant and then you should be able to add the card to your dashboards.

## Adding card to your dashboard
Currently only supports yaml configuration.

type: custom:jakes-football-tracker-card
entity: sensor.jft_team_wales

## Arguments
| Name | Description | Required |  Values |
| --- | --- | --- | --- |
| `entity` | Name of the HASS-Football team sensor | Yes  | sensor.jft_{your_team} |
| `show_upcoming_fixture` | Display the upcoming fixture, instead of the current/previous fixture | No  | true/false |
