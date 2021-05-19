# Final Project: Zoomingo
_Special thanks to Andrew Fitz Gibbon for this assignment._

Your task for the final project will be to build a Zoom bingo game. This is a "Full Stack" project 
and covers HTML, CSS, client-side JavaScript, Node.js, and a SQL database. Though some aspects of 
this are similar to a CP, it is more like a HW in that no portion of this assignment should be 
posted online. 

This is a _variation_ on the game, Bingo. Since we're all stuck in Zoom calls all day every day, we start to see some common patterns. Every time a player sees one of these "scenarios" happen, they "select" it on their board. Once they have enough scenarios selected, they can call "BINGO!" and potentially win (but only if they have enough scenarios selected).

When the page is opened up, a player can enter their name, how big of a board they want, and start a game. In our simplified variation of the game, there's only ever one player, but all the information for their board and the scenarios are stored in a backend database.

A lot of the implementation details and style (CSS) are up to you, but the details specified in this document **must** exist. The rest is up to you, as long as the specified behavior exists.

## Learning Objectives

This project is the culmination of everything we've learned this quarter. You are expected to implement this from scratch, demonstrating knowledge and working understanding of:

* HTML for content and structure, choosing the semantically correct tags.
* CSS for style and layout, using flex and the box model.
* Client-side JavaScript to add behavior and call APIs.
* Node.js for writing your own API.
* SQL for providing data persistence in a relational database.

All standards we've built upon all quarter continue to apply, for example:
* Good code style, according to our [Code Quality Guidelines](https://courses.cs.washington.edu/courses/cse154/codequalityguide).
* Implementing feedback given in past assignments.
* Good documentation at every level (project, API, file, and function).

## Starter Files

 File/folders | Description |
|--------------------|------------------------------|
| `README.md` |  This file, outlining the requirements. |
| `scenarios.sql` | A list of potential bingo scenarios. Written as a series of INSERT statements assuming a `scenarios` table with a column named `text`. |
| `.gitignore` | The list of standard files to ignore in the git repository (and submission). |

There are no other starter files. You're expected to implement the "full stack".

## Final Deliverables

| File          | Description |
|---------------|------------------------------|
| `SUBMISSION.txt` | ***NEW FILE REQUIREMENT!*** See below for details. |
| `package.json` | The JSON file with your project dependencies (e.g. `express`) which you initialize with `npm init`. |
| `APIDOC.md` | The full API Documentation for your backend. |
| `app.js` | The Node.js service that is your backend API. |
| `zoomingo.db` | The database used to run your project, including all relevant tables. *If this file has any issues (e.g., it's missing, or doesn't include relevant tables or columns) we won't be able to grade your project.* |
| `public/zoomingo.js`  | The client-side JavaScript that will call the API built in `app.js` and provide frontend behavior for the required features. |
| `public/zoomingo.html`  | The HTML for your frontend. It's assumed that this file is the "homepage", or starting place for the entire frontend. |
| `public/styles.css`  | The CSS styles for your frontend. |
| Demo Video | A recording (< 3 minutes) demonstrating the project running. See below for more detail. |

If your implementation requires additional files, those are expected to be included as well, but the files listed here are the _minimum_ requirements.

Additionally, any included `.sql` files must be self-created, **not** auto-generated.

# `SUBMISSION.txt`

The `SUBMISSION.txt` requirement is a new requirement for this assignment. It is free-form english text and must include answers to the following questions:

1. For each of the required features, where should we look for its implementation? Reference the numbers from the section below along with the file name and line numbers . For example:
    ```
    #1:  public/zoomingo.html lines 10-25 and public/required.js lines 10,13, and the function on line 16.
    ```
1. (1 sentence description) What is the name of the file or link to the video of you demonstrating the project running?
1. (No more than 1 paragraph / 4 sentences) What would you have done, fixed, or added if you had more time?

# Demonstration Video

In addition to the `SUBMISSION.txt` written file, you are also required to record a video demonstrating the running application. This video **must**:

* Be no longer than ***3 minutes***.
* Show the project running in a web browser.
* Demonstrate as much behavior as possible within the length limit.
* Be included as a file in the submission.

There are multiple ways create a screencast video:

* [Loom](https://www.loom.com/) By far the easiest, Loom records computer/mobile/tablet screens and optionally a webcam. A "pro" account is free for students with `.edu` email addresses. After recording, it provides you with a shareable URL.
* Quicktime, built-in on Mac, has a screen recording option.
* Game Bar, built-in on Windows, can record a specific app.
* Use a smartphone to record the screen.

(You do not have to use one of these methods. Anything that produces a video file in a commonly-readable format -- like `mp4` -- is acceptable.)

# Implementation Strategies

Since this is our first "full stack" project, implementing the whole thing at once may seem daunting. Here are a couple of strategies that could be useful:

1. Start on the frontend, and get all of the HTML/CSS looking good first, then add some JavaScript (with placeholders/"stubs" for backend API data) to get the DOM manipulation working. Once that works, create the database, and start implementing each backend endpoint one-by-one (starting with `/newGame`).

1. Start on the backend, getting the basic structure of the endpoints working (correct names and methods, parameter validation, returning some placeholder data). Then create the database and one-by-one start replacing placeholder data with data from the db.

1. Choose one of the backend endpoints (e.g., `/bingo`) and starting on its frontend components (e.g., the `#bingo` button) implement it completely. Then, choose the next simplest endpoint (e.g., `selectScenario`) and do the same.

1. Start by sketching out on paper the various components and their connections (e.g., a line between the `#bingo` button and the `/bingo` endpoint and then from it to whatever database tables are required for it). Once you have the full picture, choose either the components with the least lines (aka, least amount of complexity) and implement that. Any connecting lines can usually be temporarily implemented with "fake" connections (e.g., hard-coded data in lieu of having a database). Follow the lines and implement the connections until the full project is complete.

All of these are valid strategies, and they are not the only ones. But they all share the attribute of starting small and implementing what you see as easy to accomplish. Once you accomplish progressively bigger aspects of the project, the more complicated parts either fall into place or start to seem not so big anymore.

# External Requirements

Your project must match the behavior of the screencast provided here. It does not have to _exactly_ match pixel-for-pixel what's shown here style-wise, but the behavior **must** be as close as possible.

* [Screencast of Required Behavior](https://courses.cs.washington.edu/courses/cse154/20sp/exams/assets/zoomingo.mp4)

## Behavior Requirements
All of the features listed in this section must be implemented:

1. A player can enter their name and choose a board size. These input elements are locked (disabled) after a New Game starts.
    * The name field is an `input` tag with ID `name` and `type="text"`.
    * The board size field is a `select` tag with ID `size-select`.
      * The `value`s for the `option`s are integers representing the total number of cells for this size (e.g., "9"). The `textContent` for these should be as the size of a square (e.g., "3x3").
    * Both fields should start as enabled.
    * After the "New Game" button is clicked, these fields' disabled property is set to `true`. Once the game finishes (`#bingo` is clicked) or is reset (`#reset` is clicked), disabled is set to `false`.

1. If the user has not yet selected a size or the game was reset, the board is empty. After a size is selected, the board is **always** displayed as a grid with equal number of cells on each side (e.g., a 5x5 grid).
    * The board's sides, as measured in pixels, do not have to be the same on all sides. This should be accomplished by using a `flex` container using the `flex-direction` of `row`.
    * When a new board size is selected, the display updates to reflect the new size.
    * The board is a `div` with an ID of `board`.
    * The `change` event on `#size-select` modifies the DOM, adding or removing children `div`s to `#board` according to how many squares are required.
      * These `div`s should have the class `square`
      * They should also have a child `p` element with the class `scenario`.
      * The `.square` elements should be used in CSS for layout (e.g., as flex items).
      * The `.scenario` elements will be used in the future (see below) for holding the scenario text.

1. Clicking the "New Game" button populates the board with scenarios, fetched from the backend. (A "scenario" is the contents of each cell in the board. For example: "Can you hear me now?")
    * The `button` with ID `new-game` on click makes a fetch call to `/newGame`.
    * Possible errors or issues: 
      * If the user has not selected a board size or entered a name, the game cannot start (and the API will not be called). Instead, an error is displayed to the user and the board left empty.
      * If the backend does not return enough scenarios, an error is displayed to the user and the board left empty.
      * Errors should be added as the `textContent` of a `p` element with ID `error`.
    * This fetch (method: GET) passes the value of `#size-select` and `#name` as **query parameters**, with the keys of size and name respectively.
    * `/newGame` returns JSON representing the board. See the endpoint description below for more details on its structure.
    * Each `.scenario` element within the `#board` has:
      * Its text content set to the text of the scenario.
      * Its `id` set to the ID of the scenario. This will be used later to be able to reference this scenario.

1. All boards must contain a "Free" scenario, and it must be in the middle of the board.
    * The "Free" scenario always has a scenario ID of 1. IDs are unique, and no other scenario can have the ID of 1.

1. Clicking the "Reset" button (with ID `reset`) clears the board and clears data in LocalStorage.
    * The `#new-game` and `#size-select` input elements are re-enabled.
    * `#board`'s innerHTML is cleared.
    * Any success or error messages are cleared as well.

1. Scenarios can be clicked on, and are styled to indicate that they have been selected.
    * All elements with the class `scenario` have a click event listener.
    * When a scenario is clicked, the `/selectScenario` endpoint is called, passing the scenario ID.
      * From above, you should be able to query for the scenario ID by looking for a descendent element of the clicked scenario with class `scenario-id` and reading its `textContent`.
    * The `scenario` clicked on has its background color changed.
      * You may find the easiest way to accomplish this is to have add a `selected` class that has pre-defined style rules in CSS.
    * The `scenario`'s event listener is removed.

1. Clicking a "Bingo" button calls the `/bingo` API to determine if the current player won.
    * The API returns whether the player won or not. Format for this is described below.
    * The player wins if they have at least `Math.sqrt(board_size)` scenarios selected.
    * If the player won, the UI updates with a congratulations message, and prevents any more scenarios from being selected. All previously disabled input elements are re-enabled.
    * If they did not win, a temporary message appears (and disappears after a few seconds) saying nobody won. Game play then continues as normal.

1. A new `game_id` is created for every new game. Every unique player name also has a `player_id`.
    * These IDs are included in the parameters and return data for most API responses (see below for details).
    * These two IDs should also be saved in LocalStorage under the keys `game_id` and `player_id` respectively (and ***not*** in global variables).
    * A player is considered "unique" if its name does not yet exist in the database.

1. The list of possible scenarios and the list of known players are each stored in separate database tables server-side.
    * Scenarios should be stored in the `scenarios` table, and have columns `id` (integer) and `text` (text).
    * Players should be stored in the `players` table, and have columns `id` (integer) and `name` (text).
    * Each of these IDs should auto-increment via a `CREATE TABLE` constraint.

1. The entire game state is stored and updated in a database table server-side.
    * This includes which scenarios the player was given, which they've selected, and the game and player IDs.
    * It may also include anything else you need to keep track of a game.
    * At minimum, it must be stored in the `game_state` table and have columns `game_id`, `player_id`, `given_scenario_ids`, and `selected_scenario_ids`.

1. When the page first loads, LocalStorage is checked for a `game_id` and `player_id`.
    * If either does not exist or their values aren't numbers, nothing happens. (The page waits for the user to start a new game.)
    * Otherwise, a game can be resumed. The expected behavior for Resuming a game is:
      * The "Resume Game?" button, with id `resume` is enabled.
      * When clicked, it makes a GET API call to `/resumeGame`, passing in the `game_id` and `player_id` as query parameters.
      * `/resumeGame`'s response is identical to `/newGame` ***except that*** it also includes a `selected_scenarios` field, containing a list of scenario IDs that were previously selected.
      * The frontend parses those, and updates the board to reflect the resumed game state.
        * `#board`'s size is set to how many scenarios are returned.
        * Just as in starting a new game, all the scenarios are added to the board (see requirement for "New Game" above).
        * For each scenario in `selected_scenarios`, the relevant element within `#board` has the `selected` class added.

## Backend API endpoints

For the required features, your backend must have these endpoints. Your implementation may have more endpoints or more features, but it ***must*** have at least these.

### GET `/newGame`:
* **Query Parameters**: Player name as `name`, size of board as `size`.
* Generates a new (random) board for the player of the appropriate size.
* Generates a new Game ID.
* References to the Game ID, the player ID, and the given scenarios are stored in the `game_state` table.
* Returns the player's board as JSON, in the form:
```json
{
  "game_id": 123,
  "player": {
    "id": 123,
    "name": "abc",
    "board": [
      {"id": 123, "text": "abc"},
      // ...
    ]
  }
}
```
* The `board` parameter should be an ordered array of JSON objects each representing a scenario. It is the frontend's responsibility to make sure they are arranged in a grid (e.g., by using `flex-wrap`).

### POST `/selectScenario`:
* **Body Parameters**: `game_id` and a `scenario_id`.
* Updates the `game_state` table .
  * Checks to validate that this scenario is in their list of given scenarios, and then adds it to that player's list of "selected" scenarios.
    * If this `scenario_id` is **not** in their list of given scenarios, this player **cannot** select this scenario, and no change to the database is made.
    * If this `scenario_id` is **already** in their list of selected scenarios, no change to the database is made, as they've already selected it.
* If successfully selected, returns back the `game_id` and `scenario_id` that was selected as JSON, in the form:
```json
{
  "game_id": 123,
  "scenario_id": 123
}
```
* If not successfully selected (for example, because the `scenario_id` wasn't in their list of given scenarios), return a `400` error and JSON:
```json
{
  "error": "Could not select scenario ID: <insert scenario ID>" 
}
``` 

### POST `/bingo`:
* **Body Parameters**: `game_id`.
* Once the player calls "Bingo!" (clicks the `#bingo` button), the `/bingo` endpoint validates whether or not they *can* win.
  * This is determined by checking if they have at least `Math.sqrt(board_size)` scenarios selected.
* If the game already has a winner (`winner` column for this `game_id` is not null), a 400 error is returned, as the game has already been won, and sends the JSON:
```json
{
  "error": "Game has already been won."
}
```
* If the player won, the `games` database table is updated to have this `game_id`'s `winner` set to this player's ID.
* Returns the Game ID and Player Name of the winning player as JSON, in the form:
```json
{
  "game_id": 123,
  "winner": "abc"
}
```
* If there wasn't a winner (for example, in the case that the player did not have enough selected scenarios), the `"winner"` parameter is set to `null`:
```json
{
  "game_id": 123,
  "winner": null
}
```

### GET `/resumeGame`:
* **Query Parameters**: Game ID as `game_id`, Player ID as `player_id`.
* Retrieves the game state for this `game_id` from the `game_state` database.
* If the `player_id` given in the parameters is not in the `game_state` data, then a 400 error is returned as JSON:
```json
{
  "error": "Cannot resume game: Player <id> was not part of game <id>"
}
```
* Returns the player's board as JSON, including a list of any selected scenarios, in the form:
```json
{
  "game_id": 123,
  "player": {
    "id": 123,
    "name": "abc",
    "board": [
      {"id": 123, "text": "abc"},
      // ...
    ],
    "selected_scenarios": [
      123,
      456,
      // ...
    ]
  }
}
```

## Database

You ***must*** store all game data in a database. Your implementation may add tables or columns, but it ***must*** at minimum include and use the below tables. You may not store game state in files.

`game_state`: A table whose columns consist of a board ID (primary key, auto-increment), game id, player id, list of given scenario ids, and list of selected scenario ids.
* For the given and selected scenario IDs, you may find an easy way to do this is to set the columns 
as type TEXT, and store them as JSON-parsed arrays. (For example, `given_scenario_ids : "[1,2,3]"` 
and converted between string and JSON with `JSON.parse` and `JSON.stringify`).
  * If you take this route for these columns' format, you should set their default value to `"[]"`.

`players`: A table whose columns consist of player ID (primary key, auto-increment) and names.

`games`: a table whose columns consist of game id (primary key, auto-increment), and the ID of the winning player (if one has been declared -- see `/bingo`).

`scenarios`: a table whose columns consist of scenario id (primary key, auto-increment), and the scenario text

### On IDs and Keys

In SQLite, it's possible to get an auto-generated ID (for example, the player or game IDs) without
much additional work. Here's how:

* In the `CREATE TABLE` declaration, your ID should be defined as `INTEGER PRIMARY KEY AUTOINCREMENT`
* In your Node app, when you `INSERT` a new row, the newly-generated ID for that row can be retrieved with:
```javascript
let result = await db.run("<your insert query>");
let id = result.lastID;
```

# Internal Requirements

All patterns and practices defined as internal requirements in past assignments continue to apply here (e.g., following code quality guidelines, using the module pattern in frontend JavaScript, proper use of `async/await` and promises, all errors handled appropriately, `checkStatus` used appropriately in fetch chains, etc.)

## Backend Internal

* All POST endpoints must support all three data formats we've talked about (JSON, FormData, URL-Encoded)
* The Node app must use the `express`, `multer`, and `sqlite` modules that we've shown in class.
* All Node endpoints must return JSON type (and **not** default HTML).
* `package.json` has the correct and complete list of dependencies for the project, and correctly points to `app.js` as the entry point.


## Frontend Internal

* POST requests must send data using the `FormData` object/datatype through the body.

## Error Handling

You must handle errors appropriately throughout the project as outlined in our style guides and reinforced throughout lecture and section.

* all possible db AND server errors need to be appropriately handled, returning the correct error codes and reasonable messages.
* all request errors need to be appropriately handled, returning the correct error codes and reasonable messages.
* all errors must be displayed to the user in a user-readable way.
  * Simply `console.log`ing the error is not enough.
  * It must be displayed cleanly: no JSON objects appearing in the DOM.
  * It does not have to be the message returned from the server, but does have to indicate that an error occurred.
  * You may not use `console.error` or `alert` to display errors.
  * It must be visible somewhere on the webpage.

## Documentation

Your JavaScript must continue to include file header comments, JSDoc comments on functions, endpoint comments, and comments on any non-trivial code.

As outlined in the "Final Deliverables" section above, You must provide an `APIDOC.md` documenting in detail your API. This must include:
* The name of the endpoint
* A non-trivial description of its purpose
  * Does _not_ include implementation details.
  * _Does_ include any side-effect it might have (e.g., creating and storing a Game ID for a GET endpoint)
* What method it uses (GET vs. POST)
* What parameters it takes (and their names and expected formats)
* What its return type is
* An Example Request
* An Example Response
* What errors can be returned. 

Although this file type is `md` (Markdown), we do not expect you to learn Markdown for this. Submitting the contents of this file as plain text is entirely okay. For example:

```txt
This is my API documentation.
* /addPost
Adds a post.
Method: POST
Takes the post text
Returns JSON: {"message": "ok"}
Example request: ...
Example return: ...

* /listPosts
...
```

(\* Note that this is example is both trivial and incomplete and therefore does not provide enough detail to count for full credit.)

# Grading

The grade for this project will be approximately broken up as follows:

* 60%: Required Features
* 40%: Internal correctness, adherence to course quality guide, good documentation

No student code will be edited in an attempt to get the project working to grade it. The code you submit ***must*** be runnable (even if not complete) in order to qualify for external points.

Similarly, if `package.json` does not have the correct list of dependencies, or does not correctly point to `app.js` as the entry point, no points will be granted for external behavior.

## Academic Integrity
As with other CSE 154 assignments, you may not work with other students on the final project, and all work must
 be your own. Submissions found sharing code or using code from resources online will be subject to 
the University's Academic Misconduct process. You may also not place your solution to a 
publicly-accessible web site, neither during nor after the school quarter is over. Doing so is 
considered a violation of our course [academic integrity](https://courses.cs.washington.edu/courses/cse154/20sp/syllabus/syllabus.html#academic-conduct) 
policy. As a reminder: This page page states:

> The Paul G Allen School has an entire page on [Academic Misconduct](https://www.cs.washington.edu/academics/misconduct) 
within the context of Computer Science, and the University of Washington has an entire page on how 
[Academic Misconduct](https://www.washington.edu/cssc/for-students/academic-misconduct/) is handled 
on their [Community Standards and Student Conduct](https://www.washington.edu/cssc/) Page. Please
 acquaint yourself with both of those pages, and in particular how academic misconduct will be 
reported to the University.

If we find [inappropriate content or plagiarism](https://courses.cs.washington.edu/courses/cse154/20sp/syllabus/index.html#academic-conduct) in projects **you will be ineligible
for any points on the project**. Ask the instructors if you're unsure if your work is cited appropriately. Any external sources like images should be cited where used in the source code or (ideally) visible in a page footer. Refer to this [copyright example](https://courses.cs.washington.edu/courses/cse154/20sp/code-examples/assets/copyright-examples/copyrightexample2.html) page for how to cite images from different sources.