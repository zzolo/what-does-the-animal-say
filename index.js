/**
 * Lambda function for 'What does the Animal say?'
 */
'use strict';

// Dependencies
const Alexa = require('alexa-sdk');
require('dotenv').load({ silent: true });
const appID = process.env.ALEXA_APP_ID;

// Handler for Lambda
exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);

  // For alexa-skill-test, we don't define APP_ID
  if ('undefined' === typeof process.env.DEBUG) {
    alexa.APP_ID = appID ? appID : undefined;
  }

  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

// Handlers
var handlers = {
  // Use LaunchRequest, instead of NewSession if you want to use the one-shot model
  // Alexa, ask [my-skill-invocation-name] to (do something)...
  'LaunchRequest': function() {
    this.attributes['speechOutput'] = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
    this.attributes['repromptSpeech'] = this.t('WELCOME_REPROMPT');
    this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
  },
  'AnimalIntent': function() {
    // Get animal
    let animalSlot = this.event.request.intent.slots.Animal;
    let animalName = (animalSlot && animalSlot.value) ? animalSlot.value.toLowerCase() : undefined;
    var animal = animals[animalName];

    // Make sure we know about this animal
    if (animal) {
      // Card title
      let cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), animal.name);

      // Speech output
      this.attributes['speechOutput'] = this.t('ANIMAL_RESPONSE', animal.name, animal.sounds[0]);

      // Put together
      this.attributes['repromptSpeech'] = this.t('ANIMAL_REPEAT_MESSAGE');
      this.emit(':tellWithCard', this.attributes['speechOutput'], this.attributes['repromptSpeech'], cardTitle, animal.name);
    }
    else {
      var speechOutput = this.t('ANIMAL_NOT_FOUND_MESSAGE');
      var repromptSpeech = this.t('ANIMAL_NOT_FOUND_REPROMPT');

      if (animalName) {
        speechOutput += this.t('ANIMAL_NOT_FOUND_WITH_ITEM_NAME', animalName);
      }
      else {
        speechOutput += this.t('ANIMAL_NOT_FOUND_WITHOUT_ITEM_NAME');
      }
      speechOutput += repromptSpeech;

      this.attributes['speechOutput'] = speechOutput;
      this.attributes['repromptSpeech'] = repromptSpeech;

      this.emit(':ask', speechOutput, repromptSpeech);
    }
  },
  'AMAZON.HelpIntent': function() {
    this.attributes['speechOutput'] = this.t('HELP_MESSAGE');
    this.attributes['repromptSpeech'] = this.t('HELP_REPROMPT');
    this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
  },
  'AMAZON.RepeatIntent': function() {
    this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
  },
  'AMAZON.StopIntent': function() {
    this.emit('SessionEndedRequest');
  },
  'AMAZON.CancelIntent': function() {
    this.emit('SessionEndedRequest');
  },
  'SessionEndedRequest': function() {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'Unhandled': function() {
    this.attributes['speechOutput'] = this.t('HELP_MESSAGE');
    this.attributes['repromptSpeech'] = this.t('HELP_REPROMPT');
    this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
  }
};

// Animals
const animals = {
  bear: {
    name: 'Bear',
    sounds: ['roar']
  },
  cheetah: {
    name: 'Cheetah',
    sounds: ['meow']
  }
};

// Translation strings
const languageStrings = {
  'en': {
    'translation': {
      'SKILL_NAME': 'What does the animal say?',
      'WELCOME_MESSAGE': 'Welcome to "%s". You can ask a question like, what does the cheetah say? ... Now, what can I help you with.',
      'WELCOME_REPROMPT': 'For instructions on what you can say, please say help me.',
      'DISPLAY_CARD_TITLE': '%s - %s',
      'HELP_MESSAGE': 'You can ask questions such as, what does the cheetah say, or, you can say exit...Now, what can I help you with?',
      'HELP_REPROMPT': 'You can say things like, what does the cheetah say, or you can say exit...Now, what can I help you with?',
      'STOP_MESSAGE': 'Goodbye!',
      'ANIMAL_RESPONSE': 'The %s says %s.',
      'ANIMAL_REPEAT_MESSAGE': 'Try saying repeat.',
      'ANIMAL_NOT_FOUND_MESSAGE': 'I\'m sorry, I currently do not know ',
      'ANIMAL_NOT_FOUND_WITH_ITEM_NAME': 'what the %s sounds like. ',
      'ANIMAL_NOT_FOUND_WITHOUT_ITEM_NAME': 'what that animal sounds like. ',
      'ANIMAL_NOT_FOUND_REPROMPT': 'What else can I help with?'
    }
  }
};
