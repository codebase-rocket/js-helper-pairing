// Info: Test Cases
'use strict';

// Shared Dependencies
var Lib = {};

// Set Configrations
const nodb_config = { // Config AWS DynamoDB
  'KEY': 'todo',
  'SECRET': 'todo',
  'REGION': 'ap-south-1'
};
const pairing_config = { // Config Pairing
  'DB_SOURCE': 'test_pairing'
};

// Dependencies
Lib.Utils = require('js-helper-utils');
Lib.Debug = require('js-helper-debug')(Lib);
Lib.Crypto = require('js-helper-crypto-nodejs')(Lib);
Lib.Instance = require('js-helper-instance')(Lib);
Lib.DynamoDB = require('js-helper-aws-dynamodb')(Lib, nodb_config);
const [ Pairing, PairingInput, PairingData ] = require('js-helper-pairing')(Lib, pairing_config);


////////////////////////////SIMILUTATIONS//////////////////////////////////////

function output_handler(err, response){ // Result are from previous function

  if(err){ // If error
    Lib.Debug.log('err:', JSON.stringify(err) );
  }
  else{
    Lib.Debug.log('response:', response );
  }

};

///////////////////////////////////////////////////////////////////////////////


/////////////////////////////STAGE SETUP///////////////////////////////////////

// Initialize 'instance'
var instance = Lib.Instance.initialize();


// Dummy data
var entity_id = 'abc';
var action = 'Device-Pairing';
var code_ttl = 300; // 5 Minutes
var pairing_code = 'WT53';

///////////////////////////////////////////////////////////////////////////////


/////////////////////////////////TESTS/////////////////////////////////////////

// Test generatePairingCode()
// Pairing.generatePairingCode(
//   instance,
//   output_handler,
//   entity_id,
//   action,
//   code_ttl
// );


// Test getPairingData()
// Pairing.getPairingData(
//   instance,
//   output_handler,
//   entity_id,
//   action,
//   pairing_code,
//   code_ttl
// );


// Test pairEntity()
// Pairing.pairEntity(
//   instance,
//   output_handler,
//   entity_id,
//   action,
//   pairing_code,
//   {
//     'device_data':{
//       'device_id':'device_1'
//     }
//   }
// );


// Test pairEntity()
// Pairing.consumePairingCode(
//   instance,
//   output_handler,
//   entity_id,
//   action,
//   pairing_code
// );
