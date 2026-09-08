// Level 1-99 base-stat progression: linear interpolation between each character's
// given starting stats and their confirmed level-99 stats (from the spreadsheet).
// Index into byLevel with (level - startLevel).
const TTA_LEVELS = {
 "berethor": {
  "startLevel": 1,
  "byLevel": [
   {
    "strength": 12,
    "spirit": 11,
    "constitution": 10,
    "speed": 11,
    "dexterity": 12
   },
   {
    "strength": 13,
    "spirit": 12,
    "constitution": 11,
    "speed": 12,
    "dexterity": 13
   },
   {
    "strength": 14,
    "spirit": 13,
    "constitution": 11,
    "speed": 12,
    "dexterity": 13
   },
   {
    "strength": 15,
    "spirit": 14,
    "constitution": 12,
    "speed": 13,
    "dexterity": 14
   },
   {
    "strength": 16,
    "spirit": 15,
    "constitution": 13,
    "speed": 14,
    "dexterity": 15
   },
   {
    "strength": 16,
    "spirit": 16,
    "constitution": 14,
    "speed": 14,
    "dexterity": 15
   },
   {
    "strength": 17,
    "spirit": 17,
    "constitution": 14,
    "speed": 15,
    "dexterity": 16
   },
   {
    "strength": 18,
    "spirit": 18,
    "constitution": 15,
    "speed": 16,
    "dexterity": 17
   },
   {
    "strength": 19,
    "spirit": 18,
    "constitution": 16,
    "speed": 16,
    "dexterity": 17
   },
   {
    "strength": 20,
    "spirit": 19,
    "constitution": 16,
    "speed": 17,
    "dexterity": 18
   },
   {
    "strength": 21,
    "spirit": 20,
    "constitution": 17,
    "speed": 18,
    "dexterity": 19
   },
   {
    "strength": 22,
    "spirit": 21,
    "constitution": 18,
    "speed": 18,
    "dexterity": 19
   },
   {
    "strength": 23,
    "spirit": 22,
    "constitution": 19,
    "speed": 19,
    "dexterity": 20
   },
   {
    "strength": 24,
    "spirit": 23,
    "constitution": 19,
    "speed": 20,
    "dexterity": 20
   },
   {
    "strength": 24,
    "spirit": 24,
    "constitution": 20,
    "speed": 20,
    "dexterity": 21
   },
   {
    "strength": 25,
    "spirit": 25,
    "constitution": 21,
    "speed": 21,
    "dexterity": 22
   },
   {
    "strength": 26,
    "spirit": 26,
    "constitution": 21,
    "speed": 22,
    "dexterity": 22
   },
   {
    "strength": 27,
    "spirit": 27,
    "constitution": 22,
    "speed": 22,
    "dexterity": 23
   },
   {
    "strength": 28,
    "spirit": 28,
    "constitution": 23,
    "speed": 23,
    "dexterity": 24
   },
   {
    "strength": 29,
    "spirit": 29,
    "constitution": 24,
    "speed": 24,
    "dexterity": 24
   },
   {
    "strength": 30,
    "spirit": 30,
    "constitution": 24,
    "speed": 24,
    "dexterity": 25
   },
   {
    "strength": 31,
    "spirit": 30,
    "constitution": 25,
    "speed": 25,
    "dexterity": 26
   },
   {
    "strength": 32,
    "spirit": 31,
    "constitution": 26,
    "speed": 26,
    "dexterity": 26
   },
   {
    "strength": 32,
    "spirit": 32,
    "constitution": 26,
    "speed": 26,
    "dexterity": 27
   },
   {
    "strength": 33,
    "spirit": 33,
    "constitution": 27,
    "speed": 27,
    "dexterity": 28
   },
   {
    "strength": 34,
    "spirit": 34,
    "constitution": 28,
    "speed": 28,
    "dexterity": 28
   },
   {
    "strength": 35,
    "spirit": 35,
    "constitution": 29,
    "speed": 29,
    "dexterity": 29
   },
   {
    "strength": 36,
    "spirit": 36,
    "constitution": 29,
    "speed": 29,
    "dexterity": 30
   },
   {
    "strength": 37,
    "spirit": 37,
    "constitution": 30,
    "speed": 30,
    "dexterity": 30
   },
   {
    "strength": 38,
    "spirit": 38,
    "constitution": 31,
    "speed": 31,
    "dexterity": 31
   },
   {
    "strength": 39,
    "spirit": 39,
    "constitution": 31,
    "speed": 31,
    "dexterity": 32
   },
   {
    "strength": 40,
    "spirit": 40,
    "constitution": 32,
    "speed": 32,
    "dexterity": 32
   },
   {
    "strength": 40,
    "spirit": 41,
    "constitution": 33,
    "speed": 33,
    "dexterity": 33
   },
   {
    "strength": 41,
    "spirit": 42,
    "constitution": 34,
    "speed": 33,
    "dexterity": 34
   },
   {
    "strength": 42,
    "spirit": 43,
    "constitution": 34,
    "speed": 34,
    "dexterity": 34
   },
   {
    "strength": 43,
    "spirit": 44,
    "constitution": 35,
    "speed": 35,
    "dexterity": 35
   },
   {
    "strength": 44,
    "spirit": 44,
    "constitution": 36,
    "speed": 35,
    "dexterity": 36
   },
   {
    "strength": 45,
    "spirit": 45,
    "constitution": 36,
    "speed": 36,
    "dexterity": 36
   },
   {
    "strength": 46,
    "spirit": 46,
    "constitution": 37,
    "speed": 37,
    "dexterity": 37
   },
   {
    "strength": 47,
    "spirit": 47,
    "constitution": 38,
    "speed": 37,
    "dexterity": 37
   },
   {
    "strength": 48,
    "spirit": 48,
    "constitution": 39,
    "speed": 38,
    "dexterity": 38
   },
   {
    "strength": 48,
    "spirit": 49,
    "constitution": 39,
    "speed": 39,
    "dexterity": 39
   },
   {
    "strength": 49,
    "spirit": 50,
    "constitution": 40,
    "speed": 39,
    "dexterity": 39
   },
   {
    "strength": 50,
    "spirit": 51,
    "constitution": 41,
    "speed": 40,
    "dexterity": 40
   },
   {
    "strength": 51,
    "spirit": 52,
    "constitution": 41,
    "speed": 41,
    "dexterity": 41
   },
   {
    "strength": 52,
    "spirit": 53,
    "constitution": 42,
    "speed": 41,
    "dexterity": 41
   },
   {
    "strength": 53,
    "spirit": 54,
    "constitution": 43,
    "speed": 42,
    "dexterity": 42
   },
   {
    "strength": 54,
    "spirit": 55,
    "constitution": 44,
    "speed": 43,
    "dexterity": 43
   },
   {
    "strength": 55,
    "spirit": 56,
    "constitution": 44,
    "speed": 43,
    "dexterity": 43
   },
   {
    "strength": 56,
    "spirit": 56,
    "constitution": 45,
    "speed": 44,
    "dexterity": 44
   },
   {
    "strength": 56,
    "spirit": 57,
    "constitution": 46,
    "speed": 45,
    "dexterity": 45
   },
   {
    "strength": 57,
    "spirit": 58,
    "constitution": 46,
    "speed": 45,
    "dexterity": 45
   },
   {
    "strength": 58,
    "spirit": 59,
    "constitution": 47,
    "speed": 46,
    "dexterity": 46
   },
   {
    "strength": 59,
    "spirit": 60,
    "constitution": 48,
    "speed": 47,
    "dexterity": 47
   },
   {
    "strength": 60,
    "spirit": 61,
    "constitution": 49,
    "speed": 47,
    "dexterity": 47
   },
   {
    "strength": 61,
    "spirit": 62,
    "constitution": 49,
    "speed": 48,
    "dexterity": 48
   },
   {
    "strength": 62,
    "spirit": 63,
    "constitution": 50,
    "speed": 49,
    "dexterity": 49
   },
   {
    "strength": 63,
    "spirit": 64,
    "constitution": 51,
    "speed": 49,
    "dexterity": 49
   },
   {
    "strength": 63,
    "spirit": 65,
    "constitution": 51,
    "speed": 50,
    "dexterity": 50
   },
   {
    "strength": 64,
    "spirit": 66,
    "constitution": 52,
    "speed": 51,
    "dexterity": 51
   },
   {
    "strength": 65,
    "spirit": 67,
    "constitution": 53,
    "speed": 51,
    "dexterity": 51
   },
   {
    "strength": 66,
    "spirit": 68,
    "constitution": 54,
    "speed": 52,
    "dexterity": 52
   },
   {
    "strength": 67,
    "spirit": 69,
    "constitution": 54,
    "speed": 53,
    "dexterity": 52
   },
   {
    "strength": 68,
    "spirit": 70,
    "constitution": 55,
    "speed": 53,
    "dexterity": 53
   },
   {
    "strength": 69,
    "spirit": 70,
    "constitution": 56,
    "speed": 54,
    "dexterity": 54
   },
   {
    "strength": 70,
    "spirit": 71,
    "constitution": 56,
    "speed": 55,
    "dexterity": 54
   },
   {
    "strength": 71,
    "spirit": 72,
    "constitution": 57,
    "speed": 55,
    "dexterity": 55
   },
   {
    "strength": 71,
    "spirit": 73,
    "constitution": 58,
    "speed": 56,
    "dexterity": 56
   },
   {
    "strength": 72,
    "spirit": 74,
    "constitution": 59,
    "speed": 57,
    "dexterity": 56
   },
   {
    "strength": 73,
    "spirit": 75,
    "constitution": 59,
    "speed": 57,
    "dexterity": 57
   },
   {
    "strength": 74,
    "spirit": 76,
    "constitution": 60,
    "speed": 58,
    "dexterity": 58
   },
   {
    "strength": 75,
    "spirit": 77,
    "constitution": 61,
    "speed": 59,
    "dexterity": 58
   },
   {
    "strength": 76,
    "spirit": 78,
    "constitution": 61,
    "speed": 59,
    "dexterity": 59
   },
   {
    "strength": 77,
    "spirit": 79,
    "constitution": 62,
    "speed": 60,
    "dexterity": 60
   },
   {
    "strength": 78,
    "spirit": 80,
    "constitution": 63,
    "speed": 61,
    "dexterity": 60
   },
   {
    "strength": 79,
    "spirit": 81,
    "constitution": 64,
    "speed": 62,
    "dexterity": 61
   },
   {
    "strength": 79,
    "spirit": 82,
    "constitution": 64,
    "speed": 62,
    "dexterity": 62
   },
   {
    "strength": 80,
    "spirit": 82,
    "constitution": 65,
    "speed": 63,
    "dexterity": 62
   },
   {
    "strength": 81,
    "spirit": 83,
    "constitution": 66,
    "speed": 64,
    "dexterity": 63
   },
   {
    "strength": 82,
    "spirit": 84,
    "constitution": 66,
    "speed": 64,
    "dexterity": 64
   },
   {
    "strength": 83,
    "spirit": 85,
    "constitution": 67,
    "speed": 65,
    "dexterity": 64
   },
   {
    "strength": 84,
    "spirit": 86,
    "constitution": 68,
    "speed": 66,
    "dexterity": 65
   },
   {
    "strength": 85,
    "spirit": 87,
    "constitution": 69,
    "speed": 66,
    "dexterity": 66
   },
   {
    "strength": 86,
    "spirit": 88,
    "constitution": 69,
    "speed": 67,
    "dexterity": 66
   },
   {
    "strength": 87,
    "spirit": 89,
    "constitution": 70,
    "speed": 68,
    "dexterity": 67
   },
   {
    "strength": 87,
    "spirit": 90,
    "constitution": 71,
    "speed": 68,
    "dexterity": 68
   },
   {
    "strength": 88,
    "spirit": 91,
    "constitution": 71,
    "speed": 69,
    "dexterity": 68
   },
   {
    "strength": 89,
    "spirit": 92,
    "constitution": 72,
    "speed": 70,
    "dexterity": 69
   },
   {
    "strength": 90,
    "spirit": 93,
    "constitution": 73,
    "speed": 70,
    "dexterity": 69
   },
   {
    "strength": 91,
    "spirit": 94,
    "constitution": 74,
    "speed": 71,
    "dexterity": 70
   },
   {
    "strength": 92,
    "spirit": 95,
    "constitution": 74,
    "speed": 72,
    "dexterity": 71
   },
   {
    "strength": 93,
    "spirit": 96,
    "constitution": 75,
    "speed": 72,
    "dexterity": 71
   },
   {
    "strength": 94,
    "spirit": 96,
    "constitution": 76,
    "speed": 73,
    "dexterity": 72
   },
   {
    "strength": 95,
    "spirit": 97,
    "constitution": 76,
    "speed": 74,
    "dexterity": 73
   },
   {
    "strength": 95,
    "spirit": 98,
    "constitution": 77,
    "speed": 74,
    "dexterity": 73
   },
   {
    "strength": 96,
    "spirit": 99,
    "constitution": 78,
    "speed": 75,
    "dexterity": 74
   },
   {
    "strength": 97,
    "spirit": 100,
    "constitution": 79,
    "speed": 76,
    "dexterity": 75
   },
   {
    "strength": 98,
    "spirit": 101,
    "constitution": 79,
    "speed": 76,
    "dexterity": 75
   },
   {
    "strength": 99,
    "spirit": 102,
    "constitution": 80,
    "speed": 77,
    "dexterity": 76
   }
  ]
 },
 "idrial": {
  "startLevel": 1,
  "byLevel": [
   {
    "strength": 9,
    "spirit": 13,
    "constitution": 9,
    "speed": 12,
    "dexterity": 12
   },
   {
    "strength": 10,
    "spirit": 14,
    "constitution": 10,
    "speed": 13,
    "dexterity": 13
   },
   {
    "strength": 10,
    "spirit": 15,
    "constitution": 10,
    "speed": 13,
    "dexterity": 13
   },
   {
    "strength": 11,
    "spirit": 16,
    "constitution": 11,
    "speed": 14,
    "dexterity": 14
   },
   {
    "strength": 12,
    "spirit": 18,
    "constitution": 12,
    "speed": 15,
    "dexterity": 15
   },
   {
    "strength": 12,
    "spirit": 19,
    "constitution": 12,
    "speed": 16,
    "dexterity": 15
   },
   {
    "strength": 13,
    "spirit": 20,
    "constitution": 13,
    "speed": 16,
    "dexterity": 16
   },
   {
    "strength": 14,
    "spirit": 21,
    "constitution": 14,
    "speed": 17,
    "dexterity": 17
   },
   {
    "strength": 14,
    "spirit": 22,
    "constitution": 14,
    "speed": 18,
    "dexterity": 17
   },
   {
    "strength": 15,
    "spirit": 23,
    "constitution": 15,
    "speed": 18,
    "dexterity": 18
   },
   {
    "strength": 16,
    "spirit": 25,
    "constitution": 16,
    "speed": 19,
    "dexterity": 19
   },
   {
    "strength": 17,
    "spirit": 26,
    "constitution": 17,
    "speed": 20,
    "dexterity": 19
   },
   {
    "strength": 17,
    "spirit": 27,
    "constitution": 17,
    "speed": 20,
    "dexterity": 20
   },
   {
    "strength": 18,
    "spirit": 28,
    "constitution": 18,
    "speed": 21,
    "dexterity": 20
   },
   {
    "strength": 19,
    "spirit": 29,
    "constitution": 19,
    "speed": 22,
    "dexterity": 21
   },
   {
    "strength": 19,
    "spirit": 30,
    "constitution": 19,
    "speed": 23,
    "dexterity": 22
   },
   {
    "strength": 20,
    "spirit": 31,
    "constitution": 20,
    "speed": 23,
    "dexterity": 22
   },
   {
    "strength": 21,
    "spirit": 33,
    "constitution": 21,
    "speed": 24,
    "dexterity": 23
   },
   {
    "strength": 21,
    "spirit": 34,
    "constitution": 21,
    "speed": 25,
    "dexterity": 24
   },
   {
    "strength": 22,
    "spirit": 35,
    "constitution": 22,
    "speed": 25,
    "dexterity": 24
   },
   {
    "strength": 23,
    "spirit": 36,
    "constitution": 23,
    "speed": 26,
    "dexterity": 25
   },
   {
    "strength": 23,
    "spirit": 37,
    "constitution": 23,
    "speed": 27,
    "dexterity": 26
   },
   {
    "strength": 24,
    "spirit": 38,
    "constitution": 24,
    "speed": 27,
    "dexterity": 26
   },
   {
    "strength": 25,
    "spirit": 40,
    "constitution": 25,
    "speed": 28,
    "dexterity": 27
   },
   {
    "strength": 25,
    "spirit": 41,
    "constitution": 25,
    "speed": 29,
    "dexterity": 28
   },
   {
    "strength": 26,
    "spirit": 42,
    "constitution": 26,
    "speed": 30,
    "dexterity": 28
   },
   {
    "strength": 27,
    "spirit": 43,
    "constitution": 27,
    "speed": 30,
    "dexterity": 29
   },
   {
    "strength": 27,
    "spirit": 44,
    "constitution": 27,
    "speed": 31,
    "dexterity": 30
   },
   {
    "strength": 28,
    "spirit": 45,
    "constitution": 28,
    "speed": 32,
    "dexterity": 30
   },
   {
    "strength": 29,
    "spirit": 46,
    "constitution": 29,
    "speed": 32,
    "dexterity": 31
   },
   {
    "strength": 30,
    "spirit": 48,
    "constitution": 30,
    "speed": 33,
    "dexterity": 32
   },
   {
    "strength": 30,
    "spirit": 49,
    "constitution": 30,
    "speed": 34,
    "dexterity": 32
   },
   {
    "strength": 31,
    "spirit": 50,
    "constitution": 31,
    "speed": 35,
    "dexterity": 33
   },
   {
    "strength": 32,
    "spirit": 51,
    "constitution": 32,
    "speed": 35,
    "dexterity": 34
   },
   {
    "strength": 32,
    "spirit": 52,
    "constitution": 32,
    "speed": 36,
    "dexterity": 34
   },
   {
    "strength": 33,
    "spirit": 53,
    "constitution": 33,
    "speed": 37,
    "dexterity": 35
   },
   {
    "strength": 34,
    "spirit": 55,
    "constitution": 34,
    "speed": 37,
    "dexterity": 36
   },
   {
    "strength": 34,
    "spirit": 56,
    "constitution": 34,
    "speed": 38,
    "dexterity": 36
   },
   {
    "strength": 35,
    "spirit": 57,
    "constitution": 35,
    "speed": 39,
    "dexterity": 37
   },
   {
    "strength": 36,
    "spirit": 58,
    "constitution": 36,
    "speed": 39,
    "dexterity": 37
   },
   {
    "strength": 36,
    "spirit": 59,
    "constitution": 36,
    "speed": 40,
    "dexterity": 38
   },
   {
    "strength": 37,
    "spirit": 60,
    "constitution": 37,
    "speed": 41,
    "dexterity": 39
   },
   {
    "strength": 38,
    "spirit": 61,
    "constitution": 38,
    "speed": 42,
    "dexterity": 39
   },
   {
    "strength": 38,
    "spirit": 63,
    "constitution": 38,
    "speed": 42,
    "dexterity": 40
   },
   {
    "strength": 39,
    "spirit": 64,
    "constitution": 39,
    "speed": 43,
    "dexterity": 41
   },
   {
    "strength": 40,
    "spirit": 65,
    "constitution": 40,
    "speed": 44,
    "dexterity": 41
   },
   {
    "strength": 40,
    "spirit": 66,
    "constitution": 40,
    "speed": 44,
    "dexterity": 42
   },
   {
    "strength": 41,
    "spirit": 67,
    "constitution": 41,
    "speed": 45,
    "dexterity": 43
   },
   {
    "strength": 42,
    "spirit": 68,
    "constitution": 42,
    "speed": 46,
    "dexterity": 43
   },
   {
    "strength": 42,
    "spirit": 70,
    "constitution": 42,
    "speed": 46,
    "dexterity": 44
   },
   {
    "strength": 43,
    "spirit": 71,
    "constitution": 43,
    "speed": 47,
    "dexterity": 45
   },
   {
    "strength": 44,
    "spirit": 72,
    "constitution": 44,
    "speed": 48,
    "dexterity": 45
   },
   {
    "strength": 45,
    "spirit": 73,
    "constitution": 45,
    "speed": 49,
    "dexterity": 46
   },
   {
    "strength": 45,
    "spirit": 74,
    "constitution": 45,
    "speed": 49,
    "dexterity": 47
   },
   {
    "strength": 46,
    "spirit": 75,
    "constitution": 46,
    "speed": 50,
    "dexterity": 47
   },
   {
    "strength": 47,
    "spirit": 76,
    "constitution": 47,
    "speed": 51,
    "dexterity": 48
   },
   {
    "strength": 47,
    "spirit": 78,
    "constitution": 47,
    "speed": 51,
    "dexterity": 49
   },
   {
    "strength": 48,
    "spirit": 79,
    "constitution": 48,
    "speed": 52,
    "dexterity": 49
   },
   {
    "strength": 49,
    "spirit": 80,
    "constitution": 49,
    "speed": 53,
    "dexterity": 50
   },
   {
    "strength": 49,
    "spirit": 81,
    "constitution": 49,
    "speed": 54,
    "dexterity": 51
   },
   {
    "strength": 50,
    "spirit": 82,
    "constitution": 50,
    "speed": 54,
    "dexterity": 51
   },
   {
    "strength": 51,
    "spirit": 83,
    "constitution": 51,
    "speed": 55,
    "dexterity": 52
   },
   {
    "strength": 51,
    "spirit": 84,
    "constitution": 51,
    "speed": 56,
    "dexterity": 52
   },
   {
    "strength": 52,
    "spirit": 86,
    "constitution": 52,
    "speed": 56,
    "dexterity": 53
   },
   {
    "strength": 53,
    "spirit": 87,
    "constitution": 53,
    "speed": 57,
    "dexterity": 54
   },
   {
    "strength": 53,
    "spirit": 88,
    "constitution": 53,
    "speed": 58,
    "dexterity": 54
   },
   {
    "strength": 54,
    "spirit": 89,
    "constitution": 54,
    "speed": 58,
    "dexterity": 55
   },
   {
    "strength": 55,
    "spirit": 90,
    "constitution": 55,
    "speed": 59,
    "dexterity": 56
   },
   {
    "strength": 55,
    "spirit": 91,
    "constitution": 55,
    "speed": 60,
    "dexterity": 56
   },
   {
    "strength": 56,
    "spirit": 93,
    "constitution": 56,
    "speed": 61,
    "dexterity": 57
   },
   {
    "strength": 57,
    "spirit": 94,
    "constitution": 57,
    "speed": 61,
    "dexterity": 58
   },
   {
    "strength": 58,
    "spirit": 95,
    "constitution": 58,
    "speed": 62,
    "dexterity": 58
   },
   {
    "strength": 58,
    "spirit": 96,
    "constitution": 58,
    "speed": 63,
    "dexterity": 59
   },
   {
    "strength": 59,
    "spirit": 97,
    "constitution": 59,
    "speed": 63,
    "dexterity": 60
   },
   {
    "strength": 60,
    "spirit": 98,
    "constitution": 60,
    "speed": 64,
    "dexterity": 60
   },
   {
    "strength": 60,
    "spirit": 99,
    "constitution": 60,
    "speed": 65,
    "dexterity": 61
   },
   {
    "strength": 61,
    "spirit": 101,
    "constitution": 61,
    "speed": 66,
    "dexterity": 62
   },
   {
    "strength": 62,
    "spirit": 102,
    "constitution": 62,
    "speed": 66,
    "dexterity": 62
   },
   {
    "strength": 62,
    "spirit": 103,
    "constitution": 62,
    "speed": 67,
    "dexterity": 63
   },
   {
    "strength": 63,
    "spirit": 104,
    "constitution": 63,
    "speed": 68,
    "dexterity": 64
   },
   {
    "strength": 64,
    "spirit": 105,
    "constitution": 64,
    "speed": 68,
    "dexterity": 64
   },
   {
    "strength": 64,
    "spirit": 106,
    "constitution": 64,
    "speed": 69,
    "dexterity": 65
   },
   {
    "strength": 65,
    "spirit": 108,
    "constitution": 65,
    "speed": 70,
    "dexterity": 66
   },
   {
    "strength": 66,
    "spirit": 109,
    "constitution": 66,
    "speed": 70,
    "dexterity": 66
   },
   {
    "strength": 66,
    "spirit": 110,
    "constitution": 66,
    "speed": 71,
    "dexterity": 67
   },
   {
    "strength": 67,
    "spirit": 111,
    "constitution": 67,
    "speed": 72,
    "dexterity": 68
   },
   {
    "strength": 68,
    "spirit": 112,
    "constitution": 68,
    "speed": 73,
    "dexterity": 68
   },
   {
    "strength": 68,
    "spirit": 113,
    "constitution": 68,
    "speed": 73,
    "dexterity": 69
   },
   {
    "strength": 69,
    "spirit": 114,
    "constitution": 69,
    "speed": 74,
    "dexterity": 69
   },
   {
    "strength": 70,
    "spirit": 116,
    "constitution": 70,
    "speed": 75,
    "dexterity": 70
   },
   {
    "strength": 71,
    "spirit": 117,
    "constitution": 71,
    "speed": 75,
    "dexterity": 71
   },
   {
    "strength": 71,
    "spirit": 118,
    "constitution": 71,
    "speed": 76,
    "dexterity": 71
   },
   {
    "strength": 72,
    "spirit": 119,
    "constitution": 72,
    "speed": 77,
    "dexterity": 72
   },
   {
    "strength": 73,
    "spirit": 120,
    "constitution": 73,
    "speed": 77,
    "dexterity": 73
   },
   {
    "strength": 73,
    "spirit": 121,
    "constitution": 73,
    "speed": 78,
    "dexterity": 73
   },
   {
    "strength": 74,
    "spirit": 123,
    "constitution": 74,
    "speed": 79,
    "dexterity": 74
   },
   {
    "strength": 75,
    "spirit": 124,
    "constitution": 75,
    "speed": 80,
    "dexterity": 75
   },
   {
    "strength": 75,
    "spirit": 125,
    "constitution": 75,
    "speed": 80,
    "dexterity": 75
   },
   {
    "strength": 76,
    "spirit": 126,
    "constitution": 76,
    "speed": 81,
    "dexterity": 76
   }
  ]
 },
 "elegost": {
  "startLevel": 5,
  "byLevel": [
   {
    "strength": 16,
    "spirit": 15,
    "constitution": 15,
    "speed": 14,
    "dexterity": 17
   },
   {
    "strength": 17,
    "spirit": 16,
    "constitution": 16,
    "speed": 15,
    "dexterity": 18
   },
   {
    "strength": 17,
    "spirit": 17,
    "constitution": 16,
    "speed": 15,
    "dexterity": 19
   },
   {
    "strength": 18,
    "spirit": 18,
    "constitution": 17,
    "speed": 16,
    "dexterity": 20
   },
   {
    "strength": 19,
    "spirit": 18,
    "constitution": 18,
    "speed": 17,
    "dexterity": 22
   },
   {
    "strength": 20,
    "spirit": 19,
    "constitution": 18,
    "speed": 17,
    "dexterity": 23
   },
   {
    "strength": 20,
    "spirit": 20,
    "constitution": 19,
    "speed": 18,
    "dexterity": 24
   },
   {
    "strength": 21,
    "spirit": 21,
    "constitution": 20,
    "speed": 19,
    "dexterity": 25
   },
   {
    "strength": 22,
    "spirit": 22,
    "constitution": 20,
    "speed": 19,
    "dexterity": 26
   },
   {
    "strength": 22,
    "spirit": 23,
    "constitution": 21,
    "speed": 20,
    "dexterity": 27
   },
   {
    "strength": 23,
    "spirit": 24,
    "constitution": 22,
    "speed": 21,
    "dexterity": 29
   },
   {
    "strength": 24,
    "spirit": 24,
    "constitution": 22,
    "speed": 21,
    "dexterity": 30
   },
   {
    "strength": 24,
    "spirit": 25,
    "constitution": 23,
    "speed": 22,
    "dexterity": 31
   },
   {
    "strength": 25,
    "spirit": 26,
    "constitution": 24,
    "speed": 23,
    "dexterity": 32
   },
   {
    "strength": 26,
    "spirit": 27,
    "constitution": 24,
    "speed": 23,
    "dexterity": 33
   },
   {
    "strength": 27,
    "spirit": 28,
    "constitution": 25,
    "speed": 24,
    "dexterity": 34
   },
   {
    "strength": 27,
    "spirit": 29,
    "constitution": 26,
    "speed": 25,
    "dexterity": 36
   },
   {
    "strength": 28,
    "spirit": 30,
    "constitution": 26,
    "speed": 25,
    "dexterity": 37
   },
   {
    "strength": 29,
    "spirit": 31,
    "constitution": 27,
    "speed": 26,
    "dexterity": 38
   },
   {
    "strength": 29,
    "spirit": 31,
    "constitution": 28,
    "speed": 27,
    "dexterity": 39
   },
   {
    "strength": 30,
    "spirit": 32,
    "constitution": 28,
    "speed": 27,
    "dexterity": 40
   },
   {
    "strength": 31,
    "spirit": 33,
    "constitution": 29,
    "speed": 28,
    "dexterity": 41
   },
   {
    "strength": 31,
    "spirit": 34,
    "constitution": 30,
    "speed": 29,
    "dexterity": 43
   },
   {
    "strength": 32,
    "spirit": 35,
    "constitution": 30,
    "speed": 29,
    "dexterity": 44
   },
   {
    "strength": 33,
    "spirit": 36,
    "constitution": 31,
    "speed": 30,
    "dexterity": 45
   },
   {
    "strength": 34,
    "spirit": 37,
    "constitution": 31,
    "speed": 30,
    "dexterity": 46
   },
   {
    "strength": 34,
    "spirit": 37,
    "constitution": 32,
    "speed": 31,
    "dexterity": 47
   },
   {
    "strength": 35,
    "spirit": 38,
    "constitution": 33,
    "speed": 32,
    "dexterity": 48
   },
   {
    "strength": 36,
    "spirit": 39,
    "constitution": 33,
    "speed": 32,
    "dexterity": 49
   },
   {
    "strength": 36,
    "spirit": 40,
    "constitution": 34,
    "speed": 33,
    "dexterity": 51
   },
   {
    "strength": 37,
    "spirit": 41,
    "constitution": 35,
    "speed": 34,
    "dexterity": 52
   },
   {
    "strength": 38,
    "spirit": 42,
    "constitution": 35,
    "speed": 34,
    "dexterity": 53
   },
   {
    "strength": 38,
    "spirit": 43,
    "constitution": 36,
    "speed": 35,
    "dexterity": 54
   },
   {
    "strength": 39,
    "spirit": 43,
    "constitution": 37,
    "speed": 36,
    "dexterity": 55
   },
   {
    "strength": 40,
    "spirit": 44,
    "constitution": 37,
    "speed": 36,
    "dexterity": 56
   },
   {
    "strength": 41,
    "spirit": 45,
    "constitution": 38,
    "speed": 37,
    "dexterity": 58
   },
   {
    "strength": 41,
    "spirit": 46,
    "constitution": 39,
    "speed": 38,
    "dexterity": 59
   },
   {
    "strength": 42,
    "spirit": 47,
    "constitution": 39,
    "speed": 38,
    "dexterity": 60
   },
   {
    "strength": 43,
    "spirit": 48,
    "constitution": 40,
    "speed": 39,
    "dexterity": 61
   },
   {
    "strength": 43,
    "spirit": 49,
    "constitution": 41,
    "speed": 40,
    "dexterity": 62
   },
   {
    "strength": 44,
    "spirit": 49,
    "constitution": 41,
    "speed": 40,
    "dexterity": 63
   },
   {
    "strength": 45,
    "spirit": 50,
    "constitution": 42,
    "speed": 41,
    "dexterity": 65
   },
   {
    "strength": 45,
    "spirit": 51,
    "constitution": 43,
    "speed": 42,
    "dexterity": 66
   },
   {
    "strength": 46,
    "spirit": 52,
    "constitution": 43,
    "speed": 42,
    "dexterity": 67
   },
   {
    "strength": 47,
    "spirit": 53,
    "constitution": 44,
    "speed": 43,
    "dexterity": 68
   },
   {
    "strength": 48,
    "spirit": 54,
    "constitution": 45,
    "speed": 44,
    "dexterity": 69
   },
   {
    "strength": 48,
    "spirit": 55,
    "constitution": 45,
    "speed": 44,
    "dexterity": 70
   },
   {
    "strength": 49,
    "spirit": 56,
    "constitution": 46,
    "speed": 45,
    "dexterity": 72
   },
   {
    "strength": 50,
    "spirit": 56,
    "constitution": 47,
    "speed": 46,
    "dexterity": 73
   },
   {
    "strength": 50,
    "spirit": 57,
    "constitution": 47,
    "speed": 46,
    "dexterity": 74
   },
   {
    "strength": 51,
    "spirit": 58,
    "constitution": 48,
    "speed": 47,
    "dexterity": 75
   },
   {
    "strength": 52,
    "spirit": 59,
    "constitution": 49,
    "speed": 48,
    "dexterity": 76
   },
   {
    "strength": 53,
    "spirit": 60,
    "constitution": 49,
    "speed": 48,
    "dexterity": 77
   },
   {
    "strength": 53,
    "spirit": 61,
    "constitution": 50,
    "speed": 49,
    "dexterity": 78
   },
   {
    "strength": 54,
    "spirit": 62,
    "constitution": 51,
    "speed": 50,
    "dexterity": 80
   },
   {
    "strength": 55,
    "spirit": 62,
    "constitution": 51,
    "speed": 50,
    "dexterity": 81
   },
   {
    "strength": 55,
    "spirit": 63,
    "constitution": 52,
    "speed": 51,
    "dexterity": 82
   },
   {
    "strength": 56,
    "spirit": 64,
    "constitution": 53,
    "speed": 52,
    "dexterity": 83
   },
   {
    "strength": 57,
    "spirit": 65,
    "constitution": 53,
    "speed": 52,
    "dexterity": 84
   },
   {
    "strength": 57,
    "spirit": 66,
    "constitution": 54,
    "speed": 53,
    "dexterity": 85
   },
   {
    "strength": 58,
    "spirit": 67,
    "constitution": 55,
    "speed": 54,
    "dexterity": 87
   },
   {
    "strength": 59,
    "spirit": 68,
    "constitution": 55,
    "speed": 54,
    "dexterity": 88
   },
   {
    "strength": 60,
    "spirit": 68,
    "constitution": 56,
    "speed": 55,
    "dexterity": 89
   },
   {
    "strength": 60,
    "spirit": 69,
    "constitution": 57,
    "speed": 56,
    "dexterity": 90
   },
   {
    "strength": 61,
    "spirit": 70,
    "constitution": 57,
    "speed": 56,
    "dexterity": 91
   },
   {
    "strength": 62,
    "spirit": 71,
    "constitution": 58,
    "speed": 57,
    "dexterity": 92
   },
   {
    "strength": 62,
    "spirit": 72,
    "constitution": 59,
    "speed": 58,
    "dexterity": 94
   },
   {
    "strength": 63,
    "spirit": 73,
    "constitution": 59,
    "speed": 58,
    "dexterity": 95
   },
   {
    "strength": 64,
    "spirit": 74,
    "constitution": 60,
    "speed": 59,
    "dexterity": 96
   },
   {
    "strength": 64,
    "spirit": 74,
    "constitution": 61,
    "speed": 60,
    "dexterity": 97
   },
   {
    "strength": 65,
    "spirit": 75,
    "constitution": 61,
    "speed": 60,
    "dexterity": 98
   },
   {
    "strength": 66,
    "spirit": 76,
    "constitution": 62,
    "speed": 61,
    "dexterity": 99
   },
   {
    "strength": 67,
    "spirit": 77,
    "constitution": 62,
    "speed": 61,
    "dexterity": 100
   },
   {
    "strength": 67,
    "spirit": 78,
    "constitution": 63,
    "speed": 62,
    "dexterity": 102
   },
   {
    "strength": 68,
    "spirit": 79,
    "constitution": 64,
    "speed": 63,
    "dexterity": 103
   },
   {
    "strength": 69,
    "spirit": 80,
    "constitution": 64,
    "speed": 63,
    "dexterity": 104
   },
   {
    "strength": 69,
    "spirit": 80,
    "constitution": 65,
    "speed": 64,
    "dexterity": 105
   },
   {
    "strength": 70,
    "spirit": 81,
    "constitution": 66,
    "speed": 65,
    "dexterity": 106
   },
   {
    "strength": 71,
    "spirit": 82,
    "constitution": 66,
    "speed": 65,
    "dexterity": 107
   },
   {
    "strength": 71,
    "spirit": 83,
    "constitution": 67,
    "speed": 66,
    "dexterity": 109
   },
   {
    "strength": 72,
    "spirit": 84,
    "constitution": 68,
    "speed": 67,
    "dexterity": 110
   },
   {
    "strength": 73,
    "spirit": 85,
    "constitution": 68,
    "speed": 67,
    "dexterity": 111
   },
   {
    "strength": 74,
    "spirit": 86,
    "constitution": 69,
    "speed": 68,
    "dexterity": 112
   },
   {
    "strength": 74,
    "spirit": 87,
    "constitution": 70,
    "speed": 69,
    "dexterity": 113
   },
   {
    "strength": 75,
    "spirit": 87,
    "constitution": 70,
    "speed": 69,
    "dexterity": 114
   },
   {
    "strength": 76,
    "spirit": 88,
    "constitution": 71,
    "speed": 70,
    "dexterity": 116
   },
   {
    "strength": 76,
    "spirit": 89,
    "constitution": 72,
    "speed": 71,
    "dexterity": 117
   },
   {
    "strength": 77,
    "spirit": 90,
    "constitution": 72,
    "speed": 71,
    "dexterity": 118
   },
   {
    "strength": 78,
    "spirit": 91,
    "constitution": 73,
    "speed": 72,
    "dexterity": 119
   },
   {
    "strength": 78,
    "spirit": 92,
    "constitution": 74,
    "speed": 73,
    "dexterity": 120
   },
   {
    "strength": 79,
    "spirit": 93,
    "constitution": 74,
    "speed": 73,
    "dexterity": 121
   },
   {
    "strength": 80,
    "spirit": 93,
    "constitution": 75,
    "speed": 74,
    "dexterity": 123
   },
   {
    "strength": 81,
    "spirit": 94,
    "constitution": 76,
    "speed": 75,
    "dexterity": 124
   },
   {
    "strength": 81,
    "spirit": 95,
    "constitution": 76,
    "speed": 75,
    "dexterity": 125
   },
   {
    "strength": 82,
    "spirit": 96,
    "constitution": 77,
    "speed": 76,
    "dexterity": 126
   }
  ]
 },
 "hadhod": {
  "startLevel": 9,
  "byLevel": [
   {
    "strength": 16,
    "spirit": 15,
    "constitution": 33,
    "speed": 14,
    "dexterity": 19
   },
   {
    "strength": 17,
    "spirit": 16,
    "constitution": 34,
    "speed": 15,
    "dexterity": 20
   },
   {
    "strength": 18,
    "spirit": 16,
    "constitution": 35,
    "speed": 15,
    "dexterity": 20
   },
   {
    "strength": 19,
    "spirit": 17,
    "constitution": 36,
    "speed": 16,
    "dexterity": 21
   },
   {
    "strength": 20,
    "spirit": 18,
    "constitution": 37,
    "speed": 17,
    "dexterity": 22
   },
   {
    "strength": 21,
    "spirit": 19,
    "constitution": 38,
    "speed": 17,
    "dexterity": 22
   },
   {
    "strength": 22,
    "spirit": 19,
    "constitution": 39,
    "speed": 18,
    "dexterity": 23
   },
   {
    "strength": 23,
    "spirit": 20,
    "constitution": 40,
    "speed": 19,
    "dexterity": 23
   },
   {
    "strength": 23,
    "spirit": 21,
    "constitution": 41,
    "speed": 20,
    "dexterity": 24
   },
   {
    "strength": 24,
    "spirit": 21,
    "constitution": 42,
    "speed": 20,
    "dexterity": 25
   },
   {
    "strength": 25,
    "spirit": 22,
    "constitution": 43,
    "speed": 21,
    "dexterity": 25
   },
   {
    "strength": 26,
    "spirit": 23,
    "constitution": 44,
    "speed": 22,
    "dexterity": 26
   },
   {
    "strength": 27,
    "spirit": 24,
    "constitution": 45,
    "speed": 22,
    "dexterity": 27
   },
   {
    "strength": 28,
    "spirit": 24,
    "constitution": 46,
    "speed": 23,
    "dexterity": 27
   },
   {
    "strength": 29,
    "spirit": 25,
    "constitution": 47,
    "speed": 24,
    "dexterity": 28
   },
   {
    "strength": 30,
    "spirit": 26,
    "constitution": 48,
    "speed": 24,
    "dexterity": 28
   },
   {
    "strength": 31,
    "spirit": 26,
    "constitution": 49,
    "speed": 25,
    "dexterity": 29
   },
   {
    "strength": 32,
    "spirit": 27,
    "constitution": 50,
    "speed": 26,
    "dexterity": 30
   },
   {
    "strength": 33,
    "spirit": 28,
    "constitution": 51,
    "speed": 26,
    "dexterity": 30
   },
   {
    "strength": 34,
    "spirit": 29,
    "constitution": 52,
    "speed": 27,
    "dexterity": 31
   },
   {
    "strength": 35,
    "spirit": 29,
    "constitution": 53,
    "speed": 28,
    "dexterity": 32
   },
   {
    "strength": 36,
    "spirit": 30,
    "constitution": 54,
    "speed": 28,
    "dexterity": 32
   },
   {
    "strength": 37,
    "spirit": 31,
    "constitution": 55,
    "speed": 29,
    "dexterity": 33
   },
   {
    "strength": 37,
    "spirit": 31,
    "constitution": 56,
    "speed": 30,
    "dexterity": 34
   },
   {
    "strength": 38,
    "spirit": 32,
    "constitution": 57,
    "speed": 31,
    "dexterity": 34
   },
   {
    "strength": 39,
    "spirit": 33,
    "constitution": 58,
    "speed": 31,
    "dexterity": 35
   },
   {
    "strength": 40,
    "spirit": 33,
    "constitution": 59,
    "speed": 32,
    "dexterity": 35
   },
   {
    "strength": 41,
    "spirit": 34,
    "constitution": 60,
    "speed": 33,
    "dexterity": 36
   },
   {
    "strength": 42,
    "spirit": 35,
    "constitution": 61,
    "speed": 33,
    "dexterity": 37
   },
   {
    "strength": 43,
    "spirit": 36,
    "constitution": 62,
    "speed": 34,
    "dexterity": 37
   },
   {
    "strength": 44,
    "spirit": 36,
    "constitution": 63,
    "speed": 35,
    "dexterity": 38
   },
   {
    "strength": 45,
    "spirit": 37,
    "constitution": 64,
    "speed": 35,
    "dexterity": 39
   },
   {
    "strength": 46,
    "spirit": 38,
    "constitution": 65,
    "speed": 36,
    "dexterity": 39
   },
   {
    "strength": 47,
    "spirit": 38,
    "constitution": 66,
    "speed": 37,
    "dexterity": 40
   },
   {
    "strength": 48,
    "spirit": 39,
    "constitution": 67,
    "speed": 37,
    "dexterity": 41
   },
   {
    "strength": 49,
    "spirit": 40,
    "constitution": 68,
    "speed": 38,
    "dexterity": 41
   },
   {
    "strength": 50,
    "spirit": 41,
    "constitution": 69,
    "speed": 39,
    "dexterity": 42
   },
   {
    "strength": 51,
    "spirit": 41,
    "constitution": 70,
    "speed": 39,
    "dexterity": 42
   },
   {
    "strength": 51,
    "spirit": 42,
    "constitution": 71,
    "speed": 40,
    "dexterity": 43
   },
   {
    "strength": 52,
    "spirit": 43,
    "constitution": 72,
    "speed": 41,
    "dexterity": 44
   },
   {
    "strength": 53,
    "spirit": 43,
    "constitution": 73,
    "speed": 42,
    "dexterity": 44
   },
   {
    "strength": 54,
    "spirit": 44,
    "constitution": 74,
    "speed": 42,
    "dexterity": 45
   },
   {
    "strength": 55,
    "spirit": 45,
    "constitution": 75,
    "speed": 43,
    "dexterity": 46
   },
   {
    "strength": 56,
    "spirit": 46,
    "constitution": 76,
    "speed": 44,
    "dexterity": 46
   },
   {
    "strength": 57,
    "spirit": 46,
    "constitution": 77,
    "speed": 44,
    "dexterity": 47
   },
   {
    "strength": 58,
    "spirit": 47,
    "constitution": 78,
    "speed": 45,
    "dexterity": 48
   },
   {
    "strength": 59,
    "spirit": 48,
    "constitution": 79,
    "speed": 46,
    "dexterity": 48
   },
   {
    "strength": 60,
    "spirit": 48,
    "constitution": 80,
    "speed": 46,
    "dexterity": 49
   },
   {
    "strength": 61,
    "spirit": 49,
    "constitution": 81,
    "speed": 47,
    "dexterity": 49
   },
   {
    "strength": 62,
    "spirit": 50,
    "constitution": 82,
    "speed": 48,
    "dexterity": 50
   },
   {
    "strength": 63,
    "spirit": 51,
    "constitution": 83,
    "speed": 48,
    "dexterity": 51
   },
   {
    "strength": 64,
    "spirit": 51,
    "constitution": 84,
    "speed": 49,
    "dexterity": 51
   },
   {
    "strength": 65,
    "spirit": 52,
    "constitution": 85,
    "speed": 50,
    "dexterity": 52
   },
   {
    "strength": 65,
    "spirit": 53,
    "constitution": 86,
    "speed": 51,
    "dexterity": 53
   },
   {
    "strength": 66,
    "spirit": 53,
    "constitution": 87,
    "speed": 51,
    "dexterity": 53
   },
   {
    "strength": 67,
    "spirit": 54,
    "constitution": 88,
    "speed": 52,
    "dexterity": 54
   },
   {
    "strength": 68,
    "spirit": 55,
    "constitution": 89,
    "speed": 53,
    "dexterity": 54
   },
   {
    "strength": 69,
    "spirit": 56,
    "constitution": 90,
    "speed": 53,
    "dexterity": 55
   },
   {
    "strength": 70,
    "spirit": 56,
    "constitution": 91,
    "speed": 54,
    "dexterity": 56
   },
   {
    "strength": 71,
    "spirit": 57,
    "constitution": 92,
    "speed": 55,
    "dexterity": 56
   },
   {
    "strength": 72,
    "spirit": 58,
    "constitution": 93,
    "speed": 55,
    "dexterity": 57
   },
   {
    "strength": 73,
    "spirit": 58,
    "constitution": 94,
    "speed": 56,
    "dexterity": 58
   },
   {
    "strength": 74,
    "spirit": 59,
    "constitution": 95,
    "speed": 57,
    "dexterity": 58
   },
   {
    "strength": 75,
    "spirit": 60,
    "constitution": 96,
    "speed": 57,
    "dexterity": 59
   },
   {
    "strength": 76,
    "spirit": 61,
    "constitution": 97,
    "speed": 58,
    "dexterity": 60
   },
   {
    "strength": 77,
    "spirit": 61,
    "constitution": 98,
    "speed": 59,
    "dexterity": 60
   },
   {
    "strength": 78,
    "spirit": 62,
    "constitution": 99,
    "speed": 59,
    "dexterity": 61
   },
   {
    "strength": 79,
    "spirit": 63,
    "constitution": 100,
    "speed": 60,
    "dexterity": 61
   },
   {
    "strength": 79,
    "spirit": 63,
    "constitution": 101,
    "speed": 61,
    "dexterity": 62
   },
   {
    "strength": 80,
    "spirit": 64,
    "constitution": 102,
    "speed": 62,
    "dexterity": 63
   },
   {
    "strength": 81,
    "spirit": 65,
    "constitution": 103,
    "speed": 62,
    "dexterity": 63
   },
   {
    "strength": 82,
    "spirit": 65,
    "constitution": 104,
    "speed": 63,
    "dexterity": 64
   },
   {
    "strength": 83,
    "spirit": 66,
    "constitution": 105,
    "speed": 64,
    "dexterity": 65
   },
   {
    "strength": 84,
    "spirit": 67,
    "constitution": 106,
    "speed": 64,
    "dexterity": 65
   },
   {
    "strength": 85,
    "spirit": 68,
    "constitution": 107,
    "speed": 65,
    "dexterity": 66
   },
   {
    "strength": 86,
    "spirit": 68,
    "constitution": 108,
    "speed": 66,
    "dexterity": 66
   },
   {
    "strength": 87,
    "spirit": 69,
    "constitution": 109,
    "speed": 66,
    "dexterity": 67
   },
   {
    "strength": 88,
    "spirit": 70,
    "constitution": 110,
    "speed": 67,
    "dexterity": 68
   },
   {
    "strength": 89,
    "spirit": 70,
    "constitution": 111,
    "speed": 68,
    "dexterity": 68
   },
   {
    "strength": 90,
    "spirit": 71,
    "constitution": 112,
    "speed": 68,
    "dexterity": 69
   },
   {
    "strength": 91,
    "spirit": 72,
    "constitution": 113,
    "speed": 69,
    "dexterity": 70
   },
   {
    "strength": 92,
    "spirit": 73,
    "constitution": 114,
    "speed": 70,
    "dexterity": 70
   },
   {
    "strength": 93,
    "spirit": 73,
    "constitution": 115,
    "speed": 70,
    "dexterity": 71
   },
   {
    "strength": 93,
    "spirit": 74,
    "constitution": 116,
    "speed": 71,
    "dexterity": 72
   },
   {
    "strength": 94,
    "spirit": 75,
    "constitution": 117,
    "speed": 72,
    "dexterity": 72
   },
   {
    "strength": 95,
    "spirit": 75,
    "constitution": 118,
    "speed": 73,
    "dexterity": 73
   },
   {
    "strength": 96,
    "spirit": 76,
    "constitution": 119,
    "speed": 73,
    "dexterity": 73
   },
   {
    "strength": 97,
    "spirit": 77,
    "constitution": 120,
    "speed": 74,
    "dexterity": 74
   },
   {
    "strength": 98,
    "spirit": 78,
    "constitution": 121,
    "speed": 75,
    "dexterity": 75
   },
   {
    "strength": 99,
    "spirit": 78,
    "constitution": 122,
    "speed": 75,
    "dexterity": 75
   },
   {
    "strength": 100,
    "spirit": 79,
    "constitution": 123,
    "speed": 76,
    "dexterity": 76
   }
  ]
 },
 "morwen": {
  "startLevel": 35,
  "byLevel": [
   {
    "strength": 36,
    "spirit": 31,
    "constitution": 40,
    "speed": 56,
    "dexterity": 86
   },
   {
    "strength": 37,
    "spirit": 32,
    "constitution": 41,
    "speed": 57,
    "dexterity": 86
   },
   {
    "strength": 38,
    "spirit": 32,
    "constitution": 41,
    "speed": 58,
    "dexterity": 86
   },
   {
    "strength": 39,
    "spirit": 33,
    "constitution": 42,
    "speed": 59,
    "dexterity": 86
   },
   {
    "strength": 40,
    "spirit": 34,
    "constitution": 42,
    "speed": 60,
    "dexterity": 86
   },
   {
    "strength": 41,
    "spirit": 35,
    "constitution": 43,
    "speed": 61,
    "dexterity": 86
   },
   {
    "strength": 42,
    "spirit": 35,
    "constitution": 43,
    "speed": 63,
    "dexterity": 86
   },
   {
    "strength": 43,
    "spirit": 36,
    "constitution": 44,
    "speed": 64,
    "dexterity": 86
   },
   {
    "strength": 44,
    "spirit": 37,
    "constitution": 44,
    "speed": 65,
    "dexterity": 86
   },
   {
    "strength": 45,
    "spirit": 37,
    "constitution": 45,
    "speed": 66,
    "dexterity": 87
   },
   {
    "strength": 46,
    "spirit": 38,
    "constitution": 46,
    "speed": 67,
    "dexterity": 87
   },
   {
    "strength": 47,
    "spirit": 39,
    "constitution": 46,
    "speed": 68,
    "dexterity": 87
   },
   {
    "strength": 48,
    "spirit": 39,
    "constitution": 47,
    "speed": 69,
    "dexterity": 87
   },
   {
    "strength": 49,
    "spirit": 40,
    "constitution": 47,
    "speed": 70,
    "dexterity": 87
   },
   {
    "strength": 50,
    "spirit": 41,
    "constitution": 48,
    "speed": 71,
    "dexterity": 87
   },
   {
    "strength": 51,
    "spirit": 42,
    "constitution": 48,
    "speed": 72,
    "dexterity": 87
   },
   {
    "strength": 52,
    "spirit": 42,
    "constitution": 49,
    "speed": 74,
    "dexterity": 87
   },
   {
    "strength": 53,
    "spirit": 43,
    "constitution": 50,
    "speed": 75,
    "dexterity": 87
   },
   {
    "strength": 54,
    "spirit": 44,
    "constitution": 50,
    "speed": 76,
    "dexterity": 87
   },
   {
    "strength": 55,
    "spirit": 44,
    "constitution": 51,
    "speed": 77,
    "dexterity": 87
   },
   {
    "strength": 56,
    "spirit": 45,
    "constitution": 51,
    "speed": 78,
    "dexterity": 87
   },
   {
    "strength": 57,
    "spirit": 46,
    "constitution": 52,
    "speed": 79,
    "dexterity": 87
   },
   {
    "strength": 58,
    "spirit": 46,
    "constitution": 52,
    "speed": 80,
    "dexterity": 87
   },
   {
    "strength": 59,
    "spirit": 47,
    "constitution": 53,
    "speed": 81,
    "dexterity": 87
   },
   {
    "strength": 60,
    "spirit": 48,
    "constitution": 54,
    "speed": 82,
    "dexterity": 88
   },
   {
    "strength": 61,
    "spirit": 49,
    "constitution": 54,
    "speed": 83,
    "dexterity": 88
   },
   {
    "strength": 62,
    "spirit": 49,
    "constitution": 55,
    "speed": 84,
    "dexterity": 88
   },
   {
    "strength": 63,
    "spirit": 50,
    "constitution": 55,
    "speed": 86,
    "dexterity": 88
   },
   {
    "strength": 64,
    "spirit": 51,
    "constitution": 56,
    "speed": 87,
    "dexterity": 88
   },
   {
    "strength": 65,
    "spirit": 51,
    "constitution": 56,
    "speed": 88,
    "dexterity": 88
   },
   {
    "strength": 66,
    "spirit": 52,
    "constitution": 57,
    "speed": 89,
    "dexterity": 88
   },
   {
    "strength": 67,
    "spirit": 53,
    "constitution": 57,
    "speed": 90,
    "dexterity": 88
   },
   {
    "strength": 68,
    "spirit": 54,
    "constitution": 58,
    "speed": 91,
    "dexterity": 88
   },
   {
    "strength": 69,
    "spirit": 54,
    "constitution": 59,
    "speed": 92,
    "dexterity": 88
   },
   {
    "strength": 70,
    "spirit": 55,
    "constitution": 59,
    "speed": 93,
    "dexterity": 88
   },
   {
    "strength": 71,
    "spirit": 56,
    "constitution": 60,
    "speed": 94,
    "dexterity": 88
   },
   {
    "strength": 72,
    "spirit": 56,
    "constitution": 60,
    "speed": 95,
    "dexterity": 88
   },
   {
    "strength": 73,
    "spirit": 57,
    "constitution": 61,
    "speed": 96,
    "dexterity": 88
   },
   {
    "strength": 74,
    "spirit": 58,
    "constitution": 61,
    "speed": 98,
    "dexterity": 88
   },
   {
    "strength": 75,
    "spirit": 58,
    "constitution": 62,
    "speed": 99,
    "dexterity": 88
   },
   {
    "strength": 76,
    "spirit": 59,
    "constitution": 62,
    "speed": 100,
    "dexterity": 88
   },
   {
    "strength": 77,
    "spirit": 60,
    "constitution": 63,
    "speed": 101,
    "dexterity": 89
   },
   {
    "strength": 78,
    "spirit": 61,
    "constitution": 64,
    "speed": 102,
    "dexterity": 89
   },
   {
    "strength": 79,
    "spirit": 61,
    "constitution": 64,
    "speed": 103,
    "dexterity": 89
   },
   {
    "strength": 80,
    "spirit": 62,
    "constitution": 65,
    "speed": 104,
    "dexterity": 89
   },
   {
    "strength": 81,
    "spirit": 63,
    "constitution": 65,
    "speed": 105,
    "dexterity": 89
   },
   {
    "strength": 82,
    "spirit": 63,
    "constitution": 66,
    "speed": 106,
    "dexterity": 89
   },
   {
    "strength": 83,
    "spirit": 64,
    "constitution": 66,
    "speed": 107,
    "dexterity": 89
   },
   {
    "strength": 84,
    "spirit": 65,
    "constitution": 67,
    "speed": 108,
    "dexterity": 89
   },
   {
    "strength": 85,
    "spirit": 65,
    "constitution": 68,
    "speed": 110,
    "dexterity": 89
   },
   {
    "strength": 86,
    "spirit": 66,
    "constitution": 68,
    "speed": 111,
    "dexterity": 89
   },
   {
    "strength": 87,
    "spirit": 67,
    "constitution": 69,
    "speed": 112,
    "dexterity": 89
   },
   {
    "strength": 88,
    "spirit": 68,
    "constitution": 69,
    "speed": 113,
    "dexterity": 89
   },
   {
    "strength": 89,
    "spirit": 68,
    "constitution": 70,
    "speed": 114,
    "dexterity": 89
   },
   {
    "strength": 90,
    "spirit": 69,
    "constitution": 70,
    "speed": 115,
    "dexterity": 89
   },
   {
    "strength": 91,
    "spirit": 70,
    "constitution": 71,
    "speed": 116,
    "dexterity": 89
   },
   {
    "strength": 92,
    "spirit": 70,
    "constitution": 72,
    "speed": 117,
    "dexterity": 90
   },
   {
    "strength": 93,
    "spirit": 71,
    "constitution": 72,
    "speed": 118,
    "dexterity": 90
   },
   {
    "strength": 94,
    "spirit": 72,
    "constitution": 73,
    "speed": 119,
    "dexterity": 90
   },
   {
    "strength": 95,
    "spirit": 72,
    "constitution": 73,
    "speed": 121,
    "dexterity": 90
   },
   {
    "strength": 96,
    "spirit": 73,
    "constitution": 74,
    "speed": 122,
    "dexterity": 90
   },
   {
    "strength": 97,
    "spirit": 74,
    "constitution": 74,
    "speed": 123,
    "dexterity": 90
   },
   {
    "strength": 98,
    "spirit": 75,
    "constitution": 75,
    "speed": 124,
    "dexterity": 90
   },
   {
    "strength": 99,
    "spirit": 75,
    "constitution": 75,
    "speed": 125,
    "dexterity": 90
   },
   {
    "strength": 100,
    "spirit": 76,
    "constitution": 76,
    "speed": 126,
    "dexterity": 90
   }
  ]
 },
 "eaoden": {
  "startLevel": 50,
  "byLevel": [
   {
    "strength": 71,
    "spirit": 71,
    "constitution": 56,
    "speed": 47,
    "dexterity": 51
   },
   {
    "strength": 72,
    "spirit": 71,
    "constitution": 57,
    "speed": 48,
    "dexterity": 52
   },
   {
    "strength": 73,
    "spirit": 71,
    "constitution": 57,
    "speed": 48,
    "dexterity": 52
   },
   {
    "strength": 74,
    "spirit": 72,
    "constitution": 58,
    "speed": 49,
    "dexterity": 53
   },
   {
    "strength": 75,
    "spirit": 72,
    "constitution": 58,
    "speed": 49,
    "dexterity": 53
   },
   {
    "strength": 75,
    "spirit": 72,
    "constitution": 59,
    "speed": 50,
    "dexterity": 54
   },
   {
    "strength": 76,
    "spirit": 72,
    "constitution": 59,
    "speed": 51,
    "dexterity": 54
   },
   {
    "strength": 77,
    "spirit": 73,
    "constitution": 60,
    "speed": 51,
    "dexterity": 55
   },
   {
    "strength": 78,
    "spirit": 73,
    "constitution": 60,
    "speed": 52,
    "dexterity": 55
   },
   {
    "strength": 79,
    "spirit": 73,
    "constitution": 61,
    "speed": 52,
    "dexterity": 56
   },
   {
    "strength": 80,
    "spirit": 73,
    "constitution": 61,
    "speed": 53,
    "dexterity": 56
   },
   {
    "strength": 81,
    "spirit": 73,
    "constitution": 62,
    "speed": 54,
    "dexterity": 57
   },
   {
    "strength": 82,
    "spirit": 74,
    "constitution": 62,
    "speed": 54,
    "dexterity": 57
   },
   {
    "strength": 82,
    "spirit": 74,
    "constitution": 63,
    "speed": 55,
    "dexterity": 58
   },
   {
    "strength": 83,
    "spirit": 74,
    "constitution": 63,
    "speed": 55,
    "dexterity": 58
   },
   {
    "strength": 84,
    "spirit": 74,
    "constitution": 64,
    "speed": 56,
    "dexterity": 59
   },
   {
    "strength": 85,
    "spirit": 75,
    "constitution": 64,
    "speed": 56,
    "dexterity": 59
   },
   {
    "strength": 86,
    "spirit": 75,
    "constitution": 65,
    "speed": 57,
    "dexterity": 60
   },
   {
    "strength": 87,
    "spirit": 75,
    "constitution": 65,
    "speed": 58,
    "dexterity": 60
   },
   {
    "strength": 88,
    "spirit": 75,
    "constitution": 66,
    "speed": 58,
    "dexterity": 61
   },
   {
    "strength": 89,
    "spirit": 75,
    "constitution": 66,
    "speed": 59,
    "dexterity": 61
   },
   {
    "strength": 89,
    "spirit": 76,
    "constitution": 67,
    "speed": 59,
    "dexterity": 62
   },
   {
    "strength": 90,
    "spirit": 76,
    "constitution": 67,
    "speed": 60,
    "dexterity": 62
   },
   {
    "strength": 91,
    "spirit": 76,
    "constitution": 68,
    "speed": 61,
    "dexterity": 63
   },
   {
    "strength": 92,
    "spirit": 76,
    "constitution": 68,
    "speed": 61,
    "dexterity": 63
   },
   {
    "strength": 93,
    "spirit": 77,
    "constitution": 69,
    "speed": 62,
    "dexterity": 64
   },
   {
    "strength": 94,
    "spirit": 77,
    "constitution": 69,
    "speed": 62,
    "dexterity": 64
   },
   {
    "strength": 95,
    "spirit": 77,
    "constitution": 70,
    "speed": 63,
    "dexterity": 65
   },
   {
    "strength": 96,
    "spirit": 77,
    "constitution": 70,
    "speed": 64,
    "dexterity": 65
   },
   {
    "strength": 96,
    "spirit": 78,
    "constitution": 71,
    "speed": 64,
    "dexterity": 66
   },
   {
    "strength": 97,
    "spirit": 78,
    "constitution": 71,
    "speed": 65,
    "dexterity": 66
   },
   {
    "strength": 98,
    "spirit": 78,
    "constitution": 72,
    "speed": 65,
    "dexterity": 67
   },
   {
    "strength": 99,
    "spirit": 78,
    "constitution": 72,
    "speed": 66,
    "dexterity": 67
   },
   {
    "strength": 100,
    "spirit": 78,
    "constitution": 73,
    "speed": 67,
    "dexterity": 68
   },
   {
    "strength": 101,
    "spirit": 79,
    "constitution": 73,
    "speed": 67,
    "dexterity": 68
   },
   {
    "strength": 102,
    "spirit": 79,
    "constitution": 74,
    "speed": 68,
    "dexterity": 69
   },
   {
    "strength": 103,
    "spirit": 79,
    "constitution": 74,
    "speed": 68,
    "dexterity": 69
   },
   {
    "strength": 103,
    "spirit": 79,
    "constitution": 75,
    "speed": 69,
    "dexterity": 70
   },
   {
    "strength": 104,
    "spirit": 80,
    "constitution": 75,
    "speed": 69,
    "dexterity": 70
   },
   {
    "strength": 105,
    "spirit": 80,
    "constitution": 76,
    "speed": 70,
    "dexterity": 71
   },
   {
    "strength": 106,
    "spirit": 80,
    "constitution": 76,
    "speed": 71,
    "dexterity": 71
   },
   {
    "strength": 107,
    "spirit": 80,
    "constitution": 77,
    "speed": 71,
    "dexterity": 72
   },
   {
    "strength": 108,
    "spirit": 80,
    "constitution": 77,
    "speed": 72,
    "dexterity": 72
   },
   {
    "strength": 109,
    "spirit": 81,
    "constitution": 78,
    "speed": 72,
    "dexterity": 73
   },
   {
    "strength": 110,
    "spirit": 81,
    "constitution": 78,
    "speed": 73,
    "dexterity": 73
   },
   {
    "strength": 110,
    "spirit": 81,
    "constitution": 79,
    "speed": 74,
    "dexterity": 74
   },
   {
    "strength": 111,
    "spirit": 81,
    "constitution": 79,
    "speed": 74,
    "dexterity": 74
   },
   {
    "strength": 112,
    "spirit": 82,
    "constitution": 80,
    "speed": 75,
    "dexterity": 75
   },
   {
    "strength": 113,
    "spirit": 82,
    "constitution": 80,
    "speed": 75,
    "dexterity": 75
   },
   {
    "strength": 114,
    "spirit": 82,
    "constitution": 81,
    "speed": 76,
    "dexterity": 76
   }
  ]
 }
};
