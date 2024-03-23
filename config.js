// Info: Configuration file
'use strict';


// Export configration as key-value Map
module.exports = {

  // Constraints on Pairing Code
  PAIRING_CODE_CHARSET          : `23456789ABCDEFGHJKMNPQRSTUVWXYZ`, // Valid charset. Alpha-Numeric. Only Uppercasexs
  PAIRING_CODE_SANATIZE_REGX    : /[^0-9A-Z]/gi, // Regular expression for valid Characters. Only digits. Only Uppercasexs
  PAIRING_CODE_CHARSET_REGX     : /^[0-9A-Z]*$/, // Regular expression for valid Characters. Digits. Alphabets. Only Uppercasexs

  // Constraints on Pairing Code Length
  PAIRING_CODE_LENGTH : 4,

  // Database Table Name
  DB_SOURCE             : 'test_pairing',


  // Error Codes
  DATABASE_WRITE_FAILED : {
    CODE: 'DATABASE_WRITE_FAILED',
    MESSAGE: 'Faied to write into verification database'
  },

};
