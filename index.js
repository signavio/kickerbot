var colors = require('colors/safe');

var RtmClient = require('@slack/client').RtmClient;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var match = require('./match.js');

var bot_token = process.env.SLACK_BOT_TOKEN;
if(!bot_token) {
    console.log("Error! No token set. Aborting.")
    process.exit()
}

var rtm = new RtmClient(bot_token);
rtm.start();


// Authentication event
rtm.on(RTM_CLIENT_EVENTS.AUTHENTICATED, function (rtmStartData) {
    logEvent(RTM_CLIENT_EVENTS.AUTHENTICATED, `Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// Connection event
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
    logEvent(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED);
});

// Message event
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    logEvent(RTM_EVENTS.MESSAGE, JSON.stringify(message))

    var reply = match(message);

    if(reply) {
        var channel = message.channel;
        rtm.sendMessage(reply, channel);
    }
});

// Log formatted events
function logEvent(event, message){
    var message = message || "";
    console.log(`${colors.yellow(new Date())}: ${event} ${message}`);
}
