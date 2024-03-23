// Info: Contains Functions Related to Pairing-Code Cleanup and Validations
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
  return PairingInput;

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START///////////////////////////////
const PairingInput = { // Public functions accessible by other modules

  /********************************************************************
  Return cleaned Pairing-Code for non-sql purposes
  Remove all the dangerous characters excluding those who satisfy RegExp

  @param {String} pairing_code - Pairing Code to be cleaned

  @return {String} - Sanitized string
  *********************************************************************/
  sanitizePairingCode: function(pairing_code){

    // Clean and return
    return Lib.Utils.sanitizeUsingRegx(pairing_code, CONFIG.PAIRING_CODE_SANATIZE_REGX);

  },


  /********************************************************************
  Validate Pairing Code

  @param {String} pairing_code - Pairing Code to be validated

  @return {Boolean} - True in case valid Pairing-Code
  *********************************************************************/
  validatePairingCode: function(pairing_code){

    // Validate
    return (
      Lib.Utils.validateString(
        pairing_code,
        CONFIG.PAIRING_CODE_LENGTH, // Max
        CONFIG.PAIRING_CODE_LENGTH // Min
      ) &&
      CONFIG.PAIRING_CODE_CHARSET_REGX.test(pairing_code)
    );

  },

};///////////////////////////Public Functions END///////////////////////////////



//////////////////////////Private Functions START///////////////////////////////
const _PairingInput = { // Private functions accessible within this modules only
  // None
};/////////////////////////Private Functions END////////////////////////////////
