### ff126-w10
Invalid ranges:
* char-0 - char-31
* char-34 - char-34
* char-42 - char-42
* char-47 - char-47
* char-58 - char-58
* char-60 - char-60
* char-62 - char-63
* char-92 - char-92
* char-124 - char-124
* char-127 - char-127
### ff129-w10
| Case               | Compare to ff126-w10                                                             |
| ------------------ | -------------------------------------------------------------------------------- |
| char-37            | test-37-_.html vs. test-37-%.html                                                |
| dot-space-folder   | Error: filename must not contain illegal characters vs. 1. This is foo\bar.html  |
| dot-space-2-folder | Error: filename must not contain illegal characters vs. 1.This is foo\bar.html   |
| dot-space-3-folder | Error: filename must not contain illegal characters vs. 1.1 This is foo\bar.html |
### edge126-w10
| Case    | Compare to ff126-w10                                            |
| ------- | --------------------------------------------------------------- |
| char-0  | test-0- vs. Error: filename must not contain illegal characters |
| char-37 | test-37-_.html vs. test-37-%.html                               |