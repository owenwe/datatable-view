/**
 * Hidden input form control, this will create an instance of HiddenFormInput
 * @class
 * @classdesc This is the most basic input form control. All Form Input View's will have a .get(), .set(), and .reset()
 * @version 1.0.0
 * @param {object}             options                 - configuration options for this View instance
 * @param {string}             options.name            - the value to assign the name attribute on the input
 * @param {object}             [options.inputAttributes={autocomplete:'off', value:''}] - the attributes for the form input element
 * @param {boolean}            [options.required=false] - if the form input is required or not
 * @param {object}             [options.events] - an object with event signatures as keys and the handler function as the value
 */
var HiddenFormInput = Backbone.View.extend({
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
    
    /** @constructs HiddenFormInput */
    'initialize':function(options) {
        //console.log(options);
        
        this.version = '1.0.0';
        
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
