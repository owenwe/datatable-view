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
     * @pulic
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
