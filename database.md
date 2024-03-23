# v1.0 #

------------
AWS DynamoDB
------------


--------------------------------
Create table - Pairing
--------------------------------
Pairing Codes

* Table Name: test_pairing
* Partition Key: p [string]
* Sort Key: id [string]

* Secondary Index: [NONE]
* Read/write capacity mode: On-demand

* After Table is Created-
* Overview -> Table details -> Time to live attribute -> Manage TTL
  * Time to live attribute: toe

Table Structure
---------------
* p (String)          -> [Partition Key] Partition-Id (Namespace) + '-' + Action
* id (String)         -> [Sort Key] Pairing-Code
* d (Set)             -> Data (Can be entity data which needs to be paired)
* toc (Number)        -> Time of Creation (Unix Time)
* toe (Number)        -> Time of Expiration (Unix Time) (Record will auto expire after this time)
