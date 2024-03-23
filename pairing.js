// Info: Boilerplate library. Contains functions related to Generation & validation of pairing codes
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib = {};

// Private Dependencies - Parts of same library (Managed by Loader)
var PairingInput;
var PairingData;

// Exclusive Dependencies
var CONFIG = require('./config'); // Loader can override it with Custom-Config


/////////////////////////// Module-Loader START ////////////////////////////////

  /********************************************************************
  Load dependencies and configurations

  @param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
  @param {Set} config - Custom configuration in key-value pairs

  @return nothing
  *********************************************************************/
  const loader = function(shared_libs, config){

    // Shared Dependencies (Must be loaded in memory already)
    Lib.Utils = shared_libs.Utils;
    Lib.Debug = shared_libs.Debug;
    Lib.Crypto = shared_libs.Crypto;
    Lib.Instance = shared_libs.Instance;
    Lib.DynamoDB = shared_libs.DynamoDB;

    // Override default configuration
    if( !Lib.Utils.isNullOrUndefined(config) ){
      Object.assign(CONFIG, config); // Merge custom configuration with defaults
    }

    // Private Dependencies
    PairingInput = require('./pairing_input')(Lib, CONFIG);
    PairingData = require('./pairing_data')(Lib, CONFIG);

  };

//////////////////////////// Module-Loader END /////////////////////////////////



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return Public Funtions of this module
  return [Pairing, PairingInput, PairingData];

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START///////////////////////////////
const Pairing = { // Public functions accessible by other modules

  /********************************************************************
  Generate Pairing Code
  Pairing Code is used to link or pair an entity or device

  @param {reference} instance - Request Instance object reference
  @param {requestCallback} cb - Callback function

  @param {String} namespace_entity_id - Namespace Entity-Id
  @param {String} action - Namespace Entity-ID
  @param {String} pairing_code_ttl - Life span (expiry) of this pairing code

  @return - Thru Callback

  @callback(err, response) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Set} pairing_data - Pairing-Data
  *********************************************************************/
  generatePairingCode: function(
    instance, cb,
    namespace_entity_id,
    action, pairing_code_ttl
  ){

    // Create Pairing Data
    const pairing_data = PairingData.createPairingData(
      namespace_entity_id,
      _Pairing.generatePairingCode(), // Generate New Code
      action,
      instance['time'], // Time of Creation
      instance['time'] + pairing_code_ttl, // Time of Expiration
    );


    // Add Record
    Lib.DynamoDB.addRecord(
      instance,
      function(err, is_success){

        // Database Error
        if(err){
          return cb(err); // Return error and exit
        }

        if(!is_success){ // Coupon Database Error
          return cb( Lib.Utils.error(CONFIG.ERR.DATABASE_WRITE_FAILED) ); // Invoke callback with error
        }


        // Reach here means all good

        // Return
        return cb(
          null,
          pairing_data
        );

      },
      CONFIG.DB_SOURCE,
      _Pairing.createNdbDataFromPairingData(pairing_data)
    );

  },


  /********************************************************************
  Get Pairing-Data
  This Function is used for polling to check whether the device or entity is linked or not. It internally increases the time of expiry for session management

  @param {reference} instance - Request Instance object reference
  @param {requestCallback} cb - Callback function

  @param {String} namespace_entity_id - Namespace Entity-Id
  @param {String} action - Pairing-Action
  @param {String} pairing_code - Pairing-Code
  @param {String} pairing_code_ttl - Life span (expiry) of this pairing code

  @return - Thru Callback

  @callback(err, response) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Set} pairing_data - Pairing-Data
  *********************************************************************/
  getPairingData: function(
    instance, cb,
    namespace_entity_id,
    action, pairing_code,
    pairing_code_ttl
  ){

    // DB-ID
    var db_id = {
      'p': _Pairing.constructPartitionKey(
        namespace_entity_id,
        action
      ),
      'id': pairing_code
    };


    // Check Verification-code. Remove-code and return true if valid. Increment fail-count and return false if invalid.
    Lib.DynamoDB.getRecord(
      instance,
      function(err, response){

        // Database Error
        if(err){
          return cb(err); // Return error and exit
        }

        // If data not found
        if(!response){
          return cb(null, false); // Return with negative response
        }


        // Reach here means all good

        // Update Expiry
        Lib.DynamoDB.updateRecord(
          instance,
          function(err, update_response){

            // Database Error
            if(err){
              return cb(err); // Return error and exit
            }


            // Reach here means all good

            // Return
            return cb(
              null,
              PairingData.createPairingData(
                namespace_entity_id,
                pairing_code,
                action,
                update_response['toc'], // time_of_creation
                update_response['toe'], // time_of_expiry
                update_response['d']
              )
            )

          },
          CONFIG.DB_SOURCE,
          db_id,
          null, // update_data
          null, // remove_keys
          {
            'toe': pairing_code_ttl
          },
          null, // decrement
          'ALL_NEW' // return_state
        );

      },
      CONFIG.DB_SOURCE,
      db_id
    );

  },


  /********************************************************************
  Pair Entity (Link a device or entity using pairing code)

  @param {reference} instance - Request Instance object reference
  @param {requestCallback} cb - Callback function

  @param {String} namespace_entity_id - Namespace Entity-Id
  @param {String} action - Namespace Entity-ID
  @param {String} pairing_code - Pairing-Code
  @param {Set} entity_data - Entity-Data

  @return - Thru Callback

  @callback(err, response) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Set} pairing_data - Pairing-Data
  *********************************************************************/
  pairEntity: function(
    instance, cb,
    namespace_entity_id,
    action, pairing_code,
    entity_data
  ){

    // DB-ID
    var db_id = {
      'p': _Pairing.constructPartitionKey(
        namespace_entity_id,
        action
      ),
      'id': pairing_code
    };


    // Add Record
    Lib.DynamoDB.updateRecord(
      instance,
      function(err, response){

        // Database Error
        if(err){
          return cb(err); // Return error and exit
        }


        // Reach here means all good

        // Return
        return cb(
          null,
          PairingData.createPairingData(
            namespace_entity_id,
            pairing_code,
            action,
            response['toc'], // time_of_creation
            response['toe'], // time_of_expiry
            response['d']
          )
        );

      },
      CONFIG.DB_SOURCE,
      db_id,
      {
        'd': entity_data
      }, // update_data
      null, // remove_keys
      null, // Increment
      null, // Decrement
      'ALL_NEW' // return_state
    );

  },


  /********************************************************************
  Consume Pairing Code (Delete the code after a device or entity is linked using this code )

  @param {reference} instance - Request Instance object reference
  @param {requestCallback} cb - Callback function

  @param {String} namespace_entity_id - Namespace Entity-Id
  @param {String} action - Namespace Entity-ID
  @param {String} pairing_code - Pairing-Code

  @return - Thru Callback

  @callback(err, is_success) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Boolean} is_success - True in case pairing-code is consumed
  *********************************************************************/
  consumePairingCode: function(
    instance, cb,
    namespace_entity_id,
    action, pairing_code
  ){

    // DB-ID
    var db_id = {
      'p': _Pairing.constructPartitionKey(
        namespace_entity_id,
        action
      ),
      'id': pairing_code
    };


    // Add Record
    Lib.DynamoDB.deleteRecord(
      instance,
      cb, // Return as-it-is
      CONFIG.DB_SOURCE,
      db_id
    );

  },

};///////////////////////////Public Functions END///////////////////////////////



//////////////////////////Private Functions START///////////////////////////////
const _Pairing = { // Private functions accessible within this modules only

  /********************************************************************
  Create NDB-Record to be saved in DB

  @param {Set} pairing_data - Pairing-Data

  @return {Set} - ndb_data
  *********************************************************************/
  createNdbDataFromPairingData: function( pairing_data ){

    // Ndb-Data
    return {
      'p': _Pairing.constructPartitionKey(
        pairing_data['partition_id'],
        pairing_data['action']
      ),
      'id': pairing_data['pairing_code'],
      'toc': pairing_data['time_of_creation'],
      'toe': pairing_data['time_of_expiry']
    }

  },


  /********************************************************************
  Construct Partition Key

  @param {String} namespace_entity_id - Namespace Entity-ID
  @param {String} action - Pairing Action

  @return {String} - namespace_entity_id + '-' + action
  *********************************************************************/
  constructPartitionKey: function(namespace_entity_id, action){

    // Partition Key
    return (namespace_entity_id + '_' + action)

  },


  /********************************************************************
  De-Construct Partition Key

  @param {String} partition_key - Partition-Key

  @return {String[]} - [namespace_entity_id, action]
  *********************************************************************/
  deconstructPartitionKey: function(partition_key){

    // Partition Key
    return partition_key.split('_');

  },


  /********************************************************************
  Generate Random Auth-Key

  No Params

  @return {String} - Pairing Code
  *********************************************************************/
  generatePairingCode: function(){

    // Generate Pairing-Code
    return Lib.Crypto.generateRandomString(
      CONFIG.PAIRING_CODE_CHARSET,
      CONFIG.PAIRING_CODE_LENGTH
    ); // Generate random string

  },

};/////////////////////////Private Functions END////////////////////////////////
