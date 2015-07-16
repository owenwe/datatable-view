/**
 * DataTableView jQuery plugin
 * @version 1.0.1
 * @author Wes Owen
 */
(function($){
    'use strict';
    
    /*
     * extend underscore
     */
    _.createKeyValueObject = function(key, value) {
        var r = {};
        r[key] = value;
        return r;
    };