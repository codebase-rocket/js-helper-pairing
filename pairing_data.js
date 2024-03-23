// Info: Contains Functions Related to Pairing-code Data-Structures
'use strict';

// Shared Dependencies (Managed by Main Entry Module & Loader)
var Lib;

// Exclusive Dependencies
var CONFIG; // (Managed by Main Entry Module & Loader)


/////////////////////////// Module-Loader START ////////////////////////////////

  /********************************************************************
  Load dependencies and configurations

  @param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
  @param {Set} config - Custom configuration in key-value pairs

  @return nothing
  *********************************************************************/
  const loader = function(shared_libs, config){

    // Shared Dependencies (Managed my Main Entry Module)
    Lib = shared_libs;

    // Configuration (Managed my Main Entry Module)
    CONFIG = config;

  };

//////////////////////////// Module-Loader END /////////////////////////////////



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return Public Funtions of this module
  return PairingData;

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START///////////////////////////////
const PairingData = { // Public functions accessible by other modules

  /********************************************************************
  Return a pairing-Data object

  @param {String} partition_id - Root Partition namespace
  @param {String} pairing_code - Pairing-Code
  @param {String} action - Pairing Action
  @param {Integer} time_of_creation - Time of Creation of pairing code (Unix Time)
  @param {Integer} time_of_expiry - Time of Expiration of pairing code (Unix Time)
  @param {Set} entity_data - Entity-Data which needs to be paired

  @return {Map} - Pairing-Data Object in key-value
  *********************************************************************/
  createPairingData: function(
    partition_id, pairing_code, action,
    time_of_creation, time_of_expiry, entity_data
  ){

    return {
      'partition_id'          : partition_id,
      'pairing_code'          : pairing_code,
      'action'                : action,
      'time_of_creation'      : time_of_creation,
      'time_of_expiry'        : time_of_expiry,
      'entity_data'           : entity_data,
    };

  },

};///////////////////////////Public Functions END///////////////////////////////



//////////////////////////Private Functions START///////////////////////////////
const _Pairing = { // Private functions accessible within this modules only
  // None
};/////////////////////////Private Functions END////////////////////////////////
