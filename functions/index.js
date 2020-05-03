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

app.intent(LOOKING_FOR_TWEET_INTENT, (conv) => {
     const quote_type = conv.parameters[TWEET_TYPE_ENTITY].toLowerCase();
     if (quote_type == "motivational") { 
         return datastore.runQuery(query1).then(results => {
            conv.ask(results[0][1].Quote);
        });
     } else if (quote_type == "friendship") {
        return datastore.runQuery(query2).then(results => {
            conv.ask(results[0][1].Quote);
        });
     } else if (quote_type == "romantic") {
     return datastore.runQuery(query3).then(results => {
            conv.ask(results[0][0].Quote);
        });
     } else {
         conv.ask("get off your ass and work instead of talking to me");
     }
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

app.intent(LOOKING_FOR_STATS_INTENT, (conv) => {
  const quote_type = conv.parameters[TWEET_TYPE_ENTITY].toLowerCase();
  if (quote_type == "motivational") { 
      return datastore.runQuery(query1).then(results => {
         conv.ask(results[0][1].Quote);
     });
  } else if (quote_type == "friendship") {
     return datastore.runQuery(query2).then(results => {
         conv.ask(results[0][1].Quote);
     });
  } else if (quote_type == "romantic") {
  return datastore.runQuery(query3).then(results => {
         conv.ask(results[0][0].Quote);
     });
  } else {
      conv.ask("get off your ass and work instead of talking to me");
  }
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

app.intent(LOOKING_FOR_ADVICE_INTENT, (conv) => {
  const quote_type = conv.parameters[TWEET_TYPE_ENTITY].toLowerCase();
  if (quote_type == "motivational") { 
      return datastore.runQuery(query1).then(results => {
         conv.ask(results[0][1].Quote);
     });
  } else if (quote_type == "friendship") {
     return datastore.runQuery(query2).then(results => {
         conv.ask(results[0][1].Quote);
     });
  } else if (quote_type == "romantic") {
  return datastore.runQuery(query3).then(results => {
         conv.ask(results[0][0].Quote);
     });
  } else {
      conv.ask("get off your ass and work instead of talking to me");
  }
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

app.intent(LOOKING_FOR_NEWS_INTENT, (conv) => {
  const quote_type = conv.parameters[TWEET_TYPE_ENTITY].toLowerCase();
  if (quote_type == "motivational") { 
      return datastore.runQuery(query1).then(results => {
         conv.ask(results[0][1].Quote);
     });
  } else if (quote_type == "friendship") {
     return datastore.runQuery(query2).then(results => {
         conv.ask(results[0][1].Quote);
     });
  } else if (quote_type == "romantic") {
  return datastore.runQuery(query3).then(results => {
         conv.ask(results[0][0].Quote);
     });
  } else {
      conv.ask("get off your ass and work instead of talking to me");
  }
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

// In the case the user is interacting with the Action on a screened device
// The Fake Color Carousel will display a carousel of color cards
const fakeColorCarousel = () => {
  const carousel = new Carousel({
    items: {
      'indigo taco': {
        title: 'Indigo Taco',
        synonyms: ['indigo', 'taco'],
        image: new Image({
          url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png',
          alt: 'Indigo Taco Color',
        }),
      },
      'pink unicorn': {
        title: 'Pink Unicorn',
        synonyms: ['pink', 'unicorn'],
        image: new Image({
          url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
          alt: 'Pink Unicorn Color',
        }),
      },
      'blue grey coffee': {
        title: 'Blue Grey Coffee',
        synonyms: ['blue', 'grey', 'coffee'],
        image: new Image({
          url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png',
          alt: 'Blue Grey Coffee Color',
        }),
      },
  }});
  return carousel;
};

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  const name = conv.user.storage.userName;
  if (!name) {
    // Asks the user's permission to know their name, for personalization.
    conv.ask(new Permission({
      context: 'Hi there, to get to know you better',
      permissions: 'NAME',
    }));
  } else {
    conv.ask(`Hi again, ${name}. What's your favorite color?`);
  }
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    // If the user denied our request, go ahead with the conversation.
    conv.ask(`OK, no worries. What's your favorite color?`);
    conv.ask(new Suggestions('Blue', 'Red', 'Green'));
  } else {
    // If the user accepted our request, store their name in
    // the 'conv.user.storage' object for future conversations.
    conv.user.storage.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.user.storage.userName}. ` +
      `What's your favorite color?`);
    conv.ask(new Suggestions('Blue', 'Red', 'Green'));
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
    conv.ask('Which color would you like to hear about?');
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
