### ff-126-win10
Invalid ranges:
* 0 - 31
* 34 - 34
* 42 - 42
* 47 - 47
* 58 - 58
* 60 - 60
* 62 - 63
* 92 - 92
* 124 - 124
* 127 - 127
### ff-129-win10
| Case | Compare to ff-126-win10                                                |
| ---- | ---------------------------------------------------------------------- |
| 37   | Error: filename must not contain illegal characters vs. test-37-%.html |
### edge-126-win10
| Case | Compare to ff-126-win10                                         |
| ---- | --------------------------------------------------------------- |
| 0    | test-0- vs. Error: filename must not contain illegal characters |
| 37   | test-37-_.html vs. test-37-%.html                               |