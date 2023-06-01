/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome, what figures do you want to calculate today?',
            CALCULATE_AREA_RECTANGLE: 'The area of a rectangle with base %s and height %s is %s.',
            CALCULATE_AREA_TRIANGLE: 'The area of a triangle with base %s and height %s is %s.',
            ERROR_INVALID_FIGURE: 'Sorry, I cannot calculate the area for that figure.',
            CALCULATE_AREA_CIRCLE: 'The area of a circle with radius %s is %s.',
            SUGGESTION_MESSAGE: '.If you need, to calculate the area of the triangle, rectangle or circle, you can tell me',
            HELP_REPROMPT: "How can I assist you?",
            CANCEL_MESSAGE: "Cancelled!",
            CANCEL_REPROMPT: "How else can I assist you?"
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: 'Bienvenido, que figuras quieres calcular hoy??',
            CALCULATE_AREA_RECTANGLE: 'El área de un rectángulo con base %s y altura %s es %s.',
            CALCULATE_AREA_TRIANGLE: 'El área de un triángulo con base %s y altura %s es %s.',
            ERROR_INVALID_FIGURE: 'Lo siento, no puedo calcular el área para esa figura.',
            CALCULATE_AREA_CIRCLE: 'El área de un círculo con radio %s es %s.',
            SUGGESTION_MESSAGE: '.Si necesitas, calcular el area del triángulo, rectángulo o círculo, puedes decirmelo',
            HELP_REPROMPT: "¿En qué puedo ayudarte?",
            CANCEL_MESSAGE: "¡Cancelado!",
            CANCEL_REPROMPT: "¿En qué más puedo ayudarte?"
        }
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



const AreaCir = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "CustomCircleIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const figuraSlot = handlerInput.requestEnvelope.request.intent.slots.figura;
    const radio = handlerInput.requestEnvelope.request.intent.slots.radio.value;
    
    if (figuraSlot.value) {
      const figuraValue = figuraSlot.value.toLowerCase();

      const figuras = [
        { en: "circle", es: "circulo" },
      ];
      // realiza bsqueda de si se encuentra la la figura mencionada, es por ello que en la linea 63 se reduce la instruccion a minusculas
      const figura = figuras.find(
        (f) => f.en === figuraValue || f.es === figuraValue
      );
      // si no encuenta la forma en la lista de figras mencionará el mensaje de forma invalida
      if (!figura) {
        return handlerInput.responseBuilder
          .speak(requestAttributes.t("ERROR_INVALID_FIGURE"))
          .getResponse();
      }
      
      let area = 0;
      let response = "";
      
      area = Math.PI * Math.pow(radio, 2);
      response = requestAttributes.t("CALCULATE_AREA_CIRCLE", radio,area);
          
    const sugerencia = requestAttributes.t("SUGGESTION_MESSAGE");

      return handlerInput.responseBuilder
        .speak(`${response}${sugerencia}`)
        .reprompt(sugerencia)
        .getResponse();
      
    }
    
    
  }
}

const AreaCalculator = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "CustomTriangulosIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    const figuraSlot = handlerInput.requestEnvelope.request.intent.slots.figura;
    const base = handlerInput.requestEnvelope.request.intent.slots.base.value;
    const altura = handlerInput.requestEnvelope.request.intent.slots.altura.value;
    const radio = handlerInput.requestEnvelope.request.intent.slots.radio.value;

    if (figuraSlot.value) {
      const figuraValue = figuraSlot.value.toLowerCase();

      const figuras = [
        { en: "rectangle", es: "rectangulo" },
        { en: "circle", es: "circulo" },
        { en: "triangle", es: "triangulo" }
      ];
// realiza bsqueda de si se encuentra la la figura mencionada, es por ello que en la linea 63 se reduce la instruccion a minusculas
      const figura = figuras.find(
        (f) => f.en === figuraValue || f.es === figuraValue
      );
// si no encuenta la forma en la lista de figras mencionará el mensaje de forma invalida
      if (!figura) {
        return handlerInput.responseBuilder
          .speak(requestAttributes.t("ERROR_INVALID_FIGURE"))
          .getResponse();
      }

      let area = 0;
      let response = "";

      switch (figura.en) {
        case "rectangle":
          area = base * altura;
          response = requestAttributes.t(
            "CALCULATE_AREA_RECTANGLE",
            base,
            altura,
            area
          );
          break;
        case "circle":
          area = Math.PI * Math.pow(radio, 2);
          response = requestAttributes.t(
            "CALCULATE_AREA_CIRCLE",
            radio,
            area
          );
          break;
        case "triangle":
          area = (base * altura) / 2;
          response = requestAttributes.t(
            "CALCULATE_AREA_TRIANGLE",
            base,
            altura,
            area
          );
          break;
        default:
          response = requestAttributes.t("ERROR_INVALID_FIGURE");
          break;
      }

      const sugerencia = requestAttributes.t("SUGGESTION_MESSAGE");

      return handlerInput.responseBuilder
        .speak(`${response}${sugerencia}`)
        .reprompt(sugerencia)
        .getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t("ERROR_NO_FIGURE_PROVIDED"))
        .getResponse();
    }
  }
};




const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        // const speakOutput = 'You can say hello to me! How can I help?';
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_REPROMPT');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        // const speakOutput = 'Goodbye!';
        const speakOutput = requestAttributes.t('CANCEL_MESSAGE');
        const pregunta = requestAttributes.t('CANCEL_REPROMPT');
        return handlerInput.responseBuilder
            .speak(`${speakOutput}${pregunta}`)
            .reprompt(pregunta)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};
// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};
// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AreaCir,
        AreaCalculator,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
        .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();