'use strict'

const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    1: { type: Boolean, default: false },
    2: { type: Boolean, default: false },
    3: { type: Boolean, default: false },
    4: { type: Boolean, default: false },
    5: { type: Boolean, default: false },
    6: { type: Boolean, default: false },
    7: { type: Boolean, default: false },
    8: { type: Boolean, default: false },
    9: { type: Boolean, default: false },
    10: { type: Boolean, default: false },
    11: { type: Boolean, default: false },
    12: { type: Boolean, default: false },
    13: { type: Boolean, default: false },
    14: { type: Boolean, default: false },
    15: { type: Boolean, default: false },
    16: { type: Boolean, default: false },
    17: { type: Boolean, default: false },
    18: { type: Boolean, default: false },
    19: { type: Boolean, default: false },
    20: { type: Boolean, default: false },
    21: { type: Boolean, default: false },
    22: { type: Boolean, default: false },
    23: { type: Boolean, default: false },
    24: { type: Boolean, default: false },
    25: { type: Boolean, default: false },
    26: { type: Boolean, default: false },
    27: { type: Boolean, default: false },
    28: { type: Boolean, default: false },
    29: { type: Boolean, default: false },
    30: { type: Boolean, default: false },
    31: { type: Boolean, default: false },
    32: { type: Boolean, default: false },
    33: { type: Boolean, default: false },
    34: { type: Boolean, default: false },
    35: { type: Boolean, default: false },
    36: { type: Boolean, default: false },
    37: { type: Boolean, default: false },
    38: { type: Boolean, default: false },
    39: { type: Boolean, default: false },
    40: { type: Boolean, default: false },
    41: { type: Boolean, default: false },
    42: { type: Boolean, default: false }
})

module.exports = mongoose.model('Seat', seatSchema)