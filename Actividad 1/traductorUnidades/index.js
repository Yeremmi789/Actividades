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
            WELCOME_MESSAGE: 'Welcome, which unit do you want to convert today??',
            // CONVERSION_RESULT: 'The conversion of {cantidadMetros} meters to centimeters is {centimetros} centimeters.',
            // CONVERSION_RESULT: 'The conversion of %s meters to centimeters is %s centimeters.',
            // CONVERSION_RESULT: 'The conversion of %s %s to %s is %s %s.',
            CONVERSION_RESULT: 'The conversion of %s %s to %s is %s %s.',
            ERROR_INVALID_UNIT: 'Sorry, I cannot convert that unit of length.',
            ERROR_INVALID_ORIGIN_UNIT: 'Sorry, I cannot convert from that unit of length.',
            SUGGESTION_MESSAGE: "If you want, you can help with other conversions. For example, you can say: 'Convert 3 meters to centimeters.",
            GOODBYE_MESSAGE: 'Goodbye! Have a great day!',
            HELP_REPROMPT: "How can I assist you?",
            CANCEL_MESSAGE: "Cancelled!",
            CANCEL_REPROMPT: "How else can I assist you?"
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: 'Bienvenido, que unidad quieres convertir hoy??',
            // CONVERSION_RESULT: 'La conversión de {cantidadMetros} metros a centímetros es de {centimetros} centímetros.',
            // CONVERSION_RESULT: 'La conversión de %s metros a centímetros es de %s centímetros.',
            // CONVERSION_RESULT: 'La conversión de %s %s a %s es de %s %s.',
            CONVERSION_RESULT: 'La conversión de %s %s a %s es de %s %s.',
            ERROR_INVALID_UNIT: 'Lo siento, no puedo convertir esa unidad de longitud.',
            ERROR_INVALID_ORIGIN_UNIT: 'Lo siento, no puedo convertir desde esa unidad de longitud.',
            SUGGESTION_MESSAGE: "Si deseas, puedo ayudarte con otras conversiones. Por ejemplo, puedes decir: 'Convierte 3 metros a centímetros'.",
            GOODBYE_MESSAGE: '¡Hasta luego! ¡Que tengas un excelente día!',
            HELP_REPROMPT: "¿En qué puedo ayudarte?",
            CANCEL_MESSAGE: "¡Cancelado!",
            CANCEL_REPROMPT: "¿En qué más puedo ayudarte?"
        }
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        // const speakOutput = 'Welcome,This is a unit converter';
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const Conversor = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'CustomUnitIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        const unidadOrigen = handlerInput.requestEnvelope.request.intent.slots.unidad.value;
        const unidadDestino = handlerInput.requestEnvelope.request.intent.slots.conversion.value;
        const cantidad = handlerInput.requestEnvelope.request.intent.slots.numero.value;
        let resultado = 0;

        // Definir los factores de conversión para cada par de unidades
        const factoresConversion = {
            metros: {
                centimetros: 100,
                kilometros: 0.001,
                yardas: 1.09361,
                pies: 3.28084,
                pulgadas: 39.3701
            },
            meters: {
                centimeters: 100,
                kilometers: 0.001,
                yards: 1.09361,
                feet: 3.28084,
                inches: 39.3701
            },
            centimetros: {
                metros: 0.01,
                kilometros: 0.00001,
                yardas: 0.0109361,
                pies: 0.0328084,
                pulgadas: 0.393701
            },
            centimeters: {
                meters: 0.01,
                kilometers: 0.00001,
                yards: 0.0109361,
                feet: 0.0328084,
                inches: 0.393701
            },
            kilometros: {
                metros: 1000,
                centimetros: 100000,
                yardas: 1093.61,
                pies: 3280.84,
                pulgadas: 39370.1
            },
            kilometers: {
                meters: 1000,
                centimeters: 100000,
                yards: 1093.61,
                feet: 3280.84,
                inches: 39370.1
            },
            yardas: {
                metros: 0.9144,
                centimetros: 91.44,
                kilometros: 0.0009144,
                pies: 3,
                pulgadas: 36
            },
            yards: {
                meters: 0.9144,
                centimeters: 91.44,
                kilometers: 0.0009144,
                feet: 3,
                inches: 36
            },
            pies: {
                metros: 0.3048,
                centimetros: 30.48,
                kilometros: 0.0003048,
                yardas: 0.333333,
                pulgadas: 12
            },
            feet: {
                meters: 0.3048,
                centimeters: 30.48,
                kilometers: 0.0003048,
                yards: 0.333333,
                inches: 12
            },
            pulgadas: {
                metros: 0.0254,
                centimetros: 2.54,
                kilometros: 0.0000254,
                yardas: 0.0277778,
                pies: 0.0833333
            },
            inches: {
                meters: 0.0254,
                centimeters: 2.54,
                kilometers: 0.0000254,
                yards: 0.0277778,
                feet: 0.0833333
            }
        };

        if (!factoresConversion[unidadOrigen] || !factoresConversion[unidadOrigen][unidadDestino]) {
            const sugerencia = requestAttributes.t('SUGGESTION_MESSAGE')
            const speechOutput = requestAttributes.t('ERROR_INVALID_UNIT', unidadDestino)
            return handlerInput.responseBuilder
                .speak(`${speechOutput} ${sugerencia}`)
                .reprompt(sugerencia)
                .getResponse();
        }

        resultado = cantidad * factoresConversion[unidadOrigen][unidadDestino];
        // const formattedResultado = resultado.toFixed(2).replace(/\.?0+$/, ''); // Redondear y eliminar ceros a la derecha
        // const speechOutput = requestAttributes.t('CONVERSION_RESULT', cantidad, unidadOrigen, resultado.toFixed(2), unidadDestino);
        const speechOutput = requestAttributes.t('CONVERSION_RESULT', cantidad, unidadOrigen, unidadDestino, resultado.toFixed(2), unidadDestino);
        const sugerencia = requestAttributes.t('SUGGESTION_MESSAGE')
        return handlerInput.responseBuilder
            .speak(`${speechOutput} ${sugerencia}`)
            .reprompt(sugerencia)
            .getResponse();
    },
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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_REPROMPT');
        // const speakOutput = 'You can say hello to me! How can I help?';
        

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
        // const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');
        const speakOutput = requestAttributes.t('CANCEL_MESSAGE');
        const pregunta = requestAttributes.t('CANCEL_REPROMPT');
        // const speakOutput = 'Goodbye!';

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
        Conversor,
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