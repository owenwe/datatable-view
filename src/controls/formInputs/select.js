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
