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
