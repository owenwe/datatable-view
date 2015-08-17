/**
 * DataTableView jQuery plugin
 * @version 1.0.1
 * @author Wes Owen wowen@ccctechcenter.org
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
    
    /**
     * A Backbone View extended from Backbone.View.
     * @see http://backbonejs.org/#View-constructor
     * @typedef {Class} Backbone-View
     * @property {Element} el - an element constructed from this instance's tagName, className, id, and attributes properties
     * @property {string} className=undefined - The value of this instance's el class attribute.
     * @property {string} tagName=div - The DOM Element to create for this instance's el.
     * @property {string} id=undefined] - The value of this instance's el id attribute. The id attribute is not created unless this has a value.
     * @property {object} events=undefined] - An object hash used to define event listener functions for the elements within this instance.
     * @property {object} attributes=undefined] - A hash of attributes that will be set as HTML DOM element attributes on the view's el.
     * @property {Backbone.Model} model=undefined - A model this view can access directly as an instance variable.
     * @property {Backbone.Collection} collection - A collection this view can access directly as an instance variable.
     * @property {function} initialize - A function that can be overridden to customize the constructor. Takes an "options" parameter.
     * @property {function} render - A function that can be overridden.
     */
    
    