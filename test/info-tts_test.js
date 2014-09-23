/*global describe,it*/
'use strict';
var assert = require('assert'),
  tttinfoAnnouncer = require('../lib/info-tts.js');

describe('tttinfo-announcer node module.', function() {
  it('must be awesome', function() {
    assert( tttinfoAnnouncer.awesome(), 'awesome');
  });
});
