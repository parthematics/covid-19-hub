// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  Image,
  Webhook
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Define Firebase  and Google Cloud functions that will be needed
const functions = require('firebase-functions');
const {dialogflow} = require ('actions-on-google');
const Datastore = require('@google-cloud/datastore');

// Instantiate a datastore client to hold intents and their synonymous invocations
const datastore = Datastore();
const WELCOME_INTENT = 'Default Welcome Intent';
const FALLBACK_INTENT = 'Default Fallback Intent';
const LOOKING_FOR_TWEET_INTENT = 'LookingForTweet';
const TWEET_TYPE_ENTITY = 'TweetType';
const LOOKING_FOR_STATS_INTENT = 'LookingForStats';
const STATS_TYPE_ENTITY = 'StatsType';
const LOOKING_FOR_ADVICE_INTENT = 'LookingForAdvice';
const ADVICE_TYPE_ENTITY = 'AdviceType';
const LOOKING_FOR_NEWS_INTENT = 'LookingForNews';
const NEWS_TYPE_ENTITY = 'NewsType';

const app = dialogflow();

app.intent(WELCOME_INTENT, (conv) => {
    conv.ask("Welcome to COVID-19 Hub! I can provide relevant information on current statistics, \
    tweets, news articles, and even advice on symptoms. What would you like help with?");
});

app.intent(FALLBACK_INTENT, (conv) => {
    conv.ask("Sorry, I didn't get that. I can help you get current statistics, tweets, news articles, \
    and advice on symptoms. What would you like help with?");
});

const query1 = datastore.createQuery('IntentsTable').filter('IntentType', '=', TWEET_TYPE_ENTITY);
const query2 = datastore.createQuery('IntentsTable').filter('IntentType', '=', STATS_TYPE_ENTITY);
const query3 = datastore.createQuery('IntentsTable').filter('IntentType', '=', ADVICE_TYPE_ENTITY);
const query4 = datastore.createQuery('IntentsTable').filter('IntentType', '=', NEWS_TYPE_ENTITY);
var figure_index = -1;
var org_index = -1;

app.intent(LOOKING_FOR_TWEET_INTENT, (conv) => {
  const quote_type = conv.parameters[TWEET_TYPE_ENTITY].toLowerCase();
  // listed of trusted public figures whose tweets to trust, along with trusted organizations
  var figures = ['jburnmurdoch', 'jkwan_md', 'ishaberry2', 'aslavitt', 'scottgottliebmd', 'bogochisaac', 'erictopol', 'nachristakis'];
  var orgs = ['cdcgov', 'govcanhealth', 'who'];
  figure_index += 1;
  org_index += 1;
  figure_name = figures[figure_index];
  organization_name = orgs[org_index];  

  // making the request to the Twitter API
  let request = new XMLHttpRequest();
  request.open("GET", "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + figure_name);
  request.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAALXE%2FAAx7Jc%3D4So1KFViHNE7Hm7lPJg0gF2EeF2NsTm9aPO5L7GaQoBLW8r0BD")
  request.send();
  request.onload = () => {
    console.log(request);
    if (request.status === 200) {
      // by default the response comes in the string format, we need to parse the data into JSON
      // logging into console for debugging purposes
      console.log(JSON.parse(request.response));
    } else {
      console.log(`error ${request.status} ${request.statusText}`);
    }
  };

  if (quote_type == TWEET_TYPE_ENTITY) { 
    return datastore.runQuery(query1).then(results => {
      conv.ask("Here's what I got from " + request.response['0']['full_text'] + ". Would you like to hear more?" );
    });
  } else if (quote_type == ADVICE_TYPE_ENTITY) {
    return datastore.runQuery(query2).then(results => {
      conv.ask("I see you want some advice. Do you currently have any symptoms?");
    });
  } else if (quote_type == NEWS_TYPE_ENTITY) {
    return datastore.runQuery(query3).then(results => {
      conv.ask("I see you want to hear about news. Would you like to go back to the start?" );
    });
  } else {
      conv.ask("Sorry, I didn't understand. Did you want to hear more tweets?");
  }
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

app.intent(LOOKING_FOR_STATS_INTENT, (conv) => {
  // making the request to the Twitter API
  let request = new XMLHttpRequest();
  request.open("GET", "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + figure_name);
  request.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAALXE%2FAAx7Jc%3D4So1KFViHNE7Hm7lPJg0gF2EeF2NsTm9aPO5L7GaQoBLW8r0BD")
  request.send();
  request.onload = () => {
    console.log(request);
    if (request.status === 200) {
      // by default the response comes in the string format, we need to parse the data into JSON
      // logging into console for debugging purposes
      console.log(JSON.parse(request.response));
    } else {
      console.log(`error ${request.status} ${request.statusText}`);
    }
  };

  if (quote_type == TWEET_TYPE_ENTITY) { 
    return datastore.runQuery(query1).then(results => {
      conv.ask("Here's what I got from " + request.response['0']['full_text'] + ". Would you like to hear more?" );
    });
  } else if (quote_type == ADVICE_TYPE_ENTITY) {
    return datastore.runQuery(query2).then(results => {
      conv.ask("I see you want some advice. Do you currently have any symptoms?");
    });
  } else if (quote_type == NEWS_TYPE_ENTITY) {
    return datastore.runQuery(query3).then(results => {
      conv.ask("I see you want to hear about news. Would you like to go back to the start?" );
    });
  } else {
      conv.ask("Sorry, I didn't understand. Did you want to hear more tweets?");
  }
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

app.intent(LOOKING_FOR_ADVICE_INTENT, (conv) => {
  // making the request to the Twitter API
  let request = new XMLHttpRequest();
  request.open("GET", "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + figure_name);
  request.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAALXE%2FAAx7Jc%3D4So1KFViHNE7Hm7lPJg0gF2EeF2NsTm9aPO5L7GaQoBLW8r0BD")
  request.send();
  request.onload = () => {
    console.log(request);
    if (request.status === 200) {
      // by default the response comes in the string format, we need to parse the data into JSON
      // logging into console for debugging purposes
      console.log(JSON.parse(request.response));
    } else {
      console.log(`error ${request.status} ${request.statusText}`);
    }
  };

  if (quote_type == TWEET_TYPE_ENTITY) { 
    return datastore.runQuery(query1).then(results => {
      conv.ask("Here's what I got from " + request.response['0']['full_text'] + ". Would you like to hear more?" );
    });
  } else if (quote_type == ADVICE_TYPE_ENTITY) {
    return datastore.runQuery(query2).then(results => {
      conv.ask("I see you want some advice. Do you currently have any symptoms?");
    });
  } else if (quote_type == NEWS_TYPE_ENTITY) {
    return datastore.runQuery(query4).then(results => {
      conv.ask("I see you want to hear about news. Would you like to go back to the start?" );
    });
  } else {
      conv.ask("Sorry, I didn't understand. Did you want to hear more tweets?");
  }
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

app.intent(LOOKING_FOR_NEWS_INTENT, (conv) => {
  // making the request to the Twitter API
  let request = new XMLHttpRequest();
  request.open("GET", "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + figure_name);
  request.setRequestHeader("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAALXE%2FAAx7Jc%3D4So1KFViHNE7Hm7lPJg0gF2EeF2NsTm9aPO5L7GaQoBLW8r0BD")
  request.send();
  request.onload = () => {
    console.log(request);
    if (request.status === 200) {
      // by default the response comes in the string format, we need to parse the data into JSON
      // logging into console for debugging purposes
      console.log(JSON.parse(request.response));
    } else {
      console.log(`error ${request.status} ${request.statusText}`);
    }
  };

  if (quote_type == TWEET_TYPE_ENTITY) { 
    return datastore.runQuery(query1).then(results => {
      conv.ask("Here's what I got from " + request.response['0']['full_text'] + ". Would you like to hear more?" );
    });
  } else if (quote_type == ADVICE_TYPE_ENTITY) {
    return datastore.runQuery(query2).then(results => {
      conv.ask("I see you want some advice. Do you currently have any symptoms?");
    });
  } else if (quote_type == NEWS_TYPE_ENTITY) {
    return datastore.runQuery(query4).then(results => {
      conv.ask("I see you want to hear about news. Would you like to go back to the start?" );
    });
  } else {
      conv.ask("Sorry, I didn't understand. Did you want to hear more tweets?");
  }
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  const name = conv.user.storage.userName;
  if (!name) {
    // Asks the user's permission to know their name, for personalization.
    conv.ask(new Permission({
      context: 'Hi there, welcome to COVID-19 Hub! Do you need any help?',
      permissions: 'NAME',
    }));
  } else {
    conv.ask(`Hi again, ${name}. Would you like to continue off your previous session?`);
  }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    // If the user denied our request, go ahead with the conversation.
    conv.ask(`OK, no worries. Which of the following can I help you with?`);
    conv.ask(new Suggestions('Tweets', 'Statistics', 'Advice', 'News'));
  } else {
    // If the user accepted our request, store their name in
    // the 'conv.user.storage' object for future conversations.
    conv.user.storage.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.user.storage.userName}. ` +
      `Can I help you with anything else?`);
    conv.ask(new Suggestions('Tweets', 'Statistics', 'Advice', 'News'));
  }
});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, {color}) => {
  const luckyNumber = color.length;
  const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
  if (conv.user.storage.userName) {
    // If we collected user name previously, address them by name and use SSML
    // to embed an audio snippet in the response.
    conv.ask(`<speak>${conv.user.storage.userName}, your lucky number is ` +
      `${luckyNumber}.<audio src="${audioSound}"></audio> ` +
      `Would you like to hear some fake colors?</speak>`);
    conv.ask(new Suggestions('Yes', 'No'));
  } else {
    conv.ask(`<speak>Your lucky number is ${luckyNumber}.` +
      `<audio src="${audioSound}"></audio> ` +
      `Would you like to hear some fake colors?</speak>`);
    conv.ask(new Suggestions('Yes', 'No'));
  }
});

// Handle the Dialogflow intent named 'favorite fake color'.
// The intent collects a parameter named 'fakeColor'.
app.intent('favorite fake color', (conv, {fakeColor}) => {
  fakeColor = conv.arguments.get('OPTION') || fakeColor;
  // Present user with the corresponding basic card and end the conversation.
  if (!conv.screen) {
    conv.ask(colorMap[fakeColor].text);
  } else {
    conv.ask(`Here you go.`, new BasicCard(colorMap[fakeColor]));
  }
  conv.ask('Do you want to hear about another fake color?');
  conv.ask(new Suggestions('Yes', 'No'));
});

// Handle the Dialogflow NO_INPUT intent.
// Triggered when the user doesn't provide input to the Action
app.intent('actions_intent_NO_INPUT', (conv) => {
  // Use the number of reprompts to vary response
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
  if (repromptCount === 0) {
    conv.ask('Which of the mentioned categories do you need help with?');
  } else if (repromptCount === 1) {
    conv.ask(`Please say the name of a color.`);
  } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
    conv.close(`Sorry we're having trouble. Let's ` +
      `try this again later. Goodbye.`);
  }
});

// Handle the Dialogflow follow-up intents
app.intent(['favorite color - yes', 'favorite fake color - yes'], (conv) => {
  conv.ask('Which color, indigo taco, pink unicorn or blue grey coffee?');
  // If the user is using a screened device, display the carousel
  if (conv.screen) return conv.ask(fakeColorCarousel());
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
