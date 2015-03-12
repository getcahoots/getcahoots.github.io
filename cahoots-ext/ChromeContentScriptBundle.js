(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.cahoots||(g.cahoots = {}));g=(g.chrome||(g.chrome = {}));g.content = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var chromeContentScript = function() {

    var handleFullDetails = function(lookupId, dataCallback) {
        chrome.runtime.sendMessage({ message: "getFullDetails", cahootsID: lookupId}, function(response){
            dataCallback(response)
        });
    }

    var handleAuthorHints = function(dataCallback) {
        chrome.runtime.sendMessage({ message: "getAuthorHints"}, function(response){
            dataCallback(response)
        });
    }

    var CahootsRunner = cahoots.content.CahootsRunner;
    var CahootsUiFormatter = cahoots.content.CahootsUiFormatter;

    var uiFormatter = new CahootsUiFormatter();
    var cahootsRunner = new CahootsRunner(handleFullDetails,handleAuthorHints, uiFormatter);
    cahootsRunner.run();
};

module.exports = chromeContentScript
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9qcy9jaHJvbWUvQ2hyb21lQ29udGVudFNjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuXG52YXIgY2hyb21lQ29udGVudFNjcmlwdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGhhbmRsZUZ1bGxEZXRhaWxzID0gZnVuY3Rpb24obG9va3VwSWQsIGRhdGFDYWxsYmFjaykge1xuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IG1lc3NhZ2U6IFwiZ2V0RnVsbERldGFpbHNcIiwgY2Fob290c0lEOiBsb29rdXBJZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGRhdGFDYWxsYmFjayhyZXNwb25zZSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGhhbmRsZUF1dGhvckhpbnRzID0gZnVuY3Rpb24oZGF0YUNhbGxiYWNrKSB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgbWVzc2FnZTogXCJnZXRBdXRob3JIaW50c1wifSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgZGF0YUNhbGxiYWNrKHJlc3BvbnNlKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgQ2Fob290c1J1bm5lciA9IGNhaG9vdHMuY29udGVudC5DYWhvb3RzUnVubmVyO1xuICAgIHZhciBDYWhvb3RzVWlGb3JtYXR0ZXIgPSBjYWhvb3RzLmNvbnRlbnQuQ2Fob290c1VpRm9ybWF0dGVyO1xuXG4gICAgdmFyIHVpRm9ybWF0dGVyID0gbmV3IENhaG9vdHNVaUZvcm1hdHRlcigpO1xuICAgIHZhciBjYWhvb3RzUnVubmVyID0gbmV3IENhaG9vdHNSdW5uZXIoaGFuZGxlRnVsbERldGFpbHMsaGFuZGxlQXV0aG9ySGludHMsIHVpRm9ybWF0dGVyKTtcbiAgICBjYWhvb3RzUnVubmVyLnJ1bigpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjaHJvbWVDb250ZW50U2NyaXB0Il19
