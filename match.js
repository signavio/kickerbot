const MAX_PLAYERS_COUNT = 4;

var playerCount = 4;
var occupied = true;

function parseMessage(message) {
    // Normalize message string
    var text = (message.text || "").toLowerCase().replace("—", "--");

    if(text.length === MAX_PLAYERS_COUNT && (text.match(/x|-/g) || []).length === MAX_PLAYERS_COUNT) {
        // Message of style xx--
        playerCount = text.split("x").length -1;
        return postTrackMatch();
    } else if (text.length === 1 && (text.includes("!") || text.includes("x"))) {
        // Message "!" or "x"
        if(playerCount < MAX_PLAYERS_COUNT) playerCount++;
        else return `Nope! The match is full already.`;
        return postAddPlayer();
    } else if (text === "-") {
        // Message "-"
        playerCount--;
        return postMatchStatus();
    } else if (text === "go" && playerCount === MAX_PLAYERS_COUNT && !occupied) {
        // Message "go", if there is a full match
        occupied = true;
        playerCount = 0;
        return `Match started. Write "free", once it's over. The next match can already be prepared.`;
    } else if (text === "free") {
        // Message "free"
        occupied = false;
        return postMatchStatus();
    } else if (text === "match") {
        // Message "match"
        return postMatchStatus();
    } else if (text === "help") {
        // Message "help"
        return postHelp();
    }
}

// Reacting to a message in the style xx--
function postTrackMatch() {
    switch(playerCount) {
        case 0:
            return `Match reset. Waiting for new players...`;
            break;
        case MAX_PLAYERS_COUNT:
            return postGameFull();
            break;
        default:
            return postMatchStatus();
            break;
    }
}

// Reacting to a message ! or x
function postAddPlayer() {
    if(playerCount === MAX_PLAYERS_COUNT) {
        return postGameFull();
    } else {
        return postMatchStatus();
    }
}

function postMatchStatus() {
    if(occupied) {
        return `Table occupied. ${playerCount} players ready for the next match.`
    } else {
        return `Table free. ${playerCount} players ready for the next match.`;
    }
}

function postGameFull() {
    if(!occupied) {
        return `Match full. Write "go" once you are ready!`;
    } else {
        return `Match full. Wait until the table is free.`;
    }
}

function postHelp() {
    return `I'm Kevin Kick, your friendly kicker bot. I help you to arrange matches and tell you whether the kicker table is available.

    - Write \`x---\` to start a new game.
    - Write \`!\` or \`x\` to add you to the next match or \`-\` to remove you again if you change your mind.
    - Write \`help\` to see this again.`
}



module.exports = parseMessage;
