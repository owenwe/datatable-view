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
