"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
	var tag = "EXPIRES";
	var invalidTimeError = "Invalid date!";
	var timeZoneError = "You must define a timezone!";
	var expiredError = "Expires date!";
	var currentError = null;
	var expiredAsMilliseconds = 0;

	function checkCommentValidity(node) {
    var value = node.value.trim();
    if (value.length === 0) {
      return;
    } else if (value.split(": ")[0] !== tag) {
      return;
    } else {
      return true;
    }
	}

	function getExpireDateValidity(node) {
    var value = node.value.trim();
    var expiredDate = value.split(": ")[1]
    var isValidDate = /(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}?(:\d{1,2})?(.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/.exec(expiredDate);

    if (isValidDate === null) {
      currentError = invalidTimeError;
      return false;
    } else if (isValidDate[2] !== undefined && isValidDate[5] === undefined) {
      currentError = timeZoneError;
      return false;
    } else {
      expiredAsMilliseconds = Date.parse(expiredDate);
      if (isNaN(expiredAsMilliseconds)) {
        currentError = invalidTimeError;
        return false;
      } else {
        return true;
      }
    }
	}

  function displayError(node, reason) {
    context.report(node, reason);
  }

  return {
    "LineComment": function(node) {
      if (checkCommentValidity(node) && getExpireDateValidity(node)) {
        var currentTime = Date.now();
        if (expiredAsMilliseconds <= currentTime) {
          displayError(node, expiredError);
        }
      } else if (currentError !== null) {
        displayError(node, currentError);
      }
    }
  };
};

module.exports.schema = [];
