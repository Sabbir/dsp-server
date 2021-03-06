/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
'use strict';
/**
 * The Package model
 *
 * @author      TSCCODER
 * @version     1.0
 */

const mongoose = require('../datasource').getMongoose();
const _ = require('lodash');
const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
    // provider location, must be duplicated for fast queering with $near keyword
  location: {
    type: [{
      coordinates: { type: [Number], required: true, index: '2dsphere' },
      line1: { type: String, required: true },
      line2: { type: String, required: false },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      primary: { type: Boolean, required: true },
    }],
    required: true,
  },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  shortDescription: { type: String, required: true },
  catalogName: { type: String, required: true },
  price: { type: Number, required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },

  imageUrl: String,
  thumbnailUrl: String,

  sponsored: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  promoted: { type: Boolean, default: false },
    // discount in percent
  discount: Number,

    // sum of rating of all packages
  rating: {
    type: {
            // number of votes
      count: { type: Number, default: 0 },
            // sum of all votes
      sum: { type: Number, default: 0 },
            // sum / count
      avg: { type: Number, default: 0 },
    },
    required: true,
  },
});

PackageSchema.plugin(timestamps);

if (!PackageSchema.options.toObject) {
  PackageSchema.options.toObject = {};
}

/**
 * Transform the given document to be sent to client
 *
 * @param  {Object}   doc         the document to transform
 * @param  {Object}   ret         the already converted object
 * @param  {Object}   options     the transform options
 */
PackageSchema.options.toObject.transform = function (doc, ret, options) { // eslint-disable-line no-unused-vars
  const sanitized = _.omit(ret, '__v', '_id', 'provider', 'createdAt', 'updatedAt');
  sanitized.location = _.map(sanitized.location, l => _.omit(l, '_id'));
  sanitized.id = doc._id;
  return sanitized;
};


module.exports = {
  PackageSchema,
};
