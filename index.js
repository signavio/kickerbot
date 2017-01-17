var colors = require('colors/safe')

var RtmClient = require('@slack/client').RtmClient
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM
var RTM_EVENTS = require('@slack/client').RTM_EVENTS

var match = require('./match.js')

var botToken = process.env.npm_package_config_token || process.env.TOKEN

if (!botToken) {
  console.error('Error! No API token set. Check the readme for setup instructions.')
  process.exit()
}

var rtm = new RtmClient(botToken)
rtm.start()


// Authentication event
rtm.on(RTM_CLIENT_EVENTS.AUTHENTICATED, (rtmStartData) => {
  logEvent(RTM_CLIENT_EVENTS.AUTHENTICATED, `Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`)
})

// Connection event
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, () => {
  logEvent(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED)
})

// Message event
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  logEvent(RTM_EVENTS.MESSAGE, JSON.stringify(message))

  var reply = match(message)

  if (reply) {
    var channel = message.channel
    rtm.sendMessage(reply, channel)
  }
})

// Log formatted events
function logEvent(event, message) {
  console.log(`${colors.yellow(new Date())}: ${event} ${message || ''}`)
}
