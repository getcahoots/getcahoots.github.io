(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.cahoots || (g.cahoots = {})).extension = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var CahootsStorage = function(storageObject) {
    if(typeof storageObject == "undefined") {
        throw new Error('no storage element passed')
    }

    if(!typeof storageObject == "object") {
        throw new Error('invalid storage element passed')
    }

    this.storage = storageObject;
    this.expiryDelta = 60*60*24;
}


CahootsStorage.prototype._setPersons = function (data) {
    this.storage.persons = JSON.stringify(data);
}

CahootsStorage.prototype._setOrganizations = function (data) {
    this.storage.organizations = JSON.stringify(data);
}

CahootsStorage.prototype._setUpdated = function() {
    this.storage.lastUpdated = JSON.stringify(new Date().getMilliseconds / 1000)
}

CahootsStorage.prototype.setData = function (data) {
    //var personsBefore = this.getPersons();
    //var organizationsBefore = this.getOrganizations();
    this._setPersons(data.persons)
    this._setOrganizations(data.organizations)
    this._setUpdated();
}

CahootsStorage.prototype.isExpired = function() {
    try {
        var currentTimestamp = new Date().getMilliseconds() / 1000;
        var lastUpdate = JSON.parse(this.storage.lastUpdated);

        if (currentTimestamp - lastUpdate > this.expiryDelta) {
            return true;
        }
        return false;
    } catch(ex) {
        ;
    }
    return true;
}

CahootsStorage.prototype.getPersons = function() {
    return JSON.parse(this.storage.persons);
}

CahootsStorage.prototype.getOrganizations = function() {
    return JSON.parse(this.storage.organizations);
}


module.exports=CahootsStorage
},{}],2:[function(require,module,exports){
'use strict';

function QueryService(queryStorage) {
    this.queryStorage = queryStorage;
}

QueryService.prototype.findAuthorHints = function() {
    var persons = this.queryStorage.getPersons();
    var authorMap = {};
    for(var i in persons) {
        authorMap[(persons[i].name)] = "CahootsID_" + persons[i].id;
    }
    return authorMap;
}

QueryService.prototype.findAuthorDetails = function(cahootsID) {
    var person = this.queryStorage.getPersons().filter(function(elem){
        return (elem.id==cahootsID);
    })[0]

    var orgas = person.cahoots;
    var orgasNew = [];
    for(var o in orgas) {
        var orga = this.findOrganizationByCahootsId(orgas[o].organization);
        var orgaDto = {
            id: orga.id,
            info: orga.info,
            name: orga.name,
            source: orgas[o].source,
            role: orgas[o].role,
            verified: orgas[o].verified
        }
        orgasNew.push(orgaDto)
    }

    return {
        name: person.name,
        info: person.info,
        id:person.id,
        cahoots: orgasNew
    };
}

QueryService.prototype.findOrganizationByCahootsId = function(cahootsID) {
    var organization = this.queryStorage.getOrganizations().filter(function(e){return e.id==cahootsID});
    return organization[0];
}

module.exports =  QueryService
},{}],3:[function(require,module,exports){
'use strict'

var StorageUpdater = function(cahootsStorageInstance, url) {
    this.debug = false;

    this.storage = cahootsStorageInstance;
    this.url = url; // 'https://api.cahoots.pw/v1'
}

// TODO: send custom http header
StorageUpdater.prototype.update = function(xhr1, xhr2, callback) {
    var that = this;
    // TODO better error handling
    var debug = this.debug;

    var url = this.url; //location relative to current webpage

    xhr1.open('GET', url+'/persons', true); // async


    xhr1.onload = function(xmlEvent, two, three){
        var personValues= JSON.parse(xhr1.response);

        xhr2.open('GET', url+'/organizations', true); // async
        xhr2.onload = function(xmlEvent){
            var orgaValues = JSON.parse(xhr2.response);

            if(debug) console.log("loaded through.")
            //that.setPersons(personValues)
            //that.setOrganizations(orgaValues)
            that.storage.setData({persons: personValues, organizations: orgaValues})
            if(debug) console.log("loaded through -> callback")
            callback(personValues,orgaValues)
        }
        xhr2.send();
    };

    xhr1.send();

}

StorageUpdater.prototype.checkUpdate = function(xhr1, xhr2, callback) {
    if(this.storage.isExpired()) {
        this.update(xhr1, xhr2, callback)
    }
}


module.exports=StorageUpdater
},{}],4:[function(require,module,exports){
'use strict'

var QueryService= require('./QueryService');
var CahootsStorage = require('./CahootsStorage');
var StorageUpdater = require('./StorageUpdater');






module.exports.QueryService= QueryService
module.exports.CahootsStorage=CahootsStorage
module.exports.StorageUpdater= StorageUpdater
},{"./CahootsStorage":1,"./QueryService":2,"./StorageUpdater":3}]},{},[1,2,3,4])(4)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9qcy9hcHAvZXh0ZW5zaW9uL0NhaG9vdHNTdG9yYWdlLmpzIiwic3JjL21haW4vanMvYXBwL2V4dGVuc2lvbi9RdWVyeVNlcnZpY2UuanMiLCJzcmMvbWFpbi9qcy9hcHAvZXh0ZW5zaW9uL1N0b3JhZ2VVcGRhdGVyLmpzIiwic3JjL21haW4vanMvYXBwL2V4dGVuc2lvbi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBDYWhvb3RzU3RvcmFnZSA9IGZ1bmN0aW9uKHN0b3JhZ2VPYmplY3QpIHtcbiAgICBpZih0eXBlb2Ygc3RvcmFnZU9iamVjdCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gc3RvcmFnZSBlbGVtZW50IHBhc3NlZCcpXG4gICAgfVxuXG4gICAgaWYoIXR5cGVvZiBzdG9yYWdlT2JqZWN0ID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHN0b3JhZ2UgZWxlbWVudCBwYXNzZWQnKVxuICAgIH1cblxuICAgIHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2VPYmplY3Q7XG4gICAgdGhpcy5leHBpcnlEZWx0YSA9IDYwKjYwKjI0O1xufVxuXG5cbkNhaG9vdHNTdG9yYWdlLnByb3RvdHlwZS5fc2V0UGVyc29ucyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5zdG9yYWdlLnBlcnNvbnMgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbn1cblxuQ2Fob290c1N0b3JhZ2UucHJvdG90eXBlLl9zZXRPcmdhbml6YXRpb25zID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLnN0b3JhZ2Uub3JnYW5pemF0aW9ucyA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xufVxuXG5DYWhvb3RzU3RvcmFnZS5wcm90b3R5cGUuX3NldFVwZGF0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0b3JhZ2UubGFzdFVwZGF0ZWQgPSBKU09OLnN0cmluZ2lmeShuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcyAvIDEwMDApXG59XG5cbkNhaG9vdHNTdG9yYWdlLnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAvL3ZhciBwZXJzb25zQmVmb3JlID0gdGhpcy5nZXRQZXJzb25zKCk7XG4gICAgLy92YXIgb3JnYW5pemF0aW9uc0JlZm9yZSA9IHRoaXMuZ2V0T3JnYW5pemF0aW9ucygpO1xuICAgIHRoaXMuX3NldFBlcnNvbnMoZGF0YS5wZXJzb25zKVxuICAgIHRoaXMuX3NldE9yZ2FuaXphdGlvbnMoZGF0YS5vcmdhbml6YXRpb25zKVxuICAgIHRoaXMuX3NldFVwZGF0ZWQoKTtcbn1cblxuQ2Fob290c1N0b3JhZ2UucHJvdG90eXBlLmlzRXhwaXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICAgIHZhciBjdXJyZW50VGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDA7XG4gICAgICAgIHZhciBsYXN0VXBkYXRlID0gSlNPTi5wYXJzZSh0aGlzLnN0b3JhZ2UubGFzdFVwZGF0ZWQpO1xuXG4gICAgICAgIGlmIChjdXJyZW50VGltZXN0YW1wIC0gbGFzdFVwZGF0ZSA+IHRoaXMuZXhwaXJ5RGVsdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGNhdGNoKGV4KSB7XG4gICAgICAgIDtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbkNhaG9vdHNTdG9yYWdlLnByb3RvdHlwZS5nZXRQZXJzb25zID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5zdG9yYWdlLnBlcnNvbnMpO1xufVxuXG5DYWhvb3RzU3RvcmFnZS5wcm90b3R5cGUuZ2V0T3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuc3RvcmFnZS5vcmdhbml6YXRpb25zKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cz1DYWhvb3RzU3RvcmFnZSIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gUXVlcnlTZXJ2aWNlKHF1ZXJ5U3RvcmFnZSkge1xuICAgIHRoaXMucXVlcnlTdG9yYWdlID0gcXVlcnlTdG9yYWdlO1xufVxuXG5RdWVyeVNlcnZpY2UucHJvdG90eXBlLmZpbmRBdXRob3JIaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwZXJzb25zID0gdGhpcy5xdWVyeVN0b3JhZ2UuZ2V0UGVyc29ucygpO1xuICAgIHZhciBhdXRob3JNYXAgPSB7fTtcbiAgICBmb3IodmFyIGkgaW4gcGVyc29ucykge1xuICAgICAgICBhdXRob3JNYXBbKHBlcnNvbnNbaV0ubmFtZSldID0gXCJDYWhvb3RzSURfXCIgKyBwZXJzb25zW2ldLmlkO1xuICAgIH1cbiAgICByZXR1cm4gYXV0aG9yTWFwO1xufVxuXG5RdWVyeVNlcnZpY2UucHJvdG90eXBlLmZpbmRBdXRob3JEZXRhaWxzID0gZnVuY3Rpb24oY2Fob290c0lEKSB7XG4gICAgdmFyIHBlcnNvbiA9IHRoaXMucXVlcnlTdG9yYWdlLmdldFBlcnNvbnMoKS5maWx0ZXIoZnVuY3Rpb24oZWxlbSl7XG4gICAgICAgIHJldHVybiAoZWxlbS5pZD09Y2Fob290c0lEKTtcbiAgICB9KVswXVxuXG4gICAgdmFyIG9yZ2FzID0gcGVyc29uLmNhaG9vdHM7XG4gICAgdmFyIG9yZ2FzTmV3ID0gW107XG4gICAgZm9yKHZhciBvIGluIG9yZ2FzKSB7XG4gICAgICAgIHZhciBvcmdhID0gdGhpcy5maW5kT3JnYW5pemF0aW9uQnlDYWhvb3RzSWQob3JnYXNbb10ub3JnYW5pemF0aW9uKTtcbiAgICAgICAgdmFyIG9yZ2FEdG8gPSB7XG4gICAgICAgICAgICBpZDogb3JnYS5pZCxcbiAgICAgICAgICAgIGluZm86IG9yZ2EuaW5mbyxcbiAgICAgICAgICAgIG5hbWU6IG9yZ2EubmFtZSxcbiAgICAgICAgICAgIHNvdXJjZTogb3JnYXNbb10uc291cmNlLFxuICAgICAgICAgICAgcm9sZTogb3JnYXNbb10ucm9sZSxcbiAgICAgICAgICAgIHZlcmlmaWVkOiBvcmdhc1tvXS52ZXJpZmllZFxuICAgICAgICB9XG4gICAgICAgIG9yZ2FzTmV3LnB1c2gob3JnYUR0bylcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBwZXJzb24ubmFtZSxcbiAgICAgICAgaW5mbzogcGVyc29uLmluZm8sXG4gICAgICAgIGlkOnBlcnNvbi5pZCxcbiAgICAgICAgY2Fob290czogb3JnYXNOZXdcbiAgICB9O1xufVxuXG5RdWVyeVNlcnZpY2UucHJvdG90eXBlLmZpbmRPcmdhbml6YXRpb25CeUNhaG9vdHNJZCA9IGZ1bmN0aW9uKGNhaG9vdHNJRCkge1xuICAgIHZhciBvcmdhbml6YXRpb24gPSB0aGlzLnF1ZXJ5U3RvcmFnZS5nZXRPcmdhbml6YXRpb25zKCkuZmlsdGVyKGZ1bmN0aW9uKGUpe3JldHVybiBlLmlkPT1jYWhvb3RzSUR9KTtcbiAgICByZXR1cm4gb3JnYW5pemF0aW9uWzBdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9ICBRdWVyeVNlcnZpY2UiLCIndXNlIHN0cmljdCdcblxudmFyIFN0b3JhZ2VVcGRhdGVyID0gZnVuY3Rpb24oY2Fob290c1N0b3JhZ2VJbnN0YW5jZSwgdXJsKSB7XG4gICAgdGhpcy5kZWJ1ZyA9IGZhbHNlO1xuXG4gICAgdGhpcy5zdG9yYWdlID0gY2Fob290c1N0b3JhZ2VJbnN0YW5jZTtcbiAgICB0aGlzLnVybCA9IHVybDsgLy8gJ2h0dHBzOi8vYXBpLmNhaG9vdHMucHcvdjEnXG59XG5cbi8vIFRPRE86IHNlbmQgY3VzdG9tIGh0dHAgaGVhZGVyXG5TdG9yYWdlVXBkYXRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oeGhyMSwgeGhyMiwgY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgLy8gVE9ETyBiZXR0ZXIgZXJyb3IgaGFuZGxpbmdcbiAgICB2YXIgZGVidWcgPSB0aGlzLmRlYnVnO1xuXG4gICAgdmFyIHVybCA9IHRoaXMudXJsOyAvL2xvY2F0aW9uIHJlbGF0aXZlIHRvIGN1cnJlbnQgd2VicGFnZVxuXG4gICAgeGhyMS5vcGVuKCdHRVQnLCB1cmwrJy9wZXJzb25zJywgdHJ1ZSk7IC8vIGFzeW5jXG5cblxuICAgIHhocjEub25sb2FkID0gZnVuY3Rpb24oeG1sRXZlbnQsIHR3bywgdGhyZWUpe1xuICAgICAgICB2YXIgcGVyc29uVmFsdWVzPSBKU09OLnBhcnNlKHhocjEucmVzcG9uc2UpO1xuXG4gICAgICAgIHhocjIub3BlbignR0VUJywgdXJsKycvb3JnYW5pemF0aW9ucycsIHRydWUpOyAvLyBhc3luY1xuICAgICAgICB4aHIyLm9ubG9hZCA9IGZ1bmN0aW9uKHhtbEV2ZW50KXtcbiAgICAgICAgICAgIHZhciBvcmdhVmFsdWVzID0gSlNPTi5wYXJzZSh4aHIyLnJlc3BvbnNlKTtcblxuICAgICAgICAgICAgaWYoZGVidWcpIGNvbnNvbGUubG9nKFwibG9hZGVkIHRocm91Z2guXCIpXG4gICAgICAgICAgICAvL3RoYXQuc2V0UGVyc29ucyhwZXJzb25WYWx1ZXMpXG4gICAgICAgICAgICAvL3RoYXQuc2V0T3JnYW5pemF0aW9ucyhvcmdhVmFsdWVzKVxuICAgICAgICAgICAgdGhhdC5zdG9yYWdlLnNldERhdGEoe3BlcnNvbnM6IHBlcnNvblZhbHVlcywgb3JnYW5pemF0aW9uczogb3JnYVZhbHVlc30pXG4gICAgICAgICAgICBpZihkZWJ1ZykgY29uc29sZS5sb2coXCJsb2FkZWQgdGhyb3VnaCAtPiBjYWxsYmFja1wiKVxuICAgICAgICAgICAgY2FsbGJhY2socGVyc29uVmFsdWVzLG9yZ2FWYWx1ZXMpXG4gICAgICAgIH1cbiAgICAgICAgeGhyMi5zZW5kKCk7XG4gICAgfTtcblxuICAgIHhocjEuc2VuZCgpO1xuXG59XG5cblN0b3JhZ2VVcGRhdGVyLnByb3RvdHlwZS5jaGVja1VwZGF0ZSA9IGZ1bmN0aW9uKHhocjEsIHhocjIsIGNhbGxiYWNrKSB7XG4gICAgaWYodGhpcy5zdG9yYWdlLmlzRXhwaXJlZCgpKcKge1xuICAgICAgICB0aGlzLnVwZGF0ZSh4aHIxLCB4aHIyLCBjYWxsYmFjaylcbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHM9U3RvcmFnZVVwZGF0ZXIiLCIndXNlIHN0cmljdCdcblxudmFyIFF1ZXJ5U2VydmljZT0gcmVxdWlyZSgnLi9RdWVyeVNlcnZpY2UnKTtcbnZhciBDYWhvb3RzU3RvcmFnZSA9IHJlcXVpcmUoJy4vQ2Fob290c1N0b3JhZ2UnKTtcbnZhciBTdG9yYWdlVXBkYXRlciA9IHJlcXVpcmUoJy4vU3RvcmFnZVVwZGF0ZXInKTtcblxuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzLlF1ZXJ5U2VydmljZT0gUXVlcnlTZXJ2aWNlXG5tb2R1bGUuZXhwb3J0cy5DYWhvb3RzU3RvcmFnZT1DYWhvb3RzU3RvcmFnZVxubW9kdWxlLmV4cG9ydHMuU3RvcmFnZVVwZGF0ZXI9IFN0b3JhZ2VVcGRhdGVyIl19
