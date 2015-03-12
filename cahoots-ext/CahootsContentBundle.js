(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.cahoots || (g.cahoots = {})).content = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function CahootsRunner( handleFullDetails, handleAuthorHints, uiFormatter) {
    this.handleAuthorHints = handleAuthorHints;
    this.handleFullDetails = handleFullDetails;
    this.uiFormatter = uiFormatter;
    this.debug = false;
}

CahootsRunner.prototype.findMatchingKeys = function(authorHints) {
    if(this.debug) {
        console.log("entering findMatchingKeys with authorHints:")
        console.log(authorHints)
    }

    var foundKeys = [];
    for (var key in authorHints) {
        if (jQuery('form:contains("' + key + '")').length > 0) {
            break;
        }
        if (jQuery('body:contains("' + key + '")').length <= 0) {
            continue;
        }
        foundKeys.push(key);
    }
    return foundKeys;
}


CahootsRunner.prototype.highlightGivenKeys = function(foundKeys, authorHints) {
    jQuery("body").highlight(foundKeys, {caseSensitive: false, className: authorHints});
}


CahootsRunner.prototype.tooltipsterize = function() {
    var that = this;

    jQuery('span[class*=CahootsID]').tooltipster({
        interactive: true,
        contentAsHTML: false,
        //maxWidth: 344,
        animation: 'grow',
        content: jQuery('<span>Daten werden geladen…</span>'),
        delay: '220',
        speed: '210',
        timer: '440',
        autoClose: false,
        functionBefore: function(origin, continueTooltip) {
            var tooltipElement = this;
            continueTooltip();
            var id = jQuery(this).attr('class').replace(' tooltipstered','');
            // TODO: hacky

            var strippedId = id.split("_")[1];


            that.handleFullDetails(strippedId,function(data) {
                var fullCahootsOverlayContent = that.uiFormatter.createDetailsView(tooltipElement, data);
                origin.tooltipster('content', fullCahootsOverlayContent);
            })
        }
    });
}

CahootsRunner.prototype.run = function() {
    var debug = this.debug;

    var that = this;
    this.handleAuthorHints(function(authorHints){
        if(debug) console.log("received: " + authorHints)
        var foundKeys = that.findMatchingKeys(authorHints);
        if(debug) console.log("foundKeys:")
        if(debug) console.log(foundKeys)
        that.highlightGivenKeys(foundKeys, authorHints);
        that.tooltipsterize();
        if(debug) console.log("full cycle done")
    })


}


module.exports = CahootsRunner

},{}],2:[function(require,module,exports){
'use strict'

var CahootsUiFormatter = function() {
    this.snippets = {
        //contributeUrl: "http://cahoots-extension.github.io/index.html#contribute",
        reportErrorUrl : "mailto:mail@cahoots.pw?subject=Fehler",
        verifiedCaption: "Vom Autor verifizierte Verbindung",
        verifiedImageData : "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAOAAAADgCxW/H3AAABkUlEQVQoz32SP0hbURTGf+e+DBKMoCDSogasoKKmQYp/iCAE3eoTxyooSKeCThncXXXsUCld3BxNqYtERUUcpJBOpbYQBBGxigSDYt49DpL0pfo80x3O75z7ne8TfNW260bCIUkBLiqtAIgeAWuFoi7+HFzLl3ql9IjtjSYd43wRIcoTpUrOs95MNpHOlMHY3mjSccyGIMIzpah6nh3OJtIZadt1I2HH/AjaBPCmuos/N8dcFK9QJVfwbLcJhyT1HNRR1cKnzgXG60ZQVUSIhkOSMiBjgV9TZa55mjt7x9ezTeSfEtegvAoCByJxemtjrB5/49Se+yZKq/E3Jmp6eFf/FkcNapXZ5imuiwU+n6wipvJuoQefJK6q9Fe/ZqLJxa1PsnVxQHukhY+/V7jiGsEHih45L963vxRkSETYv/xO/ibPSMMgfbVx/t5eMv9rCevY/1UsP7JDrdJoGvgQnWT9bJudwqH/KGU7AgOgVkGohHwBMADZRDrjeXZYlVxZhpFHm0pQRVbBH3IZK9sUEPJ7Z0OvDDHwQ3kAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTQtMTAtMDNUMjM6Mzk6NDArMDI6MDB9Z2CiAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE0LTEwLTAzVDIzOjM5OjQwKzAyOjAwDDrYHgAAAABJRU5ErkJggg==",
        unknownRole: "Art der Verbindung unbekannt",
        cahoots_url: "http://www.cahoots.pw/"
    }
}


CahootsUiFormatter.prototype.createDetailsView = function(elem, data) {
    var snippets = this.snippets;

    var header = jQuery('<p>')
        .addClass("cahoots_top")
        .append("Für ")
        .append(
        jQuery("<strong>")
            .append(
            jQuery("<a>", {'href': data.info,'target':'_blank'}).addClass("name_info").text(data.name)
        )
    )
        .append(" wurden die folgenden Verbindungen gefunden:")

    var middleList = jQuery("<ul>", {id:'cahoots_list'});
    for (var i = 0; i < data.cahoots.length; i++) {


        var listItem = jQuery("<li>").addClass("cahoots_item"+(data.cahoots[i].verified == "true" ? " verified" : ""));
        var organizationAnchor = jQuery("<a>", {target:"_blank",title:"Mehr Infos zu dieser Organisation",href:data.cahoots[i].info});

        organizationAnchor.append(data.cahoots[i].name);
        listItem.append(organizationAnchor);

        var sourceAnchor = jQuery("<a>", {target:"_blank","href":data.cahoots[i].source}).addClass("quelle").text("Quelle")
        listItem.append(sourceAnchor);

        var roleCaption = jQuery("<span>"+(typeof data.cahoots[i].role == "undefined" ? snippets.unknownRole : data.cahoots[i].role)+"</span>").addClass("role")

        listItem.append(jQuery("<br>"));
        listItem.append(roleCaption);

        middleList.append(listItem)
    }

    var middleContent = jQuery("<section>").addClass("cahoots_middle")
        .append(middleList)

    var footer = jQuery("<section>").addClass("cahoots_footer")
        .append(jQuery("<a>",{'href':snippets.cahoots_url,target:"_blank"}).addClass("cahoots_logo"))
        .append(
            jQuery("<a>", {target:"_blank",href:snippets.reportErrorUrl}).addClass("cahoots_button").text("Fehler melden")
        )

    var fullCahootsOverlayContent = jQuery("<div>").addClass("cahoots_popover")
        .append(header)
        .append(middleContent)
        .append(footer);
    return fullCahootsOverlayContent;
}



module.exports = CahootsUiFormatter
},{}],3:[function(require,module,exports){
'use strict'

var CahootsRunner= require('./CahootsRunner');
var CahootsUiFormatter = require('./CahootsUiFormatter');

//module.exports = //function instantiate (type) {

    //return
    //{
module.exports.CahootsRunner= CahootsRunner
module.exports.CahootsUiFormatter=CahootsUiFormatter
    //}
//};
},{"./CahootsRunner":1,"./CahootsUiFormatter":2}]},{},[1,2,3])(3)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9qcy9hcHAvY29udGVudC9DYWhvb3RzUnVubmVyLmpzIiwic3JjL21haW4vanMvYXBwL2NvbnRlbnQvQ2Fob290c1VpRm9ybWF0dGVyLmpzIiwic3JjL21haW4vanMvYXBwL2NvbnRlbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gQ2Fob290c1J1bm5lciggaGFuZGxlRnVsbERldGFpbHMsIGhhbmRsZUF1dGhvckhpbnRzLCB1aUZvcm1hdHRlcikge1xuICAgIHRoaXMuaGFuZGxlQXV0aG9ySGludHMgPSBoYW5kbGVBdXRob3JIaW50cztcbiAgICB0aGlzLmhhbmRsZUZ1bGxEZXRhaWxzID0gaGFuZGxlRnVsbERldGFpbHM7XG4gICAgdGhpcy51aUZvcm1hdHRlciA9IHVpRm9ybWF0dGVyO1xuICAgIHRoaXMuZGVidWcgPSBmYWxzZTtcbn1cblxuQ2Fob290c1J1bm5lci5wcm90b3R5cGUuZmluZE1hdGNoaW5nS2V5cyA9IGZ1bmN0aW9uKGF1dGhvckhpbnRzKSB7XG4gICAgaWYodGhpcy5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImVudGVyaW5nIGZpbmRNYXRjaGluZ0tleXMgd2l0aCBhdXRob3JIaW50czpcIilcbiAgICAgICAgY29uc29sZS5sb2coYXV0aG9ySGludHMpXG4gICAgfVxuXG4gICAgdmFyIGZvdW5kS2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBhdXRob3JIaW50cykge1xuICAgICAgICBpZiAoalF1ZXJ5KCdmb3JtOmNvbnRhaW5zKFwiJyArIGtleSArICdcIiknKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoalF1ZXJ5KCdib2R5OmNvbnRhaW5zKFwiJyArIGtleSArICdcIiknKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZm91bmRLZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kS2V5cztcbn1cblxuXG5DYWhvb3RzUnVubmVyLnByb3RvdHlwZS5oaWdobGlnaHRHaXZlbktleXMgPSBmdW5jdGlvbihmb3VuZEtleXMsIGF1dGhvckhpbnRzKSB7XG4gICAgalF1ZXJ5KFwiYm9keVwiKS5oaWdobGlnaHQoZm91bmRLZXlzLCB7Y2FzZVNlbnNpdGl2ZTogZmFsc2UsIGNsYXNzTmFtZTogYXV0aG9ySGludHN9KTtcbn1cblxuXG5DYWhvb3RzUnVubmVyLnByb3RvdHlwZS50b29sdGlwc3Rlcml6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIGpRdWVyeSgnc3BhbltjbGFzcyo9Q2Fob290c0lEXScpLnRvb2x0aXBzdGVyKHtcbiAgICAgICAgaW50ZXJhY3RpdmU6IHRydWUsXG4gICAgICAgIGNvbnRlbnRBc0hUTUw6IGZhbHNlLFxuICAgICAgICAvL21heFdpZHRoOiAzNDQsXG4gICAgICAgIGFuaW1hdGlvbjogJ2dyb3cnLFxuICAgICAgICBjb250ZW50OiBqUXVlcnkoJzxzcGFuPkRhdGVuIHdlcmRlbiBnZWxhZGVu4oCmPC9zcGFuPicpLFxuICAgICAgICBkZWxheTogJzIyMCcsXG4gICAgICAgIHNwZWVkOiAnMjEwJyxcbiAgICAgICAgdGltZXI6ICc0NDAnLFxuICAgICAgICBhdXRvQ2xvc2U6IGZhbHNlLFxuICAgICAgICBmdW5jdGlvbkJlZm9yZTogZnVuY3Rpb24ob3JpZ2luLCBjb250aW51ZVRvb2x0aXApIHtcbiAgICAgICAgICAgIHZhciB0b29sdGlwRWxlbWVudCA9IHRoaXM7XG4gICAgICAgICAgICBjb250aW51ZVRvb2x0aXAoKTtcbiAgICAgICAgICAgIHZhciBpZCA9IGpRdWVyeSh0aGlzKS5hdHRyKCdjbGFzcycpLnJlcGxhY2UoJyB0b29sdGlwc3RlcmVkJywnJyk7XG4gICAgICAgICAgICAvLyBUT0RPOiBoYWNreVxuXG4gICAgICAgICAgICB2YXIgc3RyaXBwZWRJZCA9IGlkLnNwbGl0KFwiX1wiKVsxXTtcblxuXG4gICAgICAgICAgICB0aGF0LmhhbmRsZUZ1bGxEZXRhaWxzKHN0cmlwcGVkSWQsZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBmdWxsQ2Fob290c092ZXJsYXlDb250ZW50ID0gdGhhdC51aUZvcm1hdHRlci5jcmVhdGVEZXRhaWxzVmlldyh0b29sdGlwRWxlbWVudCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgb3JpZ2luLnRvb2x0aXBzdGVyKCdjb250ZW50JywgZnVsbENhaG9vdHNPdmVybGF5Q29udGVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbkNhaG9vdHNSdW5uZXIucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWJ1ZyA9IHRoaXMuZGVidWc7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5oYW5kbGVBdXRob3JIaW50cyhmdW5jdGlvbihhdXRob3JIaW50cyl7XG4gICAgICAgIGlmKGRlYnVnKSBjb25zb2xlLmxvZyhcInJlY2VpdmVkOiBcIiArIGF1dGhvckhpbnRzKVxuICAgICAgICB2YXIgZm91bmRLZXlzID0gdGhhdC5maW5kTWF0Y2hpbmdLZXlzKGF1dGhvckhpbnRzKTtcbiAgICAgICAgaWYoZGVidWcpIGNvbnNvbGUubG9nKFwiZm91bmRLZXlzOlwiKVxuICAgICAgICBpZihkZWJ1ZykgY29uc29sZS5sb2coZm91bmRLZXlzKVxuICAgICAgICB0aGF0LmhpZ2hsaWdodEdpdmVuS2V5cyhmb3VuZEtleXMsIGF1dGhvckhpbnRzKTtcbiAgICAgICAgdGhhdC50b29sdGlwc3Rlcml6ZSgpO1xuICAgICAgICBpZihkZWJ1ZykgY29uc29sZS5sb2coXCJmdWxsIGN5Y2xlIGRvbmVcIilcbiAgICB9KVxuXG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IENhaG9vdHNSdW5uZXJcbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgQ2Fob290c1VpRm9ybWF0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zbmlwcGV0cyA9IHtcbiAgICAgICAgLy9jb250cmlidXRlVXJsOiBcImh0dHA6Ly9jYWhvb3RzLWV4dGVuc2lvbi5naXRodWIuaW8vaW5kZXguaHRtbCNjb250cmlidXRlXCIsXG4gICAgICAgIHJlcG9ydEVycm9yVXJsIDogXCJtYWlsdG86bWFpbEBjYWhvb3RzLnB3P3N1YmplY3Q9RmVobGVyXCIsXG4gICAgICAgIHZlcmlmaWVkQ2FwdGlvbjogXCJWb20gQXV0b3IgdmVyaWZpemllcnRlIFZlcmJpbmR1bmdcIixcbiAgICAgICAgdmVyaWZpZWRJbWFnZURhdGEgOiBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQTRBQUFBT0NBWUFBQUFmU0MzUkFBQUFCbUpMUjBRQS93RC9BUCtndmFlVEFBQUFDWEJJV1hNQUFBQklBQUFBU0FCR3lXcytBQUFBQ1had1FXY0FBQUFPQUFBQURnQ3hXL0gzQUFBQmtVbEVRVlFvejMyU1AwaGJVUlRHZitlK0RCS01vQ0RTb2dhc29LS21RWXAvaUNBRTNlb1R4eW9vU0tlQ1RobmNYWFhzVUNsZDNCeE5xWXRFUlVVY3BKQk9wYllRQkJHeGlnU0RZdDQ5RHBMMHBmbzgweDNPNzV6N25lOFRmTlcyNjBiQ0lVa0JMaXF0QUlnZUFXdUZvaTcrSEZ6TGwzcWw5SWp0alNZZDQzd1JJY29UcFVyT3M5NU1OcEhPbE1IWTNtalNjY3lHSU1JenBhaDZuaDNPSnRJWmFkdDFJMkhIL0FqYUJQQ211b3MvTjhkY0ZLOVFKVmZ3YkxjSmh5VDFITlJSMWNLbnpnWEc2MFpRVlVTSWhrT1NNaUJqZ1Y5VFphNTVtanQ3eDllelRlU2ZFdGVndkFvQ0J5SnhlbXRqckI1LzQ5U2UreVpLcS9FM0ptcDZlRmYvRmtjTmFwWFo1aW11aXdVK242d2lwdkp1b1FlZkpLNnE5RmUvWnFMSnhhMVBzblZ4UUh1a2hZKy9WN2ppR3NFSGloNDVMOTYzdnhSa1NFVFl2L3hPL2liUFNNTWdmYlZ4L3Q1ZU12OXJDZXZZLzFVc1A3SkRyZEpvR3ZnUW5XVDliSnVkd3FIL0tHVTdBZ09nVmtHb2hId0JNQURaUkRyamVYWllsVnhaaHBGSG0wcFFSVmJCSDNJWks5c1VFUEo3WjBPdkRESHdRM2tBQUFBbGRFVllkR1JoZEdVNlkzSmxZWFJsQURJd01UUXRNVEF0TUROVU1qTTZNems2TkRBck1ESTZNREI5WjJDaUFBQUFKWFJGV0hSa1lYUmxPbTF2WkdsbWVRQXlNREUwTFRFd0xUQXpWREl6T2pNNU9qUXdLekF5T2pBd0REcllIZ0FBQUFCSlJVNUVya0pnZ2c9PVwiLFxuICAgICAgICB1bmtub3duUm9sZTogXCJBcnQgZGVyIFZlcmJpbmR1bmcgdW5iZWthbm50XCIsXG4gICAgICAgIGNhaG9vdHNfdXJsOiBcImh0dHA6Ly93d3cuY2Fob290cy5wdy9cIlxuICAgIH1cbn1cblxuXG5DYWhvb3RzVWlGb3JtYXR0ZXIucHJvdG90eXBlLmNyZWF0ZURldGFpbHNWaWV3ID0gZnVuY3Rpb24oZWxlbSwgZGF0YSkge1xuICAgIHZhciBzbmlwcGV0cyA9IHRoaXMuc25pcHBldHM7XG5cbiAgICB2YXIgaGVhZGVyID0galF1ZXJ5KCc8cD4nKVxuICAgICAgICAuYWRkQ2xhc3MoXCJjYWhvb3RzX3RvcFwiKVxuICAgICAgICAuYXBwZW5kKFwiRsO8ciBcIilcbiAgICAgICAgLmFwcGVuZChcbiAgICAgICAgalF1ZXJ5KFwiPHN0cm9uZz5cIilcbiAgICAgICAgICAgIC5hcHBlbmQoXG4gICAgICAgICAgICBqUXVlcnkoXCI8YT5cIiwgeydocmVmJzogZGF0YS5pbmZvLCd0YXJnZXQnOidfYmxhbmsnfSkuYWRkQ2xhc3MoXCJuYW1lX2luZm9cIikudGV4dChkYXRhLm5hbWUpXG4gICAgICAgIClcbiAgICApXG4gICAgICAgIC5hcHBlbmQoXCIgd3VyZGVuIGRpZSBmb2xnZW5kZW4gVmVyYmluZHVuZ2VuIGdlZnVuZGVuOlwiKVxuXG4gICAgdmFyIG1pZGRsZUxpc3QgPSBqUXVlcnkoXCI8dWw+XCIsIHtpZDonY2Fob290c19saXN0J30pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5jYWhvb3RzLmxlbmd0aDsgaSsrKSB7XG5cblxuICAgICAgICB2YXIgbGlzdEl0ZW0gPSBqUXVlcnkoXCI8bGk+XCIpLmFkZENsYXNzKFwiY2Fob290c19pdGVtXCIrKGRhdGEuY2Fob290c1tpXS52ZXJpZmllZCA9PSBcInRydWVcIiA/IFwiIHZlcmlmaWVkXCIgOiBcIlwiKSk7XG4gICAgICAgIHZhciBvcmdhbml6YXRpb25BbmNob3IgPSBqUXVlcnkoXCI8YT5cIiwge3RhcmdldDpcIl9ibGFua1wiLHRpdGxlOlwiTWVociBJbmZvcyB6dSBkaWVzZXIgT3JnYW5pc2F0aW9uXCIsaHJlZjpkYXRhLmNhaG9vdHNbaV0uaW5mb30pO1xuXG4gICAgICAgIG9yZ2FuaXphdGlvbkFuY2hvci5hcHBlbmQoZGF0YS5jYWhvb3RzW2ldLm5hbWUpO1xuICAgICAgICBsaXN0SXRlbS5hcHBlbmQob3JnYW5pemF0aW9uQW5jaG9yKTtcblxuICAgICAgICB2YXIgc291cmNlQW5jaG9yID0galF1ZXJ5KFwiPGE+XCIsIHt0YXJnZXQ6XCJfYmxhbmtcIixcImhyZWZcIjpkYXRhLmNhaG9vdHNbaV0uc291cmNlfSkuYWRkQ2xhc3MoXCJxdWVsbGVcIikudGV4dChcIlF1ZWxsZVwiKVxuICAgICAgICBsaXN0SXRlbS5hcHBlbmQoc291cmNlQW5jaG9yKTtcblxuICAgICAgICB2YXIgcm9sZUNhcHRpb24gPSBqUXVlcnkoXCI8c3Bhbj5cIisodHlwZW9mIGRhdGEuY2Fob290c1tpXS5yb2xlID09IFwidW5kZWZpbmVkXCIgPyBzbmlwcGV0cy51bmtub3duUm9sZSA6IGRhdGEuY2Fob290c1tpXS5yb2xlKStcIjwvc3Bhbj5cIikuYWRkQ2xhc3MoXCJyb2xlXCIpXG5cbiAgICAgICAgbGlzdEl0ZW0uYXBwZW5kKGpRdWVyeShcIjxicj5cIikpO1xuICAgICAgICBsaXN0SXRlbS5hcHBlbmQocm9sZUNhcHRpb24pO1xuXG4gICAgICAgIG1pZGRsZUxpc3QuYXBwZW5kKGxpc3RJdGVtKVxuICAgIH1cblxuICAgIHZhciBtaWRkbGVDb250ZW50ID0galF1ZXJ5KFwiPHNlY3Rpb24+XCIpLmFkZENsYXNzKFwiY2Fob290c19taWRkbGVcIilcbiAgICAgICAgLmFwcGVuZChtaWRkbGVMaXN0KVxuXG4gICAgdmFyIGZvb3RlciA9IGpRdWVyeShcIjxzZWN0aW9uPlwiKS5hZGRDbGFzcyhcImNhaG9vdHNfZm9vdGVyXCIpXG4gICAgICAgIC5hcHBlbmQoalF1ZXJ5KFwiPGE+XCIseydocmVmJzpzbmlwcGV0cy5jYWhvb3RzX3VybCx0YXJnZXQ6XCJfYmxhbmtcIn0pLmFkZENsYXNzKFwiY2Fob290c19sb2dvXCIpKVxuICAgICAgICAuYXBwZW5kKFxuICAgICAgICAgICAgalF1ZXJ5KFwiPGE+XCIsIHt0YXJnZXQ6XCJfYmxhbmtcIixocmVmOnNuaXBwZXRzLnJlcG9ydEVycm9yVXJsfSkuYWRkQ2xhc3MoXCJjYWhvb3RzX2J1dHRvblwiKS50ZXh0KFwiRmVobGVyIG1lbGRlblwiKVxuICAgICAgICApXG5cbiAgICB2YXIgZnVsbENhaG9vdHNPdmVybGF5Q29udGVudCA9IGpRdWVyeShcIjxkaXY+XCIpLmFkZENsYXNzKFwiY2Fob290c19wb3BvdmVyXCIpXG4gICAgICAgIC5hcHBlbmQoaGVhZGVyKVxuICAgICAgICAuYXBwZW5kKG1pZGRsZUNvbnRlbnQpXG4gICAgICAgIC5hcHBlbmQoZm9vdGVyKTtcbiAgICByZXR1cm4gZnVsbENhaG9vdHNPdmVybGF5Q29udGVudDtcbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ2Fob290c1VpRm9ybWF0dGVyIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBDYWhvb3RzUnVubmVyPSByZXF1aXJlKCcuL0NhaG9vdHNSdW5uZXInKTtcbnZhciBDYWhvb3RzVWlGb3JtYXR0ZXIgPSByZXF1aXJlKCcuL0NhaG9vdHNVaUZvcm1hdHRlcicpO1xuXG4vL21vZHVsZS5leHBvcnRzID0gLy9mdW5jdGlvbiBpbnN0YW50aWF0ZSAodHlwZSkge1xuXG4gICAgLy9yZXR1cm5cbiAgICAvL3tcbm1vZHVsZS5leHBvcnRzLkNhaG9vdHNSdW5uZXI9IENhaG9vdHNSdW5uZXJcbm1vZHVsZS5leHBvcnRzLkNhaG9vdHNVaUZvcm1hdHRlcj1DYWhvb3RzVWlGb3JtYXR0ZXJcbiAgICAvL31cbi8vfTsiXX0=
