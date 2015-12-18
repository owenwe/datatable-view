/**
 * DataTableView jQuery plugin
 * @version 1.0.3
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
    
    
/**
 * Template for rendering the Action Progress Panel.
 * @memberof $.fn.DataTableView
 * @constant {string} template_app_view
 * @property {object} config - the template variable
 * @property {string} config.label - the label inside the progress bar
 * @property {string} config.errorMessage - the error message
 * @property {number} config.defaultValue - current value of the progress bar
 * @property {number} config.max - maximum value of the progress bar
 * @property {number} config.min - minimum value of the progress bar
 */
var template_app_view = [
'<div class="panel-heading">',
    '<div class="progress">',
        '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="<%= config.defaultValue %>" aria-valuemin="<%= config.min %>" aria-valuemax="<%= config.max %>" style="width:100%">',
            '<span><%= config.label %></span>',
        '</div>',
    '</div>',
'</div>',
'<div class="panel-body text-danger"><%= config.errorMessage %></div>'
].join('');

/**
 * Template string for the Form Navigation control.
 * @memberof $.fn.DataTableView
 * @constant {string} template_fnv_view
 */
var template_fnv_view = [
    '<div class="btn-group center-block" role="group" aria-label="navigation">',
        '<button type="button" class="btn btn-default" aria-label="go to first" data-nav-button="first">',
            '<span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span>',
        '</button>',
        '<button type="button" class="btn btn-default" aria-label="go to previous" data-nav-button="previous">',
            '<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>',
        '</button>',
        '<button type="button" class="btn btn-default" aria-label="go to next" data-nav-button="next">',
            '<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>',
        '</button>',
        '<button type="button" class="btn btn-default" aria-label="go to last" data-nav-button="last">',
            '<span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span>',
        '</button>',
    '</div>'
].join('');

/**
 * Template string for the Modal Form Navigation control.
 * @memberof $.fn.DataTableView
 * @constant {string} template_mfv_view
 */
var template_mfv_view = [
    '<div class="modal-dialog modal-<%= config.modalSize %>">',
        '<div class="modal-content">',
            '<div class="modal-header">',
                '<button type="button" class="close" data-dismiss="modal">',
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>',
                '</button>',
                '<h4 class="modal-title"></h4>',
            '</div>',
            '<div class="modal-body">',
                '<div class="container-fluid dtview-form-container"></div>',
            '</div>',
            '<div class="modal-footer">',
                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>',
                '<button type="button" class="btn btn-primary dtview-modal-form-action-button"></button>',
            '</div>',
        '</div>',
    '</div>'
].join('');

/**
 * The template string for the Column Visibility Control with groups.
 * @memberof $.fn.DataTableView
 * @constant {string} template_cvc_groups
 */
var template_cvc_groups = [
    '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">',
        '<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="caret"></span>',
    '</button>',
    '<ul class="dropdown-menu list-inline list-unstyled text-nowrap col-vis-menu" role="menu">',
       '<li<% if(_.has(config,"widthOverride")) { %> style="width:<%= config.widthOverride %>px" <% } %>>',
           '<h3><u>Column Visibility</u></h3>',
           '<ul class="list-inline list-unstyled">',
           '<% for(var i in config.sorted) { %>',
               '<li>',
                   '<div class="checkbox">',
                       '<label class="text-nowrap btn btn-sm btn-default">',
                           '<input type="checkbox" data-column="<%= config.sorted[i].data %>" ',
                               'value="<%= config.sorted[i].index %>"<% if(config.sorted[i].visible) { %> checked="checked"<% } %> />',
                           '<span class="text-capitalize"><%= config.sorted[i].title %></span>',
                       '</label>',
                   '</div>',
               '</li>',
           '<% } %>',
           '</ul>',
           '<p><button type="button" class="btn btn-default" data-group-index="-1">reset</button></p>',
       '</li>',
       '<li>',
           '<h3><u>Visibility Groups</u></h3>',
           '<% for(var i in config.groups) { %>',
               '<p><button type="button" class="btn btn-default" data-group-index="<%= i %>">',
                   '<span class="text-nowrap"><%= config.groups[i].name %></span>',
               '</button></p>',
           '<% } %>',
       '</li>',
   '</ul>'
].join('');
/**
 * The template string for the Column Visibility Group without groups
 * @memberof $.fn.DataTableView
 * @constant {string} template_cvc_noGroups
 */
var template_cvc_noGroups = [
     '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">',
         '<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="caret"></span>',
     '</button>',
     '<ul class="dropdown-menu list-unstyled text-nowrap col-vis-menu" role="menu">',
         '<li<% if(_.has(config,"widthOverride")) { %> style="width:<%= config.widthOverride %>px" <% } %>>',
             '<h3><u>Column Visibility</u></h3>',
             '<ul class="list-inline list-unstyled">',
             '<% for(var i in config.sorted) { %>',
                 '<li>',
                     '<div class="checkbox">',
                         '<label class="text-nowrap btn btn-sm btn-default">',
                             '<input type="checkbox" data-column="<%= config.sorted[i].data %>" ',
                                 'value="<%= config.sorted[i].index %>"<% if(config.sorted[i].visible) { %> checked="checked"<% } %> />',
                             '<span class="text-capitalize"><%= config.sorted[i].title %></span>',
                         '</label>',
                     '</div>',
                 '</li>',
             '<% } %>',
             '</ul>',
             '<p><button type="button" class="btn btn-default" data-group-index="-1">reset</button></p>',
         '</li>',
     '</ul>'
 ].join('');
/**
 * The main template string for the DataTableView Backbone view.
 * @memberof $.fn.DataTableView
 * @constant {string} template_dtv_view
 */
var template_dtv_view = [
    '<table class="table table-condensed table-striped table-bordered dtview-datatable" width="100%"></table>'
].join('');
/**
 * A render function for a primary key column in a datatable. This function 
 * would render modify and delete buttons.
 * @callback primaryKeyColumnModifyRender
 * @param {object} data - the data from the datatable row
 * @param {string} type - the data type for the column rendered
 * @param {object} full - all data from datatables
 * @param {object} meta - additional information about the column
 */
var primaryKeyColumnModifyRender = function(data, type, full, meta) {
    return [
        '<div class="btn-group">',
            '<button type="button" class="btn btn-default btn-info btn-xs dtview-edit-btn" data-row-id="',data,'" data-view-only="false">',
                '<span class="glyphicon glyphicon-cog"></span>',
            '</button>',
            '<button type="button" class="btn btn-default btn-danger btn-xs dtview-del-btn">',
                '<span class="glyphicon glyphicon-remove"></span>',
            '</button>',
        '</div>'
    ].join('');
};
    
    
/**
 * A render function for a primary key column in a datatable. This function 
 * would render a link labeled, "View".
 * @callback primaryKeyColumnReadonlyRender
 * @param {object} data - the data from the datatable row
 * @param {string} type - the data type for the column rendered
 * @param {object} full - all data from datatables
 * @param {object} meta - additional information about the column
 */
var primaryKeyColumnReadonlyRender = function(data, type, full, meta) {
    return [
        '<div class="center-block text-center">',
            '<a class="dtview-edit-btn" data-row-id="',data,'" data-view-only="true">View</a>',
        '</div>'
    ].join('');
};

/**
 * A render function for a primary key column in a datatable. This function 
 * would only render a modify button.
 * @callback primaryKeyColumnModifyOnlyRender
 * @param {object} data - the data from the datatable row
 * @param {string} type - the data type for the column rendered
 * @param {object} full - all data from datatables
 * @param {object} meta - additional information about the column
 */
var primaryKeyColumnModifyOnlyRender = function(data, type, full, meta) {
    return [
        '<div class="btn-group">',
            '<button type="button" class="btn btn-default btn-info btn-xs dtview-edit-btn" data-row-id="',data,'" data-view-only="false">',
                '<span class="glyphicon glyphicon-cog"></span>',
            '</button>',
        '</div>'
    ].join('');
};
    
    
/**
 * This function is intended to be used for the ajax.data value on the datatable. 
 * It will acquire the column filters data object and append it along with the 
 * table name to the data being sent to the datatable's server-side script.
 * @callback ajaxDataProcess
 * @param {object} d
 * @param {DataTable} datatable
 */
var ajaxDataProcess = function(d, datatable) {
    // datatable.ajax.context is the DataTableView instance
    if(datatable.ajax.context && datatable.ajax.context.model.get('columnFilters')) {
        var cf = datatable.ajax.context.model.get('columnFilters').getFilters();
        if(cf) {
            d.columnfilters = cf;
        }
        d.table = datatable.ajax.context.model.get('tableData').name;
    }
    return JSON.stringify(d);
};
var HiddenFormInput = Backbone.View.extend(
/** @lends HiddenFormInput.prototype */
{
    /**
     * @member {object} template - used to render this View
     * @private
     */
    'template':_.template('<input type="hidden" id="<%= forminput.name %>" />', {'variable':'forminput'}),
    
    /**
     * Returns the type of this Form Input Control
     * @public
     * @function type
     * @return {string} - the type of Form Input Control
     */
    'type':function() {
        return 'hidden';
    },
    
    /**
     * Returns the name property of this Form Input Control
     * @public
     * @function name
     * @return {string} - the name property given to the constructor
     */
    'name':function() {
        return this.model.get('name');
    },
    
    /**
     * Returns the value of the form input in the form of an object.
     * @pulic
     * @function get
     * @return {object} - return value will be an object
     */
    'get':function() {
        var returnValue = {}, inputValue = $.trim($('input', this.$el).val());
        returnValue[this.model.get('name')] = inputValue.length>0 ? inputValue : undefined;
        return returnValue;
    },
    
    /**
     * Sets the value of the form input.
     * @public
     * @function set
     * @param {object} - data from the datatable row for this data field
     * @return {HiddenFormInput} - this instance
     */
    'set':function(data) {
        $('input', this.$el).val(data);
        return this;
    },
    
    /**
     * Checks this Form Input Control value for minimal validation requirements. 
     * If required==true then the validation check takes place and the value the this.get() is returned,
     * otherwise the value of this.get() is returned.
     * This particular Form Input Control does not have feedback.
     * @public
     * @function validate
     * @return ({object|false})
     */
    'validate':function() {
        if(this.model.get('required')) {
            return $.trim($('input', this.$el).val()).length>0 ? this.get() : false;
        } else {
            return this.get();
        }
    },
    
    /**
     * resets the form elements to their initial value
     * @public
     * @function reset
     * @return {HiddenFormInput} - this instance
     */
    'reset':function() {
        this.render();
    },
    
    /**
     * Hidden input form control, this will create an instance of HiddenFormInput
     * @typedef {Backbone-View} HiddenFormInput
     * @class
     * @classdesc This is the most basic input form control. All Form Input 
     * View's will have a .get(), .set(), and .reset()
     * @version 1.0.1
     * @constructs HiddenFormInput
     * @extends Backbone-View
     * @param {object}             options                 - configuration options for this View instance
     * @param {string}             options.name            - the value to assign the name attribute on the input
     * @param {object}             [options.inputAttributes={autocomplete:'off', value:''}] - the attributes for the form input element
     * @param {boolean}            [options.required=false] - if the form input is required or not
     * @param {object}             [options.events] - an object with event signatures as keys and the handler function as the value
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        
        //console.log(options);
        this.model = new Backbone.Model(
            $.extend(true, {
                'name':'hidden-field',
                'inputAttributes':{'autocomplete':'off', 'value':''},
                'required':false
            }, options)
        );
        
        this.render();
    },
    
    /**
     * @private
     * @function render
     */
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        $('input', this.$el).attr(this.model.get('inputAttributes'));
        if(this.model.get('required')) {
            $('input', this.$el).attr({'required':'required'});
        }
        return this.$el;
    }
});
var TextFormInput = Backbone.View.extend(
/** @lends TextFormInput.prototype */{
    /**
     * @member {object} template - used to render this View
     * @private
     */
    'template':_.template([
        '<label for="<%= forminput.name %>" class="control-label text-nowrap col-sm-<% if(forminput.orientation==$.fn.DataTableView.LAYOUT_ORIENTATION.VERTICAL) { %>12 text-left-force<% } else { %>2<% } %>">',
            '<%= forminput.label %>',
        '</label>',
        '<% if(forminput.orientation==$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL) { %><div class="col-sm-10"><% } else { %><div class="col-sm-12"><% } %>',
        '<% if(forminput.textarea) { %>',
            '<textarea id="<%= forminput.name %>" />',
        '<% } else { %>',
            '<input type="text" id="<%= forminput.name %>" />',
        '<% } %>',
        '<% if(forminput.feedback && !forminput.textarea) { %><span class="glyphicon form-control-feedback hidden"></span><% } %>',
        '</div>'
    ].join(''), {'variable':'forminput'}),
    
    /**
     * Returns the type of this Form Input Control
     * @public
     * @function type
     * @return {string} - the type of Form Input Control
     */
    'type':function() {
        return this.model.get('textarea') ? 'textarea' : 'text';
    },
    
    /**
     * Returns the name property of this Form Input Control
     * @public
     * @function name
     * @return {string} - the name property given to the constructor
     */
    'name':function() {
        return this.model.get('name');
    },
    
    /**
     * Returns the value of the form input in the form of an object.
     * @pulic
     * @function get
     * @return {object} - return value will be an object
     */
    'get':function() {
        var formInput = this.model.get('textarea') ? $('textarea', this.$el) : $('input', this.$el), returnValue = {},
            inputValue = $.trim(formInput.val());
        returnValue[this.model.get('name')] = inputValue.length>0 ? inputValue : undefined;
        return returnValue;
    },
    
    /**
     * Sets the value of the form input.
     * @public
     * @function set
     * @param {object} - data from the datatable row for this data field
     */
    'set':function(data) {
        var formInput = this.model.get('textarea') ? $('textarea', this.$el) : $('input', this.$el);
        formInput.val(data);
    },
    
    /**
     * Toggles the disabled state of anything in this view that can be interacted with
     * @public
     * @function toggleDisabled
     * @param {boolean} enabled - if true then the disabled state will be removed from any interactive elements, or added if false
     */
    'toggleDisabled':function(enabled) {
        this.model.set('disabled', !enabled);
        var formInput = this.model.get('textarea') ? $('textarea', this.$el) : $('input', this.$el);
        if(enabled) {
            formInput.removeAttr('disabled');
        } else {
            formInput.attr('disabled', 'disabled');
        }
    },
    
    /**
     * Toggles the readonly state of anything in this view that can be interacted with
     * @public
     * @function toggleReadonly
     * @param {boolean} isReadonly - 
     */
    'toggleReadonly':function(isReadonly) {
        this.model.set('readonly', isReadonly);
        var formInput = this.model.get('textarea') ? $('textarea', this.$el) : $('input', this.$el);
        if(isReadonly) {
            formInput.attr('readonly', 'readonly');
        } else {
            formInput.removeAttr('readonly');
        }
    },
    
    /**
     * Checks this Form Input Control value for minimal validation requirements. 
     * If required==true then the validation check takes place and the value the this.get() is returned,
     * otherwise the value of this.get() is returned.
     * If the validation check fails and feedback==true then feedback status elements will display.
     * @public
     * @function validate
     * @return ({object|false})
     */
    'validate':function() {
        this.$el.removeClass('has-success has-error');
        $('span.form-control-feedback', this.$el).removeClass('glyphicon-ok glyphicon-remove').addClass('hidden');
        
        var formInput = this.model.get('textarea') ? $('textarea', this.$el) : $('input', this.$el);
        if(this.model.get('required')) {
            if($.trim(formInput.val()).length>0) {
                if(this.model.get('feedback')) {
                    // show success feedback status
                    this.$el.addClass('has-success');
                    if(!this.model.get('textarea')) {
                        $('span.form-control-feedback', this.$el).addClass('glyphicon-ok').removeClass('hidden');
                    }
                }
                return this.get();
            } else {
                if(this.model.get('feedback')) {
                    // show error feedback status
                    this.$el.addClass('has-error');
                    if(!this.model.get('textarea')) {
                        $('span.form-control-feedback', this.$el).addClass('glyphicon-remove').removeClass('hidden');
                    }
                }
            }
        } else {
            this.$el.addClass('has-success');
            return this.get();
        }
    },
    
    /**
     * resets the form elements to their initial value
     * @public
     * @function reset
     * @return {TextFormInput} - this instance
     */
    'reset':function() {
        this.render();
        return this;
    },
    
    
    'className':'form-group input-form-control',
    
    /**
     * Text input form control, this will create an instance of TextFormInput
     * @typedef {Backbone-View} TextFormInput
     * @class
     * @classdesc This is the most basic input form control. All Form Input View's will have a .type(), .name(), .get(), .set(), validate(), and .reset()
     * @version 1.0.1
     * @constructs TextFormInput
     * @extends Backbone-View
     * @param {object}             options                 - configuration options for this View instance
     * @param {string}             options.name            - the value to assign the name attribute on the input
     * @param {string}             options.label           - the display label for the form input
     * @param {object}             [options.inputAttributes={autocomplete:'off', maxlength:'45', class:'form-control input-sm', value:''}/{autocomplete:'off', class:'form-control', rows:'2'}] - the attributes for the form input element
     * @param {boolean}            [options.required=false] - if the form input is required or not
     * @param {boolean}            [options.feedback=true]  - if the bootstrap form input should have feedback elements
     * @param {boolean}            [options.disabled=false] - if true then the form control is initially put into a disabled state
     * @param {boolean}            [options.readonly=false] - if true then the form control is initially put into a readonly state, note if the disabled option is set to true then that state will take priority
     * @param {LAYOUT_ORIENTATION} [options.orientation=$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL] - the type of layout style for the form input
     * @param {boolean}            [options.textarea=false} - if true then the form input will be a "textarea" and not an "input type=text"
     * @param {object}             [options.events] - an object with event signatures as keys and the handler function as the value
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        
        this.model = new Backbone.Model(
            $.extend(true, {
                'name':'text-field',
                'label':'Unknown Text Field',
                'inputAttributes':{'autocomplete':'off', 'class':'form-control'},
                'required':false,
                'feedback':true,
                'disabled':false,
                'readonly':false,
                'orientation':$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL,
                'textarea':false
            }, options)
        );
        
        this.$el.addClass('dtview-form-'+this.model.get('name'));
        
        if(this.model.get('feedback')) {
            this.$el.addClass('has-feedback');
        }
        
        if(!this.model.get('textarea')) {
            this.model.get('inputAttributes')['class'] = [this.model.get('inputAttributes')['class'],'input-sm'].join(' ');
            if(!_.has(this.model.get('inputAttributes'), 'value')) {
                $.extend(this.model.get('inputAttributes'), {'value':''});
            }
            if(!_.has(this.model.get('inputAttributes'), 'maxlength')) {
                $.extend(this.model.get('inputAttributes'), {'maxlength':'45'});
            }
        } else {
            if(!_.has(this.model.get('inputAttributes'), 'rows')) {
                $.extend(this.model.get('inputAttributes'), {'rows':'2'});
            }
        }
        
        this.render();
    },
    
    /**
     * @private
     * @function render
     */
    'render':function() {
        this.$el.removeClass('has-success has-error').empty().append(this.template(this.model.toJSON()));
        var formInput = this.model.get('textarea') ? $('textarea', this.$el) : $('input', this.$el);
        formInput.attr(this.model.get('inputAttributes'));
        if(this.model.get('required')) {
            $('label', this.$el).addClass('text-danger');
            formInput.attr({'required':'required'});
        }
        if(this.model.get('disabled')) {
            formInput.attr('disabled', 'disabled');
        } else if(this.model.get('readonly')) {
            formInput.attr({'readonly':'readonly', 'disabled':'disabled'});
        }
        return this.$el;
    }
});
var ButtonToggleFormInput = Backbone.View.extend(
/** @lends ButtonToggleFormInput.prototype */
{
    /**
     * @member {object} template - used to render this View
     * @private
     */
    'template':_.template([
        '<% if(forminput.orientation===$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL) { %>',
            '<label class="col-sm-2 control-label text-nowrap"><%= forminput.label %></label>',
        '<% } else { %>',
            '<label class="col-sm-12 control-label text-nowrap text-left-force"><%= forminput.label %></label>',
        '<% } %>',
            '<div class="btn-group<% if(forminput.buttonGroupSize){ %> <%= forminput.buttonGroupSize %><% } %> col-sm-10" data-toggle="buttons">',
                '<label for="<%= forminput.name %>-true" class="btn btn-primary<% if(forminput.defaultToggled) { %> active<% } %>">',
                    '<input type="radio" id="<%= forminput.name %>-true" value="<%= forminput.trueValue %>" <% if(forminput.defaultToggled) { %>checked="checked"<% } %> /> <%= forminput.trueLabel %>',
                '</label>',
                '<label for="<%= forminput.name %>-false" class="btn btn-primary<% if(!forminput.defaultToggled) { %> active<% } %>">',
                    '<input type="radio" id="<%= forminput.name %>-false" value="<%= forminput.falseValue %>" <% if(!forminput.defaultToggled) { %>checked="checked"<% } %> /> <%= forminput.falseLabel %>',
                '</label>',
            '</div>'
    ].join(''), {'variable':'forminput'}),
    
    /**
     * Returns the type of this Form Input Control
     * @public
     * @function type
     * @return {string} - the type of Form Input Control
     */
    'type':function() {
        return 'toggle';
    },
    
    /**
     * Returns the name property of this Form Input Control
     * @public
     * @function name
     * @return {string} - the name property given to the constructor
     */
    'name':function() {
        return this.model.get('name');
    },
    
    /**
     * Returns the value of the form input in the form of an object.
     * @pulic
     * @function get
     * @return {object} - return value will be an object
     */
    'get':function() {
        var returnValue = {};
        returnValue[this.model.get('name')] = $('label.active input', this.$el).val();
        return returnValue;
    },
    
    /**
     * Sets the value of the form input.
     * @public
     * @function set
     * @param {(string|number|boolean)} - data from the datatable row for this data field
     */
    'set':function(data) {
        $('label.btn', this.$el).removeClass('active');
        $(['input[value="',data,'"]'].join(''), this.$el).parent().addClass('active');
    },
    
    /**
     * Toggles the disabled state of anything in this view that can be interacted with
     * @public
     * @function toggleDisabled
     * @param {boolean} enabled - if true then the disabled state will be removed from any interactive elements, or added if false
     */
    'toggleDisabled':function(enabled) {
        this.model.set('disabled', !enabled);
        if(enabled) {
            $('div.btn-group label', this.$el).removeClass('disabled');
            $('input', this.$el).removeAttr('disabled');
        } else {
            $('div.btn-group label', this.$el).addClass('disabled');
            $('input', this.$el).attr('disabled', 'disabled');
        }
    },
    
    /**
     * Toggles the readonly state of anything in this view that can be interacted with
     * @public
     * @function toggleReadonly
     * @param {boolean} isReadonly - 
     */
    'toggleReadonly':function(isReadonly) {
        this.model.set('readonly', isReadonly);
        if(isReadonly) {
            $('div.btn-group label', this.$el).addClass('disabled');
            $('input', this.$el).attr('disabled', 'disabled');
        } else {
            $('div.btn-group label', this.$el).removeClass('disabled');
            $('input', this.$el).removeAttr('disabled');
        }
    },
    
    /**
     * Checks this Form Input Control value for minimal validation requirements.
     * This particular Form Input Control will always validate so feedback status does not exist.
     * @public
     * @function validate
     * @return ({object|false})
     */
    'validate':function() {
        this.$el.addClass('has-success');
        return this.get();
    },
    
    /**
     * resets the form elements to their initial value
     * @public
     * @function reset
     * @return {ButtonToggleFormInput} - this instance
     */
    'reset':function() {
        // it's easier just to re-render
        this.render();
        return this;
    },
    
    /**
     * 
     * @member {object} events - event handler functions for this View
     * 
     */
    'events':{},
    
    'className':'form-group input-form-control',
    
    /**
     * Button toggle input form control, this will create an instance of ButtonToggleFormInput
     * @typedef {Backbone-View} ButtonToggleFormInput
     * @class
     * @classdesc This form control is for boolean-type values.
     * @version 1.0.0
     * @constructs ButtonToggleFormInput
     * @extends Backbone-View
     * @param {object}             options                                                                - configuration options for this View instance
     * @param {string}             options.name                                                           - the value to assign the name attribute on the input
     * @param {string}             options.label                                                          - the display label for the form input
     * @param {object}             [options.inputAttributes={autocomplete:'off'}]                         - the attributes for the text input element
     * @param {string}             [options.trueLabel=Yes]                                                - the label for the true toggle button
     * @param {string}             [options.trueValue=1]                                                  - the value for the true toggle, anything that can be assigned to the "value" attribute
     * @param {string}             [options.falseLabel=No]                                                - the label for the false toggle button
     * @param {string}             [options.falseValue=0]                                                 - the value for the false toggle, anything that can be assigned to the "value" attribute
     * @param {boolean}            [options.defaultToggled=true]                                          - which value (true/false) should be toggled by default
     * @param {boolean}            [options.disabled=false] - if true then the form control is initially put into a disabled state
     * @param {boolean}            [options.readonly=false] - if true then the form control is initially put into a readonly state, note if the disabled option is true, then that takes priority
     * @param {string}             [options.buttonGroupSize]                                              - the bootstrap button group size css class
     * @param {LAYOUT_ORIENTATION} [options.orientation=$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL] - the type of layout style for the form input
     * @param {object}             [options.events] - an object with event signatures as keys and the handler function as the value
     */
    'initialize':function(options) {
        this.version = '1.0.0';
        
        this.model = new Backbone.Model(
            $.extend(true, {
                'name':'toggle-field',
                'label':'Unknown Toggle',
                'inputAttributes':{'autocomplete':'off'},
                'trueLabel':'Yes',
                'trueValue':1,
                'falseLabel':'No',
                'falseValue':0,
                'defaultToggled':true,
                'disabled':false,
                'readonly':false,
                'buttonGroupSize':null,
                'orientation':$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL
            }, options)
        );
        
        this.$el.addClass('dtview-form-'+this.model.get('name'));
        
        this.render();
    },
    
    /**
     * @private
     * @function render
     */
    'render':function() {
        this.$el.empty().removeClass('has-success').append(this.template(this.model.toJSON()));
        $('input', this.$el).attr(this.model.get('inputAttributes'));
        if(this.model.get('required')) {
            $('label.control-label', this.$el).addClass('text-danger');
        }
        if(this.model.get('disabled') || this.model.get('readonly')) {
            $('div.btn-group label', this.$el).addClass('disabled');
            $('input', this.$el).attr('disabled', 'disabled');
        }
        return this.$el;
    }
});
var ButtonGroupToggleFormInput = Backbone.View.extend(
/** @lends ButtonGroupToggleFormInput.prototype */
{
    /**
     * The forminput template variable will have a "buttons" property that's an 
     * array of objects; each with a "label" and "value" property.
     * @member {object} template - used to render this View
     * @private
     */
    'template':_.template([
        '<label class="control-label text-nowrap col-sm-<% if(forminput.orientation==$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL) { %>2<% } else { %>12 text-left-force<% }%>">',
            '<%= forminput.label %>',
        '</label>',
        '<% if(forminput.orientation==$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL) { %>',
            '<div class="btn-group<% if(forminput.buttonGroupSize){ %> <%= forminput.buttonGroupSize %><% } %> col-sm-10" data-toggle="buttons">',
        '<% } else { %>',
            '<div class="btn-group-vertical<% if(forminput.buttonGroupSize){ %> <%= forminput.buttonGroupSize %><% } %>" data-toggle="buttons">',
        '<% } %>',
        '<% for(var i in forminput.buttons) { %>',
            '<label for="<%= [forminput.name,"-",i].join("") %>" class="btn btn-primary<% if(i==forminput.defaultToggled) { %> active<% } %>">',
                '<input type="radio" id="<%= [forminput.name,"-",i].join("") %>" value="<%= forminput.buttons[i].value %>" <% if(i==forminput.defaultToggled) { %>checked="checked"<% } %> /> <%= forminput.buttons[i].label %>',
            '</label>',
        '<% } %>',
            '</div>'
    ].join(''), {'variable':'forminput'}),
    
    /**
     * Returns the type of this Form Input Control
     * @public
     * @function type
     * @return {string} - the type of Form Input Control
     */
    'type':function() {
        return 'buttonGroup';
    },
    
    /**
     * Returns the name property of this Form Input Control
     * @public
     * @function name
     * @return {string} - the name property given to the constructor
     */
    'name':function() {
        return this.model.get('name');
    },
    
    /**
     * Returns the value of the form input.
     * This is where the valueOnly property in the data configuration comes into 
     * play. When true, the value returned from .get() is only the value from the
     * input control. e.g. f.get() would return 1, or 'foo'. Where when valueOnly 
     * is false, or doesn't exists (default), the value returned from .get() is
     * an object with the data configuration name property as the key and the 
     * input control value as the value, e.g. f.get() = {"foo":1}
     * 
     * @public
     * @function get
     * @return {object} - return value will be an object
     */
    'get':function() {
        var returnValue = {};
        if(this.model.get('valueOnly')) {
            returnValue = $('label.active input', this.$el).val();
        } else {
            returnValue[this.model.get('name')] = $('label.active input', this.$el).val();
        }
        return returnValue;
    },
    
    /**
     * Sets the value of the form input.
     * @public
     * @function set
     * @param {object} data - object from the datatable row for this data field
     * @param {string} valueKey - the key for the data object that would return a value placed in the input's "value" attribute
     */
    'set':function(data) {
        $('label.btn', this.$el).removeClass('active');
        $(['input[value="',data[this.model.get('valueKey')],'"]'].join(''), this.$el).parent().addClass('active');
    },
    
    /**
     * Toggles the disabled state of anything in this view that can be interacted with
     * @public
     * @function toggleDisabled
     * @param {boolean} enabled - if true then the disabled state will be removed from any interactive elements, or added if false
     */
    'toggleDisabled':function(enabled) {
        this.model.set('disabled', !enabled);
        if(enabled) {
            $('div.btn-group label', this.$el).removeClass('disabled');
            $('input', this.$el).removeAttr('disabled');
        } else {
            $('div.btn-group label', this.$el).addClass('disabled');
            $('input', this.$el).attr('disabled', 'disabled');
        }
    },
    
    /**
     * Toggles the readonly state of anything in this view that can be interacted with
     * @public
     * @function toggleReadonly
     * @param {boolean} isReadonly - 
     */
    'toggleReadonly':function(isReadonly) {
        this.model.set('readonly', isReadonly);
        if(isReadonly) {
            $('div.btn-group label', this.$el).addClass('disabled');
            $('input', this.$el).attr('disabled', 'disabled');
        } else {
            $('div.btn-group label', this.$el).removeClass('disabled');
            $('input', this.$el).removeAttr('disabled');
        }
    },
    
    /**
     * Checks this Form Input Control value for minimal validation requirements.
     * This particular Form Input Control will always validate so feedback status does not exist.
     * @public
     * @function validate
     * @return ({object|false})
     */
    'validate':function() {
        this.$el.addClass('has-success');
        return this.get();
    },
    
    /**
     * resets the form elements to their initial value
     * @public
     * @function reset
     * @return {ButtonGroupToggleFormInput} - this instance
     */
    'reset':function() {
        // it's easier just to re-render
        this.render();
        return this;
    },
    
    /**
     * 
     * @member {object} events - event handler functions for this View
     * 
     */
    'events':{},
    
    'className':'form-group input-form-control',
    
    /**
     * Button group toggle input form control, this will create an instance of ButtonGroupToggleFormInput
     * @typedef {Backbone-View} ButtonGroupToggleFormInput
     * @class
     * @classdesc This form control is for a value that belongs to a small set of options.
     * @version 1.0.3
     * @constructs ButtonGroupToggleFormInput
     * @extends Backbone-View 
     * @param {object}             options - configuration options for this View instance
     * @param {string}             options.name - the value to assign the name attribute on the input
     * @param {string}             options.label - the display label for the form input
     * @param {array}              options.buttons - an array of objects used to populate the button group, each item in the array should have this form: {label: , value: }
     * @param {string}             options.valueKey - a string that will be used in the .set() function to get the named value from the data object
     * @param {boolean}            [options.valueOnly=false] - when true then .get() will only return the value and not the datasource object
     * @param {object}             [options.inputAttributes={autocomplete:'off'}] - the attributes for the input elements
     * @param {number}             [options.defaultToggled=0] - the index in the buttons array that should be toggled by default
     * @param {boolean}            [options.disabled=false] - if true then the form control is initially put into a disabled state
     * @param {boolean}            [options.readonly=false] - if true then the form control is initially put into a readonly state, note if the disabled option is true, then that takes priority
     * @param {string}             [options.buttonGroupSize] - the bootstrap button group size css class
     * @param {LAYOUT_ORIENTATION} [options.orientation=$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL] - the type of layout style for the form input
     * @param {object}             [options.events] - an object with event signatures as keys and the handler function as the value
     */
    'initialize':function(options) {
        this.version = '1.0.3';
        
        this.model = new Backbone.Model(
            $.extend(true, {
                'name':'button-group-field',
                'label':'Unknown Button Group',
                'valueKey':'',
                'inputAttributes':{'autocomplete':'off'},
                'buttons':[],
                'defaultToggled':0,
                'disabled':false,
                'readonly':false,
                'buttonGroupSize':null,
                'orientation':$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL
            }, options)
        );
        
        this.$el.addClass('dtview-form-'+this.model.get('name'));
        
        this.render();
    },
    
    /**
     * @private
     * @function render
     */
    'render':function() {
        this.$el.empty().removeClass('has-success').append(this.template(this.model.toJSON()));
        $('input', this.$el).attr(this.model.get('inputAttributes'));
        if(this.model.get('required')) {
            $('label.control-label', this.$el).addClass('text-danger');
        }
        if(this.model.get('disabled') || this.model.get('readonly')) {
            $('div.btn-group label', this.$el).addClass('disabled');
            $('input', this.$el).attr('disabled', 'disabled');
        }
        return this.$el;
    }
});
var SelectFormInput = Backbone.View.extend(
/** @lends SelectFormInput.prototype */
{
    /**
     * @member {object} template - used to render this View
     * @private
     */
    'template':_.template([
        '<label for="<%= forminput.name %>" class="control-label text-nowrap col-sm-<% if(forminput.orientation==$.fn.DataTableView.LAYOUT_ORIENTATION.VERTICAL) { %>12 text-left-force<% } else { %>2<% } %>">',
            '<%= forminput.label %>',
        '</label>',
        '<div class="col-xs-<%= forminput.selectSize %>">',
            '<select class="form-control">',
            '<% for(var i in forminput.options) { %>',
                '<option value="<%= forminput.options[i].value %>"<% if(i===forminput.defaultSelected) { %> selected="selected"<% } %>">',
                    '<%= forminput.options[i].label %>',
                '</option>',
            '<% } %>',
            '</select>',
        '</div>'
    ].join(''), {'variable':'forminput'}),
    
    /**
     * Returns the type of this Form Input Control
     * @public
     * @function type
     * @return {string} - the type of Form Input Control
     */
    'type':function() {
        return 'select';
    },
    
    /**
     * Returns the name property of this Form Input Control
     * @public
     * @function name
     * @return {string} - the name property given to the constructor
     */
    'name':function() {
        return this.model.get('name');
    },
    
    /**
     * Returns the value of the form input in the form of an object.
     * @pulic
     * @function get
     * @return {object} - return value will be an object
     */
    'get':function() {
        var returnValue = {};
        returnValue[this.model.get('name')] = $('select', this.$el).val();
        return returnValue;
    },
    
    /**
     * Sets the value of the form input.
     * @public
     * @function set
     * @param {object} data - object from the datatable row for this data field
     * @param {string} valueKey - the key for the data object that would return a value placed in the input's "value" attribute
     */
    'set':function(data) {
        $('select', this.$el).val(data[this.model.get('valueKey')]);
    },
    
    /**
     * Toggles the disabled state of anything in this view that can be interacted with
     * @public
     * @function toggleDisabled
     * @param {boolean} enabled - if true then the disabled state will be removed from any interactive elements, or added if false
     */
    'toggleDisabled':function(enabled) {
        this.model.set('disabled', !enabled);
        if(enabled) {
            $('select', this.$el).removeAttr('disabled');
        } else {
            $('select', this.$el).attr('disabled', 'disabled');
        }
    },
    
    /**
     * Toggles the readonly state of anything in this view that can be interacted with
     * @public
     * @function toggleReadonly
     * @param {boolean} isReadonly - 
     */
    'toggleReadonly':function(isReadonly) {
        this.model.set('readonly', isReadonly);
        if(isReadonly) {
            $('select', this.$el).attr('disabled', 'disabled');
        } else {
            $('select', this.$el).removeAttr('disabled');
        }
    },
    
    /**
     * Checks this Form Input Control value for minimal validation requirements.
     * This particular Form Input Control will always validate so feedback status does not exist.
     * @public
     * @function validate
     * @return ({object|false})
     */
    'validate':function() {
        this.$el.addClass('has-success');
        return this.get();
    },
    
    /**
     * resets the form elements to their initial value
     * @public
     * @function reset
     * @return {SelectFormInput} - this instance
     */
    'reset':function() {
        // it's easier just to re-render
        this.render();
        return this;
    },
    
    'className':'form-group input-form-control',
    
    /**
     * Button group toggle input form control, this will create an instance of SelectFormInput
     * @typedef {Backbone-View} SelectFormInput
     * @class
     * @classdesc This form control is for value that belongs to a medium set of options.
     * @version 1.0.1
     * @constructs SelectFormInput
     * @extends Backbone-View 
     * @param {object}             options - configuration options for this View instance
     * @param {string}             options.name - the value to assign the name attribute on the input
     * @param {string}             options.label - the display label for the form input
     * @param {array}              options.options - an array of objects used to populate the button group, each item in the array should have this form: {label: , value: }
     * @param {string}             options.valueKey - a string that will be used in the .set() function to get the named value from the data object
     * @param {boolean}            [options.required=false] - if the form input is required or not
     * @param {object}             [options.inputAttributes={autocomplete:'off'}] - the attributes for the select element
     * @param {boolean}            [options.disabled=false] - if true then the form control is initially put into a disabled state
     * @param {boolean}            [options.readonly=false] - if true then the form control is initially put into a readonly state, note if the disabled option is true, then that takes priority
     * @param {number}             [options.defaultSelected=0] - the index in the options array that should be toggled by default
     * @param {number}             [options.selectSize=6] - A number between 1 and 12 that will appended to the css class as a bootstrap "col-xs-*" class.
     * @param {LAYOUT_ORIENTATION} [options.orientation=$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL] - the type of layout style for the form input
     * @param {object}             [options.events] - an object with event signatures as keys and the handler function as the value
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        
        this.model = new Backbone.Model(
            $.extend(true, {
                'name':'select-field',
                'label':'Unknown Select',
                'valueKey':'',
                'required':false,
                'disabled':false,
                'readonly':false,
                'inputAttributes':{'autocomplete':'off'},
                'options':[],
                'defaultSelected':0,
                'selectSize':6,
                'orientation':$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL
            }, options)
        );
        
        this.$el.addClass('dtview-form-'+this.model.get('name'));
        
        if(!_.isFinite(this.model.get('selectSize')) || this.model.get('selectSize')<1 || this.model.get('selectSize')>12) {
            this.model.set('selectSize', 6);
        }
        
        this.render();
    },
    
    /**
     * @private
     * @function render
     */
    'render':function() {
        this.$el.empty().removeClass('has-success').append(this.template(this.model.toJSON()));
        $('select', this.$el).attr(this.model.get('inputAttributes'));
        if(this.model.get('required')) {
            $('label', this.$el).addClass('text-danger');
            $('select', this.$el).attr({'required':'required'});
        }
        if(this.model.get('disabled') || this.model.get('readonly')) {
            $('select', this.$el).attr('disabled', 'disabled');
        }
        return this.$el;
    }
});
var NumberFormInput = Backbone.View.extend(
/** @lends NumberFormInput.prototype */
{
    /**
     * @member {object} template - used to render this View
     * @private
     * @todo implement a style option [vertical/horizontal] defaults to vertical
     */
    'template':_.template([
        '<label for="<%= forminput.name %>" class="control-label text-nowrap col-sm-<% if(forminput.orientation==$.fn.DataTableView.LAYOUT_ORIENTATION.VERTICAL) { %>12 text-left-force<% } else { %>2<% } %>">',
            '<%= forminput.label %>',
        '</label>',
        '<% if(forminput.orientation===$.fn.DataTableView.LAYOUT_ORIENTATION.VERTICAL) { %><div class="col-sm-12"><% } else { %><div class="col-sm-10"><% } %>',
            '<div id="spinbox-formcontrol-<%= forminput.name %>" class="spinbox" data-initialize="spinbox">',
                '<input type="text" id="<%= forminput.name %>" />',
                '<div class="spinbox-buttons btn-group btn-group-vertical">',
                    '<button type="button" class="btn btn-default spinbox-up btn-xs">',
                        '<span class="glyphicon glyphicon-chevron-up"></span><span class="sr-only">Increase</span>',
                    '</button>',
                    '<button type="button" class="btn btn-default spinbox-down btn-xs">',
                        '<span class="glyphicon glyphicon-chevron-down"></span><span class="sr-only">Decrease</span>',
                    '</button>',
                '</div>',
            '</div>',
        '</div>'
    ].join(''), {'variable':'forminput'}),
    
    /**
     * Returns the type of this Form Input Control
     * @public
     * @function type
     * @return {string} - the type of Form Input Control
     */
    'type':function() {
        return 'number';
    },
    
    /**
     * Returns the name property of this Form Input Control
     * @public
     * @function name
     * @return {string} - the name property given to the constructor
     */
    'name':function() {
        return this.model.get('name');
    },
    
    /**
     * Returns the value of the form input in the form of an object.
     * @pulic
     * @function get
     * @return {object} - return value will be an object
     */
    'get':function() {
        var returnValue = {}, n = $('div.spinbox', this.$el).spinbox('value');
        returnValue[this.model.get('name')] = _.isFinite(n) ? n*1 : undefined;
        return returnValue;
    },
    
    /**
     * Sets the value of the form input.
     * @public
     * @function set
     * @param {object} - data from the datatable row for this data field
     */
    'set':function(data) {
        if(_.isFinite(data)) {
            $('div.spinbox', this.$el).spinbox('value', data);
        }
    },
    
    /**
     * Toggles the disabled state of anything in this view that can be interacted with
     * @public
     * @function toggleDisabled
     * @param {boolean} enabled - if true then the disabled state will be removed from any interactive elements, or added if false
     */
    'toggleDisabled':function(enabled) {
        this.model.set('disabled', !enabled);
        if(enabled) {
            $('div.spinbox', this.$el).spinbox('enable');
        } else {
            $('div.spinbox', this.$el).spinbox('disable');
        }
    },
    
    /**
     * Toggles the readonly state of anything in this view that can be interacted with
     * @public
     * @function toggleReadonly
     * @param {boolean} isReadonly - 
     */
    'toggleReadonly':function(isReadonly) {
        this.model.set('readonly', isReadonly);
        if(isReadonly) {
            $('div.spinbox', this.$el).spinbox('disable');
        } else {
            $('div.spinbox', this.$el).spinbox('enable');
        }
    },
    
    /**
     * Checks this Form Input Control value for minimal validation requirements. 
     * If required==true then the validation check takes place and the value the this.get() is returned,
     * otherwise the value of this.get() is returned.
     * If the validation check fails and feedback==true then feedback status elements will display.
     * @public
     * @function validate
     * @return ({object|false})
     */
    'validate':function() {
        this.$el.removeClass('has-success has-error');
        
        var n = $('div.spinbox', this.$el).spinbox('value');
        if(this.model.get('required')) {
            if(_.isFinite(n)) {
                if(this.model.get('feedback')) {
                    // show success feedback status
                    this.$el.addClass('has-success');
                }
                return this.get();
            } else {
                if(this.model.get('feedback')) {
                    // show error feedback status
                    this.$el.addClass('has-error');
                }
            }
        } else {
            this.$el.addClass('has-success');
            return this.get();
        }
    },
    
    /**
     * resets the form elements to their initial value
     * @public
     * @function reset
     * @return {NumberFormInput} - this instance
     */
    'reset':function() {
        this.render();
        return this;
    },
    
    'className':'form-group input-form-control fuelux',
    
    /**
     * Number input form control, this will create an instance of NumberFormInput
     * @typedef {Backbone-View} NumberFormInput
     * @class
     * @classdesc This form control is for a number type value
     * @version 1.0.5
     * @constructs NumberFormInput
     * @extends Backbone-View
     * @param {object}             options - configuration options for this View instance
     * @param {string}             options.name - the value to assign the name attribute on the input
     * @param {string}             options.label - the display label for the form input
     * @param {object}             [options.inputAttributes={autocomplete:'off', class:'form-control input-mini spinbox-input'}] - the attributes for the form input element
     * @param {boolean}            [options.required=false] - if the form input is required or not
     * @param {boolean}            [options.feedback=true]  - if the bootstrap form input should have feedback elements
     * @param {boolean}            [options.disabled=false] - if true then the form control is initially put into a disabled state
     * @param {boolean}            [options.readonly=false] - if true then the form control is initially put into a readonly state, note if the disabled option is true, then that takes priority
     * @param {LAYOUT_ORIENTATION} [options.orientation=$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL] - the type of layout style for the form input
     * @param {object}             [options.spinboxConfig] - the configuration options for the spinbox control
     * @param {object}             [options.events] - an object with event signatures as keys and the handler function as the value
     */
    'initialize':function(options) {
        this.version = '1.0.5';
        
        //console.log(options);
        this.model = new Backbone.Model(
            $.extend(true, {
                'name':'number-field',
                'label':'Unknown Number Field',
                'inputAttributes':{'autocomplete':'off', 'class':'form-control input-mini spinbox-input'},
                'required':false,
                'feedback':true,
                'disabled':false,
                'readonly':false,
                'orientation':$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL,
                'spinboxConfig':{'value':1, 'min':1, 'max':999, 'step':1, 'hold':true, 'speed':'medium', 'disabled':false, 'units':[]}
            }, options)
        );
        
        this.$el.addClass('dtview-form-'+this.model.get('name'));
        
        if(this.model.get('feedback')) {
            this.$el.addClass('has-feedback');
        }
        
        /* according to the spinbox documentation:
         * Currently there is a bug causing changed events to fire twice for some elements. The workaround is to disable this data-api, using $.off('fu.data-api')
         */
        $('input', this.$el).off('fu.data-api');
        this.render();
    },
    
    /**
     * @private
     * @function render
     */
    'render':function() {
        this.$el.empty().removeClass('has-success has-error').removeClass('has-success has-error').append(this.template(this.model.toJSON()));
        $('input', this.$el).attr(this.model.get('inputAttributes'));
        if(this.model.get('required')) {
            $('label', this.$el).addClass('text-danger');
            $('input', this.$el).attr({'required':'required'});
        }
        if(this.model.get('disabled')) {
            $('div.spinbox', this.$el).spinbox('disable');
        } else if(this.model.get('readonly')) {
            $('div.spinbox', this.$el).spinbox('disable');
        }
        $(['spinbox-formcontrol-',this.model.get('name')].join(''), this.$el).spinbox(this.model.get('spinboxConfig'));
        return this.$el;
    }
});
var DatepickerFormInput = Backbone.View.extend(
/** @lends DatepickerFormInput.prototype */
{
    /**
     * @member {object} template - used to render this View
     * @private
     * @todo implement a style option [vertical/horizontal] defaults to vertical
     */
    'template':_.template([
        '<label for="<%= forminput.name %>" class="control-label text-nowrap col-sm-<% if(forminput.orientation==$.fn.DataTableView.LAYOUT_ORIENTATION.VERTICAL) { %>12 text-left-force<% } else { %>2<% } %>">',
            '<%= forminput.label %>',
        '</label>',
        '<div class="col-sm-<%= forminput.inputColumnSize %>">',
            '<input type="text" id="<%= forminput.name %>" />',
            '<% if(forminput.feedback) { %><span class="glyphicon form-control-feedback hidden"></span><% } %>',
        '</div>'
    ].join(''), {'variable':'forminput'}),
    
    /**
     * Returns the type of this Form Input Control
     * @public
     * @function type
     * @return {string} - the type of Form Input Control
     */
    'type':function() {
        return this.model.get('timestamp') ? 'timestamp' : 'datepicker';
    },
    
    /**
     * Returns the name property of this Form Input Control
     * @public
     * @function name
     * @return {string} - the name property given to the constructor
     */
    'name':function() {
        return this.model.get('name');
    },
    
    /**
     * Returns the value of the form input in the form of an object.
     * @pulic
     * @function get
     * @return {object} - return value will be an object
     */
    'get':function() {
        var returnValue = {};
        var d = $('input', this.$el).datepicker('getUTCDate');
        if(d) {
            returnValue[this.model.get('name')] = this.model.get('timestamp') ? 
                d.valueOf() : 
                d;
        } else {
            returnValue[this.model.get('name')] = undefined;
        }
        return returnValue;
    },
    
    /**
     * Sets the value of the form input.
     * @public
     * @function set
     * @param {object} - data from the datatable row for this data field
     */
    'set':function(data) {
        if(data) {
            var d;
            if(_.isFinite(data)) {
                d = moment.utc(data).toDate();
            } else if(_.isDate(data)) {
                d =  moment.utc([
                    data.getUTCFullYear(),
                    data.getUTCMonth(),
                    data.getUTCDate()
                ]).toDate();
            }
            $('input', this.$el).datepicker('setUTCDate', d);
        }
    },
    
    /**
     * Toggles the disabled state of anything in this view that can be interacted with
     * @public
     * @function toggleDisabled
     * @param {boolean} enabled - if true then the disabled state will be removed from any interactive elements, or added if false
     */
    'toggleDisabled':function(enabled) {
        this.model.set('disabled', !enabled);
        if(enabled) {
            $('input', this.$el).removeAttr('disabled');
        } else {
            $('input', this.$el).attr('disabled', 'disabled');
        }
    },
    
    /**
     * Toggles the readonly state of anything in this view that can be interacted with
     * @public
     * @function toggleReadonly
     * @param {boolean} isReadonly - 
     */
    'toggleReadonly':function(isReadonly) {
        this.model.set('readonly', isReadonly);
        if(isReadonly) {
            $('input', this.$el).attr('readonly', 'readonly');
        } else {
            $('input', this.$el).removeAttr('readonly');
        }
    },
    
    /**
     * Checks this Form Input Control value for minimal validation requirements. 
     * If required==true then the validation check takes place and the value the this.get() is returned,
     * otherwise the value of this.get() is returned.
     * If the validation check fails and feedback==true then feedback status elements will display.
     * @public
     * @function validate
     * @return ({object|false})
     */
    'validate':function() {
        if(!this.model.get('readonly')) {
            this.$el.removeClass('has-success has-error');
            $('span.form-control-feedback', this.$el).removeClass('glyphicon-ok glyphicon-remove').addClass('hidden');
            
            var d = $('input', this.$el).datepicker('getUTCDate');
            if(this.model.get('required')) {
                if(d) {
                    if(this.model.get('feedback')) {
                        // show success feedback status
                        this.$el.addClass('has-success');
                        $('span.form-control-feedback', this.$el).addClass('glyphicon-ok').removeClass('hidden');
                    }
                    return this.get();
                } else {
                    if(this.model.get('feedback')) {
                        // show error feedback status
                        this.$el.addClass('has-error');
                        $('span.form-control-feedback', this.$el).addClass('glyphicon-remove').removeClass('hidden');
                    }
                }
            } else {
                this.$el.addClass('has-success');
                return this.get();
            }
        }
    },
    
    /**
     * resets the form elements to their initial value
     * @public
     * @function reset
     * @return {DatepickerFormInput} - this instance
     */
    'reset':function() {
        this.render();
        return this;
    },
    
    
    'events':{},
    
    'className':'form-group input-form-control',
    
    /**
     * Datepicker form control, this will create an instance of DatepickerFormInput
     * @typedef {Backbone-View} DatepickerFormInput
     * @class
     * @classdesc This form control is for selecting date values.
     * @version 1.0.1
     * @constructs DatepickerFormInput
     * @extends Backbone-View
     * @param {object}             options                 - configuration options for this View instance
     * @param {string}             options.name            - the value to assign the name attribute on the input
     * @param {string}             options.label           - the display label for the form input
     * @param {object}             [options.inputAttributes={autocomplete:'off', class:'form-control', value:''}] - the attributes for the form input element
     * @param {boolean}            [options.required=false] - if the form input is required or not
     * @param {boolean}            [options.feedback=true]  - if the bootstrap form input should have feedback elements
     * @param {boolean}            [options.disabled=false] - if true then the form control is initially put into a disabled state
     * @param {boolean}            [options.readonly=false] - if true then the form control is initially put into a readonly and disabled state
     * @param {boolean}            [options.timestamp=false] - if true then the get/set functions expect/return a numeric timestamp value
     * @param {LAYOUT_ORIENTATION} [options.orientation=$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL] - the type of layout style for the form input
     * @param {number}             [options.inputColumnSize=4] - a number between 1 and 12 that will appended to the css class as a bootstrap "col-xs-*" class
     * @param {object}             [options.datepickerConfig={autoclose:true, format:'m/d/yyyy'}] - the configuration options for the datepicker control
     * @param {object}             [options.events] - an object with event signatures as keys and the handler function as the value
     * @todo implement a "defaultValue" option
     * @todo implement a "dateString" (boolean) option which would then require a "dateStringFormat" (string) option
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        
        this.model = new Backbone.Model(
            $.extend(true, {
                'name':'datepicker-field',
                'label':'Unknown Datepicker Field',
                'inputAttributes':{'autocomplete':'off', 'class':'form-control', 'value':''},
                'required':false,
                'feedback':true,
                'disabled':false,
                'readonly':false,
                'timestamp':false,
                'orientation':$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL,
                'inputColumnSize':4,
                'datepickerConfig':{'autoclose':true, 'format':'m/d/yyyy'}
            }, options)
        );
        
        this.$el.addClass('dtview-form-'+this.model.get('name'));
        
        if(this.model.get('feedback')) {
            this.$el.addClass('has-feedback');
        }
        
        // if the inputColumSize given is not a number or out of range
        if(!_.isFinite(this.model.get('inputColumnSize')) || this.model.get('inputColumnSize')<1 || this.model.get('inputColumnSize')>12) {
            this.model.set('inputColumnSize', 4);
        }
        
        if(this.model.get('events')) {
            for(var i in this.model.get('events')) {
                this.on(i, this.model.get('events')[i]);
            }
        }
        
        this.render();
    },
    
    /**
     * @private
     * @function render
     */
    'render':function() {
        this.$el.empty().removeClass('has-success has-error').append(this.template(this.model.toJSON()));
        $('input', this.$el).attr(this.model.get('inputAttributes'));
        if(this.model.get('required')) {
            $('label', this.$el).addClass('text-danger');
            $('input', this.$el).attr({'required':'required'});
        }
        if(this.model.get('disabled')) {
            $('input', this.$el).attr('disabled', 'disabled');
        } else if(this.model.get('readonly')) {
            $('input', this.$el).attr({'readonly':'readonly', 'disabled':'disabled'});
        }
        $('input', this.$el).datepicker(this.model.get('datepickerConfig'));
        return this.$el;
    }
});
var TypeaheadFormInput = Backbone.View.extend(
/** @lends TypeaheadFormInput.prototype */
{
    /**
     * @member {object} template - used to render this View
     * @private
     */
    'template':_.template([
        '<label for="<%= forminput.name %>" class="control-label text-nowrap col-sm-<% if(forminput.orientation==$.fn.DataTableView.LAYOUT_ORIENTATION.VERTICAL) { %>12 text-left-force<% } else { %>2<% } %>">',
            '<%= forminput.label %>',
        '</label>',
        '<% if(forminput.orientation==$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL) { %><div class="col-sm-10"><% } else { %><div class="col-sm-12"><% } %>',
            '<div class="tt-dropdown-menu form-group input-form-control">',
                '<div class="input-group">',
                    '<div class="tt-dropdown-menu">',
                        '<input type="text" id="<%= forminput.name %>" />',
                    '</div>',
                    '<span class="input-group-btn">',
                        '<button type="button" class="btn btn-default btn-danger" disabled="disabled" style="height:34px;margin-top:-5px">',
                            '<span class="glyphicon glyphicon-remove"></span><span class="sr-only">reset</span>',
                        '</button>',
                    '</span>',
                '</div>',
            '</div>',
        '</div>'
    ].join(''), {'variable':'forminput'}),
    
    /**
     * Uses the displayer model value to return a string value of the passed item.
     * @function displayItem
     * @private
     * @param {object} item - the item from the typeahead suggestion or this view
     * @return {string} A string representation of the object parameter
     */
    'displayItem':function(item) {
        return typeof(this.model.get('displayer'))==='string' ? item[this.model.get('displayer')] : this.model.get('displayer')(item);
    },
    
    /**
     * Returns the type of this Form Input Control
     * @public
     * @function type
     * @return {string} - the type of Form Input Control
     */
    'type':function() {
        return 'typeahead';
    },
    
    /**
     * Returns the name property of this Form Input Control
     * @public
     * @function name
     * @return {string} - the name property given to the constructor
     */
    'name':function() {
        return this.model.get('name');
    },
    
    /**
     * Returns the value of the form input in the form of an object.
     * @pulic
     * @function get
     * @return {object} - return value will be an object
     */
    'get':function() {
        var returnValue = {};
        returnValue[this.model.get('name')] =  this.model.get('selectedItem');
        return returnValue;
    },
    
    /**
     * Sets the value of the form input.
     * @public
     * @function set
     * @param {object} - data from the datatable row for this data field
     */
    'set':function(data) {
        this.model.set('selectedItem', data);
        $('input', this.$el).typeahead('val', this.displayItem(data));
    },
    
    /**
     * Toggles the disabled state of anything in this view that can be interacted with
     * @public
     * @function toggleDisabled
     * @param {boolean} enabled - if true then the disabled state will be removed from any interactive elements, or added if false
     */
    'toggleDisabled':function(enabled) {
        this.model.set('disabled', !enabled);
        if(enabled) {
            $('input, button', this.$el).removeAttr('disabled');
        } else {
            $('input, button', this.$el).attr('disabled', 'disabled');
        }
    },
    
    /**
     * Toggles the readonly state of anything in this view that can be interacted with
     * @public
     * @function toggleReadonly
     * @param {boolean} isReadonly - 
     */
    'toggleReadonly':function(isReadonly) {
        this.model.set('readonly', isReadonly);
        if(isReadonly) {
            $('input, button', this.$el).attr('readonly', 'readonly');
        } else {
            $('input, button', this.$el).removeAttr('readonly');
        }
    },
    
    /**
     * Checks this Form Input Control value for minimal validation requirements. 
     * If required==true then the validation check takes place and the value the this.get() is returned,
     * otherwise the value of this.get() is returned.
     * If the validation check fails and feedback==true then feedback status elements will display.
     * @public
     * @function validate
     * @return ({object|false})
     */
    'validate':function() {
        this.$el.removeClass('has-success has-error');
        
        if(this.model.get('required')) {
            if($.trim($('input', this.$el).val()).length>0) {
                if(this.model.get('feedback')) {
                    // show success feedback status
                    this.$el.addClass('has-success');
                }
                return this.get();
            } else {
                if(this.model.get('feedback')) {
                    // show error feedback status
                    this.$el.addClass('has-error');
                }
            }
        } else {
            this.$el.addClass('has-success');
            return this.get();
        }
    },
    
    /**
     * resets the form elements to their initial value
     * @public
     * @function reset
     * @return {TypeaheadFormInput} - this instance
     */
    'reset':function() {
        this.render();
        return this;
    },
    
    'events':{
        'typeahead:select':function(e, suggestion) {
            // select is when the suggestion is selected either by mouse click or hitting "enter"
            this.model.set('selectedItem', suggestion);
        },
        'typeahead:autocomplete':function(e, suggestion) {
            // autocomplete is when a suggestion is chosen via a keystroke such as arrow key or tab
            this.model.set('selectedItem', suggestion);
        },
        'typeahead:change':function(e) {
            if(this.model.get('selectedItem')) {
                $('input', this.$el).typeahead('val', this.displayItem(this.model.get('selectedItem')));
            }
        },
        'typeahead:idle':function(e) {
            if(this.model.get('selectedItem')) {
                $('input', this.$el).typeahead('val', this.displayItem(this.model.get('selectedItem')));
            }
        },
        'click button':function(e) {
            this.reset();
        }
    },
    
    'className':'form-group input-form-control',
    
    /**
     * Typeahead form control, this will create an instance of TypeaheadFormInput
     * @typedef {Backbone-View} TypeaheadFormInput
     * @class
     * @classdesc This Form Input Control is for a typeahead (autocomplet in jQueryUI) input type.
     * @version 1.0.1
     * @constructs TypeaheadFormInput
     * @extends Backbone-View
     * @param {object}             options                 - configuration options for this View instance
     * @param {string}             options.name            - the value to assign the name attribute on the input
     * @param {string}             options.label           - the display label for the form input
     * @param {object}             options.datasets        - the dataset or datasets to pass to the typeahead constructor
     * @param {string}             [options.extraClass=null] - addition css class to add to this.$el
     * @param {object}             [options.inputAttributes={autocomplete:'off', data-provide:'typeahead', class:'form-control typeahead', value:''}] - the attributes for the form input element
     * @param {boolean}            [options.required=false] - if the form input is required or not
     * @param {boolean}            [options.feedback=true]  - if the bootstrap form input should have feedback elements
     * @param {boolean}            [options.disabled=false] - if true then the form control is initially put into a disabled state
     * @param {boolean}            [options.readonly=false] - if true then the form control is initially put into a readonly state, note if the disabled option is set to true then that state will take priority
     * @param {LAYOUT_ORIENTATION} [options.orientation=$.fn.DataTableView.LAYOUT_ORIENTATION.VERTICAL] - the type of layout style for the form input
     * @param {object}             [options.typeaheadConfigOptions={highlight:false, hint:false, minLength:3}] - typeahead configuration object
     * @param {object}             [options.events] - an object with event signatures as keys and the handler function as the value
     * @todo implement a "displayItem" option that would be used instead of the options.datasets.displayKey property
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        
        this.model = new Backbone.Model(
            $.extend(true, {
                'name':'typeahead-field',
                'label':'Unknown Typeahead Field',
                'extraClass':null,
                'inputAttributes':{'autocomplete':'off', 'data-provide':'typeahead', 'class':'form-control typeahead', 'value':''},
                'required':false,
                'feedback':true,
                'disabled':false,
                'readonly':false,
                'orientation':$.fn.DataTableView.LAYOUT_ORIENTATION.HORIZONTAL,
                'typeaheadConfigOptions':{'highlight':false, 'hint':false, 'minLength':3}
            }, options, {'selectedItem':undefined, 'displayer':options.datasets.displayKey})
        );
        
        this.$el.addClass('dtview-form-'+this.model.get('name'));
        
        if(this.model.get('feedback')) {
            this.$el.addClass('has-feedback');
        }
        
        // when the evaluator changes update the reset button based on if an evaluator exists
        this.model.on('change:selectedItem', function(newModel, value, options) {
            if(!this.model.get('disabled') && !this.model.get('readonly')) {
                if(value && value.id!==1) {
                    $('button', this.$el).removeAttr('disabled');
                } else {
                    $('button', this.$el).attr('disabled', 'disabled');
                }
            }
        }, this);
        
        if(this.model.get('extraClass')) {
            this.$el.addClass(this.model.get('extraClass'));
        }
        
        this.render();
    },
    
    /**
     * @private
     * @function render
     */
    'render':function() {
        this.$el.empty().removeClass('has-success has-error').append(this.template(this.model.toJSON()));
        $('input', this.$el).attr(this.model.get('inputAttributes'));
        if(this.model.get('required')) {
            $('label', this.$el).addClass('text-danger');
            $('input', this.$el).attr({'required':'required'});
        }
        if(this.model.get('disabled')) {
            $('input, button', this.$el).attr('disabled', 'disabled');
        } else if(this.model.get('readonly')) {
            $('input, button', this.$el).attr({'readonly':'readonly', 'disabled':'disabled'});
        }
        $('input.typeahead', this.$el).typeahead(this.model.get('typeaheadConfigOptions'), this.model.get('datasets'));
        this.model.set('selectedItem', undefined);
        return this.$el;
    }
});
var ActionProgressPanel = Backbone.View.extend(
/** @lends ActionProgressPanel.prototype */
{
    'template':_.template(template_app_view, {'variable':'config'}),
    
    'toggle':function(visible) {
        this.$el.toggle(visible);
        return this;
    },
    
    'updateLabel':function(newLabel) {
        $('div.progress-bar span', this.$el).empty().append(newLabel);
        return this;
    },
    
    'updateProgress':function(newValue) {
        if(_.isFinite(newValue) && newValue<=this.model.get('max')) {
            var v = [newValue,'%'].join('');
            // update attributes: aria-valuenow, style.width
            $('div.progress-bar', this.$el).attr({'aria-valuenow':newValue, 'style':['width',v].join(':')});
            
            // update div.progress-bar span innerHtml
            $('div.progress-bar span').empty().html(v);
        }
        return this;
    },
    
    'updateMessage':function(newContent) {
        $('div.panel-body', this.$el).empty().append(newContent);
        return this;
    },
    
    'reset':function() {
        this.render();
        return this;
    },
    
    'events':{
        
    },
    
    'className':'panel action-progress-panel',
    
    /**
     * ActionProgressPanel View
     * This Backbone view contains a panel with a bootstrap progress bar component in the header.
     * @typedef {Backbone-View} ActionProgressPanel
     * @class
     * @classdesc This view is constructed from the parent ModalForm. It is for showing a progress bar during ajax transmissions and displaying errors.
     * @version 1.0.1
     * @constructs ActionProgressPanel
     * @extends Backbone-View
     * @param {object}             options - configuration options for this View instance
     * @param {object}             [options.progressAttributes={class:"progress-bar progress-bar-striped active", role:"progressbar", style:"width:100%"}] - the default attributes for the bootstrap progressbar div
     * @param {string}             [options.errorMessage='Processing errors'] - the default error message
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        this.model = new Backbone.Model({
            'progressAttributes':{
                'class':'progress-bar progress-bar-striped active',
                'role':'progressbar',
                'style':'width:100%'
            },
            'label':'',
            'defaultValue':100,
            'min':0,
            'max':100,
            'errorMessage':''
        });
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        return this.$el;
    }
});

var DatatableColumnVisibilityControl = Backbone.View.extend(
/** @lends DatatableColumnVisibilityControl.prototype */
{
    'template_nogroups':_.template(template_cvc_noGroups, {'variable':'config'}),
    'template_groups':_.template(template_cvc_groups, {'variable':'config'}),
    
    'events':{
        // CLICK AND CHANGE EVENTS FOR COLUMN VISIBILITY CONTROL
        'click ul.dropdown-menu input, ul.dropdown-menu label':function(e) {
            // just stop the event from bubbling so the dropdown-menu will stay on screen
            e.stopPropagation();
        },
        'change ul.dropdown-menu input':function(e) {
            //this.datatable.columns(e.currentTarget.value*1).visible(e.currentTarget.checked);
            this.trigger('columnVisibilityControl.column.change', e.currentTarget.value*1, e.currentTarget.checked);
            e.stopPropagation();
            return false;
        },
        'click ul.dropdown-menu button':function(e) {
            var groupIndex = $(e.currentTarget).data('group-index')*1,
                gcolumns = groupIndex<0 ? this.model.get('default') : this.model.get('groups')[$(e.currentTarget).data('group-index')].columns;
            
            $('div.checkbox input', this.$el).each(function(i) {
                this.checked = ( _.indexOf(gcolumns, $(this).data('column')) > -1);
            });
            
            this.trigger('columnVisibilityControl.group.change', _.pluck(_.pick(this.model.get('columns'), gcolumns), 'index'));
            
            e.stopPropagation();
        }
    },
    
    'className':'btn-group',
    
    /**
     * This View controls the visibility properties of DataTable columns.
     * @typedef {Backbone-View} DatatableColumnVisibilityControl
     * @class
     * @classdesc A UI control to manage a collection on/off properties. In this 
     * case a series of visibility booleans from DataTable columns.
     * @version 1.0.1
     * @constructs DatatableColumnVisibilityControl
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * All of the values except for the <em>class</em> property are passed to 
     * this view's <code>model<code> constructor.
     * @param {object} options.columns - This is expected to be an object where 
     * each property key is the "data" value in the datatable columns config.
     * The value of each property is expected to have these properties:<br />
     * <ul>
     *     <li><strong>index</strong> - original index of column from datatable columns</li>
     *     <li><strong>data</strong> - the name of the column key</li>
     *     <li><strong>title</strong> - the descriptive label for the column</li>
     *     <li><strong>visible</strong> - a boolean for visibility</li>
     * </ul>
     * @param {object[]} [groups] - An object array where each object has a 
     * <em>name</em> and <em>columns</em> properties.
     * @param {string[]} [default] - An array of column names that are visible 
     * by default. It's best to leave this parameter alone.
     * @param {number} [options.widthOverride] - The width of the group of 
     * button switches for each of the columns. Increasing this number allows 
     * more buttons per horizontal row, saving vertical space.
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        var config = $.extend(true, 
            {
                'columns':{}, 
                'default':[], 
                'groups':[]
            }, 
            _.omit(options, ['class']),
            {
                // a sorted version of columns
                'sorted':_.sortBy(options.columns, 'index')
            }
        );
        
        // a class can be added to this.$el
        if(_.has(options, 'class')) {
            this.$el.addClass(options['class']);
        }
        
        // check if a default was provided
        if(config['default'].length<1) {
            config['default'] = _.pluck(_.filter(config.sorted, function(c) {
                return (_.has(c,'visible') && c.visible)
            }), 'data');
        }
        
        this.model = new Backbone.Model(config);
    },
    
    'render':function() {
        return this.$el.append(
            this.model.get('groups').length ? 
                this.template_groups(this.model.toJSON()) : 
                this.template_nogroups(this.model.toJSON())
            );
    }
});
var FormNavigation = Backbone.View.extend(
/** @lends FormNavigation.prototype */
{
    'show':function() {
        this.$el.show();
        return this;
    },
    'hide':function() {
        this.$el.hide();
        return this;
    },
    'toggle':function(visible) {
        this.$el.toggle(visible);
        return this;
    },
    'isVisible':function() {
        return this.$el.is(':visible');
    },
    
    'enable':function() {
        $('button', this.$el).removeAttr('disabled');
    },
    'disable':function() {
        $('button', this.$el).attr('disabled', 'disabled');
    },
    
    'update':function(newIndex) {
        this.model.set('currentIndex', newIndex);
    },
    
    'template':_.template(template_fnv_view),
    
    'events':{
        'click button':function(e) {
            switch($(e.currentTarget).data('nav-button')) {
            case 'first':
                this.model.set('currentIndex', 0);
                break;
            case 'previous':
                this.model.set('currentIndex', this.model.get('currentIndex')-1);
                break;
            case 'next':
                this.model.set('currentIndex', this.model.get('currentIndex')+1);
                break;
            case 'last':
                this.model.set('currentIndex', this.model.get('length')-1);
                break;
            }
            
            this.$el.trigger('formnav.nav.click', [this, this.model.get('currentIndex')]);
        }
    },
    
    'className':'datatable-page-form-navigation-group',
    
    /**
     * FormNavigation View
     * This Backbone view consists of four buttons: (first, previous, next, and last).
     * @typedef {Backbone-View} FormNavigation
     * @class
     * @classdesc This view is constructed from the parent DataTableView
     * @version 1.0.1
     * @constructs FormNavigation
     * @extends Backbone-View
     * @param {object}              options - configuration options for this View instance
     * @param {number}             [options.currentIndex=0] - the current index in the array of items this navigation control is monitoring
     * @param {number}             [options.length=0] - the total number of item in the array of items this navigation control is monitoring
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        this.model = new Backbone.Model({
            'currentIndex':0, 
            'length':0
        });
        this.model.on('change', this.render, this);
    },
    
    'render':function(newModel, options) {
        this.$el.empty().append(this.template({}));
        /*
         * need to disable buttons
         * if data.length == 0 then disable all
         * if data.length > 0 and index == 0 then disable first, prev
         * if data.length > 0 and index == (data.length-1) then disable last, next
         */
        if(this.model.get('length')) {
            if(this.model.get('currentIndex')==0) {
                $('button[data-nav-button="first"]', this.$el).attr('disabled', 'disabled');
                $('button[data-nav-button="previous"]', this.$el).attr('disabled', 'disabled');
            }
            
            if(this.model.get('currentIndex')==(this.model.get('length')-1)) {
                $('button[data-nav-button="last"]', this.$el).attr('disabled', 'disabled');
                $('button[data-nav-button="next"]', this.$el).attr('disabled', 'disabled');
            }
            
        } else {
            $('button', this.$el).attr('disabled', 'disabled');
        }
    }
});

var ModalForm = Backbone.View.extend(
/** @lends ModalForm.prototype */
{
    'template':_.template(template_mfv_view, {'variable':'config'}),
    
    'get':function(key) {
        return this.model.get(key);
    },
    
    /**
     * functions
     */
    'show':function() {
        this.$el.modal('show');
        return this;
    },
    'hide':function() {
        this.$el.modal('hide');
        return this;
    },
    
    'displaysNavigation':function() {
        return this.model.get('showNavigation');
    },
    
    'updateTitle':function(title) {
        $('h4.modal-title', this.$el).html(title);
        return this;
    },
    
    'getActionType':function() {
        return this.model.get('actionType');
    },
    'setActionType':function(type) {
        this.model.set('actionType', type);
        return this;
    },
    
    'updateActionButtonTitle':function(label) {
        $('button.dtview-modal-form-action-button', this.$el).html(label);
        return this;
    },
    
    'toggleNavigation':function(visible) {
        if(this.model.get('showNavigation')) {
            this.model.get('headerNav').toggle(visible);
            this.model.get('footerNav').toggle(visible);
        }
        return this;
    },
    
    'toggleActionPanel':function(visible, label, message) {
        this.model.get('actionPanel').toggle(visible);
        if(visible) {
            this.toggleForm(false);
            // disable nav buttons if they are visible
            if(this.model.get('showNavigation')) {
                if(this.model.get('headerNav').isVisible()) {
                    this.model.get('headerNav').disable();
                }
                if(this.model.get('footerNav').isVisible()) {
                    this.model.get('footerNav').disable();
                }
            }
            if(label) {
                this.model.get('actionPanel').updateLabel(label);
            } else {
                this.model.get('actionPanel').updateLabel('');
            }
            if(message) {
                this.model.get('actionPanel').updateMessage(message);
            } else {
                this.model.get('actionPanel').updateMessage('');
            }
            $('div.modal-footer button.dtview-modal-form-action-button', this.$el).hide();
            $('div.modal-content', this.$el)[0].scrollIntoView({'behavior':'smooth', 'block':'start'});
        }
        return this;
    },
    
    'updateActionLabel':function(newLabel) {
        this.model.get('actionPanel').updateLabel(newLabel);
        return this;
    },
    
    'updateActionMessage':function(newMessage) {
        this.model.get('actionPanel').updateMessage(newMessage);
        return this;
    },
    
    
    'toggleForm':function(visible) {
        $('div.dtview-form-container', this.$el).toggle(visible);
        if(visible) {
            // enable nav buttons if they are visible
            if(this.model.get('showNavigation')) {
                if(this.model.get('headerNav').isVisible()) {
                    this.model.get('headerNav').enable();
                }
                if(this.model.get('footerNav').isVisible()) {
                    this.model.get('footerNav').enable();
                }
            }
            $('div.modal-footer button.dtview-modal-form-action-button', this.$el).show();
            this.toggleActionPanel(false);
        }
        return this;
    },
    
    'updateNav':function(index, length) {
        if(this.model.get('showNavigation')) {
            this.model.get('headerNav').show().model.set({'currentIndex':index, 'length':length});
            this.model.get('footerNav').show().model.set({'currentIndex':index, 'length':length});
        }
        return this;
    },
    
    
    'events':{
        // when a novigation button is clicked
        'formnav.nav.click':function(e, nav, newIndex) {
            // update all other form navs
            if(nav.cid==this.model.get('headerNav').cid) {
                this.model.get('footerNav').update(newIndex);
            } else if(nav.cid==this.model.get('footerNav').cid) {
                this.model.get('headerNav').update(newIndex);
            }
            
            // call model.set('currentIndex', newIndex) on other DataTableFormNavigation
            this.$el.trigger('modalForm.nav.change', [this, newIndex]);
        },
        
        // when the form action button is clicked
        'click button.dtview-modal-form-action-button':function(e) {
            // test validation and disable
            this.$el.trigger('modalForm.action.click');
        },
        
        // when the action panel button has been clicked
        'click div.action-progress-panel div.panel-body button':function(e) {
            // TODO reset and close modal
            
        },
        
        'shown.bs.modal':function(e) {
            this.model.set('visible', true);
            this.$el.trigger('modalForm.visibility.change', [this.model.get('visible')]);
        },
        'hidden.bs.modal':function(e) {
            this.toggleForm(true);
            this.toggleActionPanel(false);
            this.model.set('visible', false);
            this.$el.trigger('modalForm.visibility.change', [this.model.get('visible')]);
        }
    },
    
    'className':'modal fade edit-dtview-modal',
    
    /**
     * ModalForm View<br />
     * This Backbone view contains the form controls, the action panel, and the 
     * navigation controls.
     * @typedef {Backbone-View} ModalForm
     * @class
     * @classdesc This view is constructed from the parent DataTableView
     * @version 1.0.1
     * @constructs ModalForm
     * @extends Backbone-View
     * @param {object}              options - configuration options for this View instance
     * @param {enum}                options.mode - a $.fn.DataTableView.MODES enum value
     * @param {boolean}             [options.showNavigation=true] - if false, then the first/previous/next/last navigation buttons will not display during an edit operation
     * @param {boolean}             [options.showProgressPanel=true] - if false, then the progress panel will not display during ajax actions
     * @param {element|jQuery}      [options.bodyContent=null] - the dom elements to append to the modal body initially
     * @param {object}              [options.modalConfig={backdrop:'static', keyboard:false, show:false}] - the Bootstrap Modal component configuration
     * @param {object}              [options.formAttributes={class:'form-horizontal', accept-charset:'utf-8', role:'form'}] - the attributes for the form in the modal body
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        //console.log(options);
        var privateOptions = {
            'headerNav':new FormNavigation({}),
            'footerNav':new FormNavigation({}),
            'actionPanel':new ActionProgressPanel({}),
            'visible':false,
            'actionType':$.fn.DataTableView.ACTION_TYPES.NOTHING
        };
        this.model = new Backbone.Model($.extend(true, {
            'showNavigation':true,
            'showProgressPanel':false,
            'bodyContent':null,
            'modalSize':'xl',
            'modalConfig':{'backdrop':'static', 'keyboard':false, 'show':false},
            'formAttributes':{'class':'form-horizontal', 'accept-charset':'utf-8', 'role':'form'}
        }, options, privateOptions));
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        
        // add the action panel to the modal body
        $('div.modal-body', this.$el).prepend(this.model.get('actionPanel').$el);
        
        // add the navigation controls to the modal header and footer
        $('div.modal-header', this.$el).append(this.model.get('headerNav').$el);
        $('div.modal-footer', this.$el).prepend(this.model.get('footerNav').$el);
        
        // toggle visibility of sub-controls based on configuration
        this.toggleActionPanel(this.model.get('showProgressPanel')).toggleNavigation(this.model.get('showNavigation'));
        
        // add the form to the modal body
        $('div.dtview-form-container', this.$el).empty().append($('<form />').attr(this.model.get('formAttributes')));
        if(this.model.get('bodyContent')) {
            $('div.dtview-form-container form', this.$el).empty().append(this.model.get('bodyContent'));
        }
        
        // show/hide the action button based on the mode
        if(_.indexOf([$.fn.DataTableView.MODES.DISABLED, $.fn.DataTableView.MODES.READ_ONLY, $.fn.DataTableView.MODES.DATATABLE_ONLY], this.model.get('mode'))>-1) {
            $('button.dtview-modal-form-action-button', this.$el).hide();
        }
        
        this.$el.modal(this.model.get('modalConfig'));
        return this.$el;
    }
});

var DataTableView = Backbone.View.extend(
/** @lends DataTableView.prototype */
{
    
    /**
     * {object} template - used to render this View
     * @protected
     */
    'template':_.template(template_dtv_view),
    
    /**
     * 
     * @private
     * @function setFormInputs
     * @param {object} data - the data from the datatable row
     */
    'setFormInputs':function(data, reset) {
        var fieldConfig, i, fi;
        for(i in this.model.get('formInputs')) {
            fi = this.model.get('formInputs')[i];
            fieldConfig = _.findWhere(this.get('tableData').columns, {'data':fi.model.get('name')});
            
            if(reset) {
                fi.reset();
            }
            
            //console.log(fieldConfig);
            if(_.has(data, fi.model.get('name'))) {
                if(fieldConfig && _.has(fieldConfig, 'setFields') && _.isArray(fieldConfig.setFields)) {
                    fi.set.apply(fi, _.values( _.pick(data, fieldConfig.setFields) ));
                } else {
                    fi.set(data[fi.model.get('name')]);
                }
            }
        }
    },
    
    /**
     * Used as a shortcut method to "this.model.get('foo')"
     * @public
     * @function get
     * @param {string} key - the model key
     * @return {*}
     */
    'get':function(key) {
        return this.model.get(key);
    },
    
    /**
     * Calls the .validate() function on each of the form input controls and 
     * stores the result in the return object. 
     * If the modalForm control is not visible then this function returns false.
     * @public
     * @function validate
     * @return {object|false}
     */
    'validate':function() {
        if(this.get('modalForm').get('visible')) {
            var formObj = {}, formObjConfig, keyValue, dataObj, i;
            for(i in this.get('formInputs')) {
                if(_.indexOf(['select','buttonGroup'], 
                        this.get('formInputs')[i].type())>-1) {
                    var isBtnGrpValOnly = this.get('formInputs')[i].type()==='buttonGroup' && 
                        this.get('formInputs')[i].model.get('valueOnly');
                    formObjConfig = _.findWhere(this.get('tableData').columns, 
                        {'data':this.get('formInputs')[i].name()});
                    
                    if(isBtnGrpValOnly) {
                        keyValue = this.get('formInputs')[i].validate();
                    } else {
                        // check if the value is going to be a number or not
                        // if it is, then ensure value as a number
                        keyValue = _.isFinite(
                            formObjConfig.datasource[0][formObjConfig.valueKey]) ? 
                                this.get('formInputs')[i].validate()[formObjConfig.data]*1 : 
                                this.get('formInputs')[i].validate()[formObjConfig.data];
                    }
                    
                    var searchObj = {};
                    searchObj[formObjConfig.valueKey] = keyValue;
                    // check if the value object exists in the datasource
                    dataObj = _.findWhere(formObjConfig.datasource, searchObj)
                    if(dataObj) {
                        $.extend(formObj, _.createKeyValueObject(
                            this.get('formInputs')[i].name(),
                            isBtnGrpValOnly ? keyValue : dataObj
                        ));
                    }
                } else {
                    $.extend(formObj, this.get('formInputs')[i].validate());
                }
            }
            return formObj;
        } else {
            return false;
        }
    },
    
    /**
     * A function that returns the version of not just this object, but all the 
     * complex objects that this object manages.
     * @function ColumnFilters#versions
     * @return {object} A JSON object where the keys represent the class or 
     * object and the values are the versions.
     */
    'versions':function() {
        var i, fi = _.map(this.get('formInputs'), function(f) {
            return {'type':f.model.get('type'), 'version':f.version}
        }), fig = _.groupBy(fi, 'type'), figk = _.keys(fig), ic = {};
        for(i in figk) {
            ic[figk[i]] = fig[figk[i]][0].version;
        }
        return {
            'DataTableView':this.version,
            'DataTable':$.fn.DataTable.version,
            'FixedColumns':$.fn.dataTable.FixedColumns.version,
            'ColumnVisibilityControl':this.get('columnVisibilityControl').version,
            'ModalForm':this.get('modalForm').version,
            'Input Controls':ic,
            'ColumnFilters':this.get('columnFilters').versions()
        };
    },
    
    /**
     * This View's events object. 
     * @member {object} events
     * @property {object} events - The events object
     * @property {function} init.dt - Event triggered when the DataTable is done initializing.
     */
    'events':{
        // DATATABLE INIT COMPLETE
        'init.dt':function(e, settings, json) {
            // add the columnfilters control to the interface
            this.$el.prepend(this.model.get('columnFilters').$el);
            var dt;
            
            if(!this.model.get('url')) {
                this.model.set('datatable', $(e.target).DataTable().table());
            } else {
                dt = $(this.model.get('datatable').table().container());
            }
            
            dt = $(this.model.get('datatable').table().container());
            
            // create refresh data table button
            $('div.refresh-datatable-btn-container', this.$el).append([
                '<button type="button" class="btn btn-default" title="refresh data">',
                    '<span class="glyphicon glyphicon-refresh"></span>',
                '</button>'
            ].join(''));
            
            // create and set the columnVisibilityControl
            this.model.set('columnVisibilityControl', new DatatableColumnVisibilityControl({
                'class':'pull-left',
                'widthOverride':430,
                'columns':_.object(
                    _.rest(this.model.get('datatable').columns().dataSrc().toArray(),1), 
                    _.map(
                        _.filter(settings.aoColumns, function(c) {
                            return c.data!==null && (!_.has(c,'cfexclude') || (_.has(c,'cfexclude') && !c.cfexclude));
                        }), 
                        function(d) {
                            return {'title':d.sTitle, 'visible':d.bVisible, 'index':d.idx*1, 'data':d.data};
                        }
                    )
                ),
                'groups':this.model.get('tableData').groups
            }));
            $('.column-visibility-container', dt).append(this.model.get('columnVisibilityControl').render());
            
            /*
             * column visibility event listeners
             * when the DatatableView triggers a "columnVisibilityControl.change" event it will send
             * an array of column indexes and an array of column keys (strings) with it
             * ColumnVisibilityChangeEvent([1,3,5,...], ['name','amount','location',...])
             */
            this.listenTo(this.model.get('columnVisibilityControl'), 'columnVisibilityControl.column.change', function(columnIndex, isVisible) {
                this.model.get('datatable').column(columnIndex).visible(isVisible, false);
                
                // this threw an error in the 1.10.7 version of DataTables
                //this.model.get('datatable').columns.adjust().draw( false );
                
                this.model.get('datatable').draw(false).columns.adjust();
                
                // broadcast this event from this View
                this.trigger('datatableView.columnVisibility.column.change', 
                        this.model.get('datatable').columns(':visible:not(.action-column)').indexes().toArray(),
                        this.model.get('datatable').columns(':visible:not(.action-column)').dataSrc().toArray()
                );
                this.$el.trigger('datatableView.columnVisibility.column.change', 
                    [
                        this.model.get('datatable').columns(':visible:not(.action-column)').indexes().toArray(),
                        this.model.get('datatable').columns(':visible:not(.action-column)').dataSrc().toArray()
                    ]);
            });
            this.listenTo(this.model.get('columnVisibilityControl'), 'columnVisibilityControl.group.change', function(visibleColumnIndexes) {
                // first hide all columns except the first
                this.model.get('datatable').columns(':not(.action-column)').visible(false, false);
                
                // show columns using visibleColumnIndexes
                this.model.get('datatable').columns(visibleColumnIndexes).visible(true, false);
                this.model.get('datatable').draw(false).columns.adjust();
                this.trigger('datatableView.columnVisibility.column.change', 
                    visibleColumnIndexes,
                    this.model.get('datatable').columns(':visible:not(.action-column)').dataSrc().toArray()
                );
                this.$el.trigger('datatableView.columnVisibility.column.change', 
                    [
                        visibleColumnIndexes,
                        this.model.get('datatable').columns(':visible:not(.action-column)').dataSrc().toArray()
                    ]
                );
            });
            
            // check for a modify mode, attach an "add" button to control bar
            if(_.indexOf([$.fn.DataTableView.MODES.MODIFY_ONLY, $.fn.DataTableView.MODES.MODIFY], this.model.get('mode'))>-1) {
                // create add row data table button
                $('div.add-button-container', this.$el).append(
                    ['<button type="button" class="btn btn-success pull-left">Add ','</button>'].join(this.model.get('tableData').label)
                );
            }
            
            // check for extra UI
            if(this.model.get('extraUI')) {
                $('div.custom-ui', dt).append(this.model.get('extraUI'));
            }
            
            // trigger initialized event
            this.trigger('datatableview.init');
            this.$el.trigger('datatableview.init')
        },
        
        /**
         * Event triggered when datatables server-side request has returned 
         * from the server. This happens for success AND error responses.
         * TODO we need to catch when the session expires in any ajax call 
         * and redirect to the login page.
         * ajax calls:
         *              datatables xhr response
         *              datatableview.ajax.error
         *              columnfilters.ajax.error
         */
        'xhr.dt':function(e, settings, json, xhr) {
            if(!json) {
                console.log(xhr.getAllResponseHeaders());
                this.trigger('datatableview.ajax.error', xhr, json);
                this.$el.trigger('datatableview.ajax.error', [xhr, json]);
            }
        },
        
        /**
         * Event handler for when the refresh button is clicked
         */
        'click div.refresh-datatable-btn-container':function(e) {
            // TODO use the first argument of .ajax.reload() to hide the action panel and progress
            this.model.get('datatable').ajax.reload(null, false);
        },
        
        /**
         * Event handler for when the add button is clicked
         */
        'click div.add-button-container button':function(e) {
            // clear and reset each form input control
            for(var i in this.model.get('formInputs')) {
                this.model.get('formInputs')[i].reset();
            }
            
            // update the header title, action button, show navigation, then the modal
            this.model.get('modalForm').updateTitle('Create '+this.model.get('tableData').label)
                                       .updateActionButtonTitle('Create')
                                       .setActionType($.fn.DataTableView.ACTION_TYPES.CREATE)
                                       .toggleNavigation(false)
                                       .show();
        },
        
        /**
         * Event handler for when the edit/view button in the datatable row is clicked
         */
        'click .dtview-edit-btn':function(e) {
            var domRow = $(e.currentTarget).parent().parent().parent()[0],
                //dIndex = this.model.get('datatable').row(domRow, {'page':'current'}).index(),
                dIndex = this.get('fc').fnGetPosition(domRow),
                dIndexes = this.get('datatable').rows({'page':'current'}).indexes().toArray(),
                d = this.get('datatable').row(dIndex, {'page':'current'}).data(),
                currentIndex = _.indexOf(dIndexes, dIndex), // the index of the row relative to the paged table rows
                fIndex,
                isView = $(e.currentTarget).data('view-only'),
                actionTitle = [isView ? 'View' : 'Edit', this.model.get('tableData').label].join(' '),
                actionType = isView ? $.fn.DataTableView.ACTION_TYPES.NOTHING : $.fn.DataTableView.ACTION_TYPES.EDIT;
            
            if(d) {
                // tell the modalForm to change the title and action button label
                this.model.get('modalForm').updateTitle(actionTitle)
                                           .updateActionButtonTitle('Save')
                                           .setActionType(actionType)
                                           .updateNav(currentIndex, dIndexes.length)
                                           .show();
                this.setFormInputs(d);
            }
        },
        
        /**
         * Event handler for when a navigation control within the modalForm triggers a change event
         */
        'modalForm.nav.change':function(e, modalForm, newIndex) {
            // ASSERTION: if this event is fired then the navigation buttons are visible
            // get the data from the datatable and send it back to the modalForm
            var dIndexes = this.get('datatable').rows({'page':'current'}).indexes().toArray();
            modalForm.updateNav(newIndex, dIndexes.length);
            
            // d == the full data object for the datatable row
            var d = this.get('datatable').row(dIndexes[newIndex], {'page':'current'}).data(),
                fIndex;
            
            // reset the form controls and add the data from the datatable row
            this.setFormInputs(d, true);
        },
        
        /**
         * Event handler for when the remove button is clicked within the datatable row
         */
        'click button.dtview-del-btn':function(e) {
            var domRow = $(e.currentTarget).parent().parent().parent()[0],
                dIndex = this.get('fc').fnGetPosition(domRow),
                d = this.get('datatable').row(dIndex, {'page':'current'}).data();
            
            // display action panel and progress bar until done
            // check if webServiceUrl is good and ajax a delete call
            if(this.get('webServiceUrl')) {
                this.get('modalForm').toggleActionPanel(true, 'removing').show();
                // send DELETE with id as path param
                $.ajax({
                    'context':this,
                    'url':[
                       this.get('webServiceUrl'),
                       d[this.get('tableData').primaryKeyColumn]
                    ].join('/'),
                    'method':'DELETE'
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    this.get('modalForm').updateActionMessage(textStatus);
                    this.trigger('datatableview.ajax.error', jqXHR, null);
                    this.$el.trigger('datatableview.ajax.error', [jqXHR, null]);
                }).done(function(data, textStatus, jqXHR) {
                    this.get('modalForm').updateActionLabel('removing ... done');
                    // update the datatable
                    this.get('datatable').ajax.reload(null,false);
                    // hide the modal form and reset the action panel
                    this.get('modalForm').hide().toggleActionPanel(false);
                });
            }
            
            // trigger event
            this.trigger('datatableview.row.delete', d);
            this.$el.trigger('datatableview.row.delete', [d]);
        },
        
        /**
         * Event handler for when the modalForm broadcasts a modalForm.action.click event.
         * This performs standard validation on the form inputs
         * @fires DataTableView#datatableview.validate.pass
         * @fires DataTableView#datatableview.validate.fail
         */
        'modalForm.action.click':function(e) {
            var formData = this.validate(),
                requiredKeys = _.pluck(_.filter(this.get('tableData').columns, function(fi){ return fi.required==true; }), 'data'),
                missingKeys = _.difference(requiredKeys, _.keys(formData)),
                errMessage;
            
            if(formData && missingKeys.length==0) {
                this.get('modalForm').toggleActionPanel(true, 'saving');
                
                // check if webserviceUrl is good and ajax formData to it
                if(this.get('webServiceUrl')) {
                    // add / edit
                    // POST / PUT/*
                    
                    switch(this.get('modalForm').getActionType()) {
                        case $.fn.DataTableView.ACTION_TYPES.EDIT:
                            if(this.model.get('url')) {
                                $.ajax({
                                    'context':this,
                                    'contentType':'application/json',
                                    'dataType':'json',
                                    'url':[
                                       this.get('webServiceUrl'),
                                       formData[this.get('tableData').primaryKeyColumn]
                                    ].join('/'),
                                    'method':'PUT',
                                    'data':JSON.stringify(formData),
                                    'processData':false
                                }).fail(function(jqXHR, textStatus, errorThrown) {
                                    this.get('modalForm').updateActionMessage(textStatus);
                                    this.trigger('datatableview.ajax.error', jqXHR, null);
                                    this.$el.trigger('datatableview.ajax.error', [jqXHR, null]);
                                }).done(function(data, textStatus, jqXHR) {
                                    this.get('modalForm').updateActionLabel('saving ... done');
                                    // update the datatable
                                    this.get('datatable').ajax.reload(null,false);
                                    // hide the modal form and reset the action panel
                                    this.get('modalForm').hide().toggleActionPanel(false);
                                });
                            } else {
                                this.model.get('datatable')
                            }
                            break;
                        case $.fn.DataTableView.ACTION_TYPES.CREATE:
                            if(this.model.get('url')) {
                                $.ajax({
                                    'context':this,
                                    'contentType':'application/json',
                                    'dataType':'json',
                                    'url':this.get('webServiceUrl'),
                                    'method':'POST',
                                    'data':JSON.stringify(formData),
                                    'processData':false
                                }).fail(function(jqXHR, textStatus, errorThrown) {
                                    this.get('modalForm').updateActionMessage(textStatus);
                                    this.trigger('datatableview.ajax.error', jqXHR, null);
                                    this.$el.trigger('datatableview.ajax.error', [jqXHR, null]);
                                }).done(function(data, textStatus, jqXHR) {
                                    this.get('modalForm').updateActionLabel('saving ... done');
                                    // update the datatable
                                    this.get('datatable').ajax.reload(null,false);
                                    // hide the modal form and reset the action panel
                                    this.get('modalForm').hide().toggleActionPanel(false);
                                });
                            } else {
                                this.get('datatable').rows().add(formData).draw();
                                this.get('modalForm').hide().toggleActionPanel(false);
                            }
                            break;
                    }
                }
                
                // broadcasts a datatableview.validate.pass event with: returned validation object
                this.trigger('datatableview.validate.pass', formData);
                this.$el.trigger('datatableview.validate.pass', [formData]);
            } else {
                // broadcasts a datatableview.validate.fail event with: returned validation object, data names of the form inputs, failed validation message
                errMessage = [
                    'required fields did not validate:',
                    _.pluck(
                        _.filter(this.get('tableData').columns, 
                            function(fi) { 
                                return _.contains(missingKeys, fi.data)
                        }), 'title')
                ].join(' ');
                this.trigger('datatableview.validate.fail', formData, missingKeys, errMessage);
                this.$el.trigger('datatableview.validate.fail', [formData, missingKeys, errMessage])
            }
        },
        
        'modalForm.visibility.change':function(e, visible) {
            if(!visible) {
                // reset form inputs
                var i;
                for(i in this.get('formInputs')) {
                    this.get('formInputs')[i].reset();
                }
            }
        }
    },
    
    /**
     * The main Backbone View used in the DataTableView plugin.
     * @author Wes Owen wowen@ccctechcenter.org
     * @typedef {Backbone-View} DataTableView
     * @class
     * @classdesc This view renders and controls the DataTableView jQuery plugin.
     * @version 1.0.3
     * @constructs DataTableView
     * @extends Backbone-View
     * @param {object} options - configuration options for the View
     */
    'initialize':function(options) {
        this.version = '1.0.3';
        // ASSERTION: the datatableConfig.ajax configuration value must an 
        // object so that the context property can be added
        if(options.url) {
            options.datatableConfig.ajax.context = this;
        }
        
        /**
         * The DataTableView view model. This will contain all of the key/value 
         * properties from the options parameter and those listed here.
         * @name model
         * @type {Backbone.Model}
         * @memberof DataTableView.prototype
         * @property {Element} container - a link to the DOM element containing 
         * the DataTableView instance
         */
        this.model = new Backbone.Model(options);
        
        // the modalView -- use options.formInputs to generate the bodyContent config property
        var bodyContent = this.get('formInputs').length ? $.map(this.get('formInputs'), function(e,i){return e.$el;}) : null,
            i, fiContainer, 
            isReadonly = _.indexOf([$.fn.DataTableView.MODES.DISABLED, $.fn.DataTableView.MODES.READ_ONLY, $.fn.DataTableView.MODES.DATATABLE_ONLY], this.get('mode'))>-1,
            modalConfig = this.get('modalFormConfig');
        if(this.get('formTemplate')) {
            bodyContent = this.get('formTemplate');
            // loop through the formInput array and try to match each control with an element in the formTemplate
            for(i in this.get('formInputs')) {
                // if there is a matching template container element then put the form control's $el in it
                fiContainer = $(['*[data-table-view-column="', this.get('formInputs')[i].model.get('name'), '"]'].join(''), bodyContent);
                if(fiContainer.length) {
                    fiContainer.append(this.get('formInputs')[i].$el);
                } else {
                    bodyContent.append(this.get('formInputs')[i].$el);
                }
            }
        }
        
        // set a new columnFilters in the model 
        this.model.set('columnFilters', $.fn.ColumnFilters(this.model.get('columnfiltersConfig')));
        
        // add the mode to the modalConfig object and create a ModalForm
        $.extend(modalConfig, {'mode':this.get('mode')});
        this.model.set('modalForm', new ModalForm($.extend(modalConfig, {'bodyContent':bodyContent})));
        
        // listen to when filters are added/edited/removed/reset and re-broadcast
        this.model.get('columnFilters').on('filters.update', function(col, opt) {
            this.trigger('cf.filters.update', col, opt);
            this.$el.trigger('cf.filters.update', [col, opt]);
        }, this);
        this.model.get('columnFilters').on('filters.reset', function(col, opt) {
            this.trigger('cf.filters.reset', col, opt);
            this.$el.trigger('cf.filters.reset', [col, opt]);
        }, this);
        this.model.get('columnFilters').on('columnfilters.ajax.error', function() {
            this.trigger('datatableview.ajax.error', jqXHR, null);
            this.$el.trigger('datatableview.ajax.error', [jqXHR, null]);
        }, this);
        
        // render the view after initialized
        this.render();
    },
    
    'render':function() {
        // create the DOM elements and place into the View's $el
        this.$el.append(this.template({}));
        
        this.$el.prepend(this.model.get('columnFilters').$el);
        
        this.$el.prepend(this.model.get('modalForm').$el)
        
        // create the datatable
        this.model.set('datatable', $('table.dtview-datatable', this.$el).DataTable(this.model.get('datatableConfig')));
        
        this.model.set('fc', new $.fn.dataTable.FixedColumns(this.model.get('datatable')));
    }
});

/**
 * This is the jQuery plugin function for DataTableView. To construct, pass in 
 * a configuration object to the <code>DataTableView()</code> function on a 
 * single <code>div</code> jQuery selection. e.g. 
 * <code>$('div#dtv').DataTableView({...})</code>
 * @namespace $.fn.DataTableView
 */
$.fn.DataTableView = function(config) {
    // this == jquery object of what was passed
    // TODO restrict to div and table
    if(this.length<1 || !this.is('div')) {
        console.error('no element given to DataTableView');
        return;
    }
    
    if(!_.has(config, 'mode')) {
        $.extend(config, {'mode':$.fn.DataTableView.defaults.mode})
    }
    
    // variables used in this scope
    var container, 
        primaryKeyColumn, 
        protectedConfig, 
        isReadonly = _.indexOf(
            [
                $.fn.DataTableView.MODES.DISABLED, 
                $.fn.DataTableView.MODES.READ_ONLY
            ], config.mode)>-1,
        displayTableColumns = [],
        datatableColumns = [], // used to define each column in the datatable
        datatableColumnDefs = [], // the styles and other UI properties for the columns
        columnfiltersColumns = [],
        cfSpecialTypes = [
            'boolean',
            'bool',
            'num',
            'number',
            'tinyint',
            'smallint',
            'mediumint',
            'int',
            'bigint',
            'double',
            'float',
            'decimal'
        ],
        i = 0; // tableData.columns loop iterator index
    
    // config.tableData.primaryKeyColumn is required
    // TODO make it so a primary key column is not requried
    primaryKeyColumn = _.findWhere(config.tableData.columns, {'data':config.tableData.primaryKeyColumn});
    if(!primaryKeyColumn) {
        console.error('a column must be identified by the tableData.primaryKeyColumn value');
        return;
    }
    
    /** 
     * protected configuration values
     * These cannot be overridden or altered prior to running the constructor
     */
    protectedConfig = {
         // a link to the DOM element containing the DataTableView
        'container':null,
        
        // The modalForm houses the add/edit form as well as the actionProgressPanel
        'modalForm':null, 
        
        // used if there is an element in the object this was called on that has a data-table-view-template attribute with a value set to "form"
        'formTemplate':null,
        
        // this is the ColumnFilters control
        'columnFilters':null,
        
        // This is a View that controls what columns are visible in the DataTable
        'columnVisibilityControl':null,
        
        // this is the DataTable control
        'datatable':null,
        
        // used for the edit functions
        'rowIndex':-1, 'editIndexes':[],
        
        // these are generated from the tableData.columns array
        'formInputs':[],
        
        // a formInput name to formInput mapping object
        'formInputsMap':{}
    };
    
    // check if there is a form template
    if($('*[data-table-view-template="form"]', this).length) {
        protectedConfig.formTemplate = $('*[data-table-view-template="form"]', this).detach();
    }
    
    // process the columns from the defaults object
    /* TODO create 2 ways to define the columns; with a passed array of objects, and
     * by processing the pre-populated table within the jQuery object this function was called on.
     * <table>
     *     <thead>
     *         <tr>
     *             <th data-data="{data}"
     *                 data-type="{type}" 
     *                 data-visible="{true/false}"
     *                 data-required="{true/false}"  
     *                 data-cftype="{cftype}" 
     *                 data-cfexclude="{true/false}" 
     *                 data-controlType="{control-type}" [displayKey, valueKey, table]>{title}</th>
     *             ...
     *         </tr>
     *     </thead>
     *     <tbody>
     *         <tr>
     *             <td></td>
     *             ...
     * there are some limitations with the html option as some column properties cannot be set, e.g. datasource, render.
     */
    
    // add the first column, which will be the action column and linked to the primary key column
    datatableColumns.push({
        'data':primaryKeyColumn.data,
        'title':'',
        'cfexclude':true,
        'render':isReadonly ? primaryKeyColumnReadonlyRender : 
            config.mode===$.fn.DataTableView.MODES.MODIFY_ONLY ? 
                primaryKeyColumnModifyOnlyRender : 
                primaryKeyColumnModifyRender
    });
    
    // add an action column definition to the datatableColumnDefs array
    datatableColumnDefs.push({'targets':0, 'orderable':false, 'sortable':false, 'width':'35px', 'className':'dtv-action-column'});
    
    // add the primary key column to the form inputs
    protectedConfig.formInputsMap[primaryKeyColumn.data] = new HiddenFormInput($.extend({'required':true}, primaryKeyColumn.control));
    protectedConfig.formInputs.push(protectedConfig.formInputsMap[primaryKeyColumn.data]);
    
    
    /**
     * Loop through the tableData.columns array, using each loop iteration object to 
     * construct the config objects for datatable, columnfilters, well as the form
     * inputs used when adding or editing a datatable item. 
     */
    displayTableColumns = _.without(config.tableData.columns, primaryKeyColumn);
    
    // process columns for columnfilters
    columnfiltersColumns = _.map(
        _.reject(displayTableColumns, function(c) { 
            return _.has(c, 'cfexclude')
        }), function(c) {
            var r = {'data':c.data, 'title':c.title};
            if(_.has(c, 'cftype')) {
                _.extend(r, {'type':c.cftype});
            } else {
                _.extend(r, {'type':c.type});
            }
            if(_.has(c, 'table')) {
                _.extend(r, {'table':c.table});
            }
            if(_.has(c, 'datasource')) {
                _.extend(r, {
                    'datasource':c.datasource,
                    'displayKey':c.displayKey,
                    'valueKey':c.valueKey
                });
            }
            
            // any special types
            if(_.contains(cfSpecialTypes, r.type)) {
                $.extend(r, _.omit(c.control, 
                    ['type','table','datasource','displayKey','valueKey']
                ));
            }
            return r;
        }, 
        this
    );
    
    // process columns for datatable view
    for(i in displayTableColumns) {
        var col = displayTableColumns[i], 
            metaCol = {
                'data':col.data, // data is the key in the data row object (area)
                'title':col.title,
                'type':$.fn.DataTableView.defaults.DB_TO_DT_TYPES[col.type.toLowerCase()]
            }, 
            colClassName = 'text-center',
            inpt = $.extend(true, {'name':col.data, 'label':col.title}, col.control);
        
        
        // check for the visible property
        _.extend(metaCol, (_.has(col, 'visible') && _.isBoolean(col.visible)) ? {'visible':col.visible} : {'visible':true});
        
        // set the css class names depending on the database type
        switch(col.type) {
            // anything short-form text
            case 'varchar': // TODO need to add clipping at nth character class
            case 'tinytext':
                colClassName = 'text-center text-nowrap text-capitalize';
                break;
            // any long text type
            case 'mediumtext':
            case 'text':
            case 'longtext':
                colClassName = 'notes-column';
                break;
        }
        
        // columnDef object is complete
        datatableColumnDefs.push({'targets':i, 'className':colClassName});
        
        /**
         * Column.render handling
         * The render data table function can be overridden, otherwise the 
         * defaults will be used for certain types
         */
        if(_.has(col, 'render')) {
            _.extend(metaCol, {'render':col.render});
        } else if( _.contains(['object','reference'], col.type) && _.has(col, 'displayKey') && _.has(col, 'valueKey')) {
            // object type requires displayKey and valueKey
            _.extend(metaCol, {'displayKey':col.displayKey, 'valueKey':col.valueKey, 'render':{_:col.displayKey, 'sort':col.valueKey} });
            
            if(_.has(col,'table')) {
                _.extend(metaCol, {'table':col.table});
            }
            
            // check for biglist/typeahead
            if(_.has(col,'datasource')) {
                _.extend(metaCol, {'datasource':col.datasource});
            }
            
        } else if(col.type==='date') {
            // date values can vary
            if($.fn.DataTableView.defaults.tableData.timestampDates) {
                _.extend(metaCol, {'render': $.fn.DataTableView.timestampCellRender});
            }
            // TODO add more configuration options for dates
        }
        
        datatableColumns.push(metaCol);
        
        /**
         * Generate Form Inputs
         */
        if(!_.has(col, 'inputExclude') || (_.has(col, 'inputExclude') && !col.inputExclude)) {
            
            // check for required property, fallback to $.fn.DataTableView.defaults.tableData.requiredDefaultValue if not provided
            if(_.has(col, 'required') && _.isBoolean(col.required)) {
                inpt.required = col.required;
            } else {
                col.required = $.fn.DataTableView.defaults.tableData.requiredDefaultValue;
            }
            
            // check for readonly/disabled mode for the whole datatable view
            // if the datatable view mode isn't set to readonly/disabled check for a readonly property on the column, 
            // then check for a disabled property
            // readonly has priority over disabled
            if(isReadonly) {
                inpt.readonly = true;
            } else if(_.has(col, 'readonly') && _.isBoolean(col.readonly)) {
                inpt.readonly = col.readonly;
            } else if(_.has(col, 'disabled') && _.isBoolean(col.disabled)) {
                inpt.disabled = col.disabled;
            }
            
            switch(inpt.type) {
                case 'hidden':
                    protectedConfig.formInputsMap[col.data] = new HiddenFormInput(inpt);
                    break;
                case 'text':
                case 'textarea':
                    protectedConfig.formInputsMap[col.data] = new TextFormInput(inpt);
                    break;
                case 'number':
                    protectedConfig.formInputsMap[col.data] = new NumberFormInput(inpt);
                    break;
                case 'toggle':
                    protectedConfig.formInputsMap[col.data] = new ButtonToggleFormInput(inpt);
                    break;
                case 'timestamp':
                    protectedConfig.formInputsMap[col.data] = new DatepickerFormInput($.extend(inpt,{'timestamp':true}));
                    break;
                case 'datepicker':
                    protectedConfig.formInputsMap[col.data] = new DatepickerFormInput(inpt);
                    break;
                case 'buttonGroup':
                    // ASSERTION: col.type==object
                    $.extend(inpt, {
                        'buttons':$.map(col.datasource, function(v, idx){ return {'label':v[col.displayKey], 'value':v[col.valueKey]} }),
                        'valueKey':col.valueKey
                    });
                    protectedConfig.formInputsMap[col.data] = new ButtonGroupToggleFormInput(inpt);
                    break;
                case 'select':
                    // ASSERTION: col.type==object
                    $.extend(inpt, {
                        'options':$.map(col.datasource, function(v, idx) {
                            return {
                                'label':_.isFunction(col.displayKey) ?
                                    col.displayKey(v) :
                                    v[col.displayKey], 
                                'value':v[col.valueKey]
                            }
                        }),
                        'valueKey':col.valueKey
                    });
                    protectedConfig.formInputsMap[col.data] = new SelectFormInput(inpt);
                    break;
                case 'typeahead':
                    protectedConfig.formInputsMap[col.data] = new TypeaheadFormInput(
                        $.extend(true, {
                            'datasets':{'name':inpt.name, 'source':col.datasource, 'displayKey':col.displayKey}
                        }, inpt)
                    );
                    break;
                case 'custom':
                    protectedConfig.formInputsMap[col.data] = new inpt.controlClass(_.omit(inpt, ['type', 'controlClass']));
                    break;
            }
            
            if(_.has(protectedConfig.formInputsMap, col.data)) {
                protectedConfig.formInputs.push(protectedConfig.formInputsMap[col.data]);
            }
        }
    }
    
    // create the container for the view
    container = $('<div />').attr($.fn.DataTableView.defaults.wrapperAttributes);
    this.replaceWith(container);
    $.fn.DataTableView.defaults.container = container;
    
    // finalize column filters config
    $.fn.DataTableView.defaults.columnfiltersConfig.table = $.fn.DataTableView.defaults.tableData.name;
    $.fn.DataTableView.defaults.columnfiltersConfig.columns = columnfiltersColumns;
    
    /* combine and save the defaults with the passed in configuration object and 
     * protected configuration options
     * allow for configuration options to be passed with the constructor, but 
     * will need to have some options that can't be overridden
    */
    $.fn.DataTableView.defaults = $.extend(true, 
        {
            'el':$.fn.DataTableView.defaults.container
        }, 
        $.fn.DataTableView.defaults, 
        config, 
        protectedConfig
    );
    
    // set the datatableConfig.columns and .columnDefs properties
    $.fn.DataTableView.defaults.datatableConfig.columns = datatableColumns;
    $.fn.DataTableView.defaults.datatableConfig.columnDefs = datatableColumnDefs;
    
    /* 
     * set the datatableConfig.ajax property
     * this ajax object is used for the datatable server-side ajax call
     */
    if($.fn.DataTableView.defaults.url) {
        $.fn.DataTableView.defaults.datatableConfig.serverSide = true;
        $.fn.DataTableView.defaults.datatableConfig.ajax = {
            'url':$.fn.DataTableView.defaults.url,
            'type':'POST',
            'dataType':'json',
            'contentType':'application/json',
            'data':ajaxDataProcess,
            'processData':false
        };
    }
    
    // create and return a DataTableView object 
    return new DataTableView($.fn.DataTableView.defaults);
}
/**
 * Enum for the DataTableView mode values.
 * @readonly
 * @enum {number}
 */
$.fn.DataTableView.MODES = {
    /** The disabled value, which will disable all user interface controls. */
    'DISABLED':0,
    
    /**
     * The read-only value enables the columnfilters control, but the action column in 
     * the datable will have a "view" button/link. All form inputs will be disabled.
     */ 
    'READ_ONLY':1,
    
    /**
     * The modify-only value does the same as the MODIFY value, only the remove functions 
     * and user interface controls are not available.
     */
    'MODIFY_ONLY':3,
    
    /**
     * The modify value will cause the edit and remove buttons to be available in the 
     * datatable and the form inputs the be active.
     */ 
    'MODIFY':5
};
/**
 * Enum for control layout orientation
 * @readonly
 * @enum {number}
 */
$.fn.DataTableView.LAYOUT_ORIENTATION = {
    /** A stacked style of layout */
    'VERTICAL':0,
    
    /** A side-by-side style of layout */
    'HORIZONTAL':1
};
/**
 * Enum for the Action Types (Edit, Create) the form can have.
 * @readonly
 * @enum {number}
 */
$.fn.DataTableView.ACTION_TYPES = {
    /** The action type is to do nothing */
    'NOTHING':1001001,
    
    /** The action type is to create a new item */
    'CREATE':1002001,
    
    /** The action type is to edit or change an existing item */
    'EDIT':3002001
};

/**
 * DataTable cell render function for timestamps (big-ass integers)
 * @global
 * @see http://datatables.net/reference/option/columns.render
 * @function timestampCellRender
 * @param {*} data - The data for the cell (based on columns.data)
 * @param {string} type - The type call data requested - this will be 'filter', 'display', 'type' or 'sort'.
 * @param {*} full - The full data source for the row (not based on columns.data)
 * @param {object} meta -  An object that contains additional information about the cell being requested. This object contains the following properties: row=The row index for the requested cell., col=The column index for the requested cell., settings=The DataTables.Settings object for the table in question. This can be used to obtain an API instance if required.
 * @return {string} A formatted date string representing the timestamp.
 */
$.fn.DataTableView.timestampCellRender = function(data, type, full, meta) {
    return _.isFinite(data) ? moment.utc(data).format('MM/D/YYYY') : '';
};

/**
 * These are the default values for the DataTableView plugin.
 * @memberof $.fn.DataTableView
 */
$.fn.DataTableView.defaults = {
    // Attributes applied to the container element created during construction.
    'wrapperAttributes':{
        'class':'datatableview'
    },
    
    // affects the UI
    'mode':$.fn.DataTableView.MODES.READ_ONLY,
    
    // Database to DataTable type map
    'DB_TO_DT_TYPES':{
        'varchar'   : 'string',
        'tinytext'  : 'string',
        'mediumtext': 'string',
        'text'      : 'string',
        'longtext'  : 'string',
        'tinyint'   : 'num',
        'smallint'  : 'num',
        'mediumint' : 'num',
        'int'       : 'num',
        'bigint'    : 'num',
        'double'    : 'num',
        'float'     : 'num',
        'decimal'   : 'num',
        'date'      : 'date',
        'datetime'  : 'date',
        'timestamp' : 'date',
        'reference' : 'num',
        'object'    : 'num'
    },
    
    // this is for the datatable server-side request API
    'url':null,
    
    // this is for the ajax calls that manage the individual objects in the datatable
    'webServiceUrl':null,
    
    /**
     * The progressBar is a bootstrap component.
     */
    'progressBar':null, // TODO this should be its own View
    
    /**
     * The actionProgressPanel is a simple View that displays a progress bar and
     * message when there is some kind of action being performed.
     */
    'actionProgressPanel':null, // TODO this should be its own View
    
    /**
     * anything that $.append() would take as an argument
     * Displays in the toolbar above the DataTable
     */
    'extraUI':null,
    
    // column metadata used to generate column configuration values for datatable and columnfilters
    'tableData':{
        'name':'table',
        'class':'row',
        'label':'table row',
        
        /**
         * Required if mode is READ_ONLY, MODIFY_ONLY, or MODIFY. 
         */
        'primaryKeyColumn':null,
        
        /**
         * 
         */
        'columns':[],
        
        /**
         * You can create named column collections and each one will show up 
         * as a button in the columnVisibilityControl. This is useful if there
         * are a lot of columns and you need to view different sets of columns.
         * An obect in the array will have a "name" and "columns" property. e.g. 
         * {"name":"MyGroup", "columns":["firstName", "lastName", "phone"]}
         */
        'groups':[],
        
        // TODO implement
        'requiredDefaultValue':false,
        'timestampDates':true
    },
    
    /**
     * ColumnFilters configuration
     * @see https://github.com/owenwe/columnfilters
     */
    'columnfiltersConfig':{
        //'url':'',
        //'mode':$.fn.ColumnFilters.Modes.DEFAULT,
        //'filters':[],
        //'filterCategories':[],
        //'table':null
    },
    
    /**
     * DataTables configuration
     * see http://datatables.net/reference/option/
     */
    'datatableConfig':{
        'exteriorController':null, // TODO set later; in initialize? datatableview
        'searching':false,
        'scrollX':true,
        'scrollY':'400px',
        'scrollCollapse':true,
        'dom':[
            '<"panel panel-default"',
                '<"panel-heading clearfix"',
                    '<"refresh-datatable-btn-container pull-left">',// the refresh table button
                        'l',// the number of results per page drop down
                        '<"column-visibility-container">',// 
                        '<"add-button-container">',// the add row button
                        '<"custom-ui">',
                        'p',// the pagination control
                '>',
            '>',
            'tpi<"clearfix">'].join(''),
        'processing':true,
        'serverSide':false,
        'order':[[1,'asc']],
        'columnDefs':[],
        'columns':[]
    },
    
    'modalFormConfig':{}
};
    
    $.fn.DataTableView.VERSION = '1.0.3';
})(jQuery);
