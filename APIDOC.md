TYPE: GET
PATH: /newGame
QUERY PARAMETERS: name, size (name of player, size of gameboard)
RETURN TYPE: JSON
DESCRIPTION: sends client data on game and user
EXAMPLE PATH: /newGame?name=matt?size=9
EXAMPLE RETURN:
{
    "game_id": 1,
    "player": {
        "id": 1,
        "name": matt,
        "board" [
            {"id": 5, "text": "Your camera is off"},
            {"id": 5, "text": "Your camera is off"},
            {"id": 5, "text": "Your camera is off"},
            {"id": 5, "text": "Your camera is off"},
            {"id": 1, "text": "FREE"},
            {"id": 5, "text": "Your camera is off"},
            {"id": 5, "text": "Your camera is off"},
            {"id": 5, "text": "Your camera is off"},
            {"id": 5, "text": "Your camera is off"},
            {"id": 5, "text": "Your camera is off"}
        ]
    }
};

TYPE: POST
PATH; /selectScenario
BODY PARAMETERS: game_id, scenario_id (id of game, id of selected scenario)
BODY TYPE: FormData
RETURN TYPE: JSON
DESCRIPTION: adds selected scenario id to database of gameboard. if successful returns game id and scenario id telling client to go forward with any actions then.
Throws error if scenario_id was already selected or if scenario_id doesnt exist in board.
EXAMPLE PATH: /selectScenario BODY:{game_id=123 scenario_id=1}
EXAMPLE RETURN:
{
    "game_id": 123,
    "scenario_id": 1
};

TYPE: POST
PATH: /bingo
BODY PARAMETER: game_id (id of game)
BODY TYPE: FormData
RETURN TYPE: JSON
DESCRIPTION: checks if user's game attatched to game id has won.
Will return game id and winner.
Throws error if game id already has associated winner
If user won, returns users name. I not returns null for winner
EXAMPLE PATH: /bingo BODY:{game_id=123}
EXAMPLE RETURN:
{
    "game_id": 123,
    "winner": null
}

TYPE: GET
PATH: /resumeGame
QUERY PARAMETERS: game_id, player_id (id of game, id of player)
RETURN TYPE: JSON
DESCRIPTION: Will return entire data on game that matches game id and player id
Throws error if player id doesn't match game id.
EXAMPLE PATH: /bingo?game_id=123&player_id=123
EXAMPLE RETURN:
{
    "game_id": 1,
    "player": {
        "id": 1,
        "name": matt,
        "board" [
            {"id": 5, "text": "Your camera is off"},
            {"id": 105, "text": "Your camera is off"},
            {"id": 205, "text": "Your camera is off"},
            {"id": 305, "text": "Your camera is off"},
            {"id": 1, "text": "FREE"},
            {"id": 405, "text": "Your camera is off"},
            {"id": 505, "text": "Your camera is off"},
            {"id": 605, "text": "Your camera is off"},
            {"id": 705, "text": "Your camera is off"},
            {"id": 805, "text": "Your camera is off"}
        ],
        "selected_scenarios": [
            5,
            1
        ]
    }
}

