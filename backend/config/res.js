'use strict';

exports.ok = function(message, values, res) {
  var data = values;
  res.statusMessage= message
  res.status(200).json(data);
  res.end();
};

exports.bad = function(message, values, res) {
    var data = values;
    res.statusMessage= message
    res.status(403).json(data);
    res.end();
  };

exports.unauthorized = function(message, values, res) {
  var data = values;
  res.statusMessage= message
  res.status(401).json(data);
  res.end();
};