/**
 * Number input form control, this will create an instance of NumberFormInput
 * @class
 * @classdesc This form control is for a number type value
 * @version 1.0.0
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
var NumberFormInput = Backbone.View.extend({
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
        var returnValue = {}, n = $(['spinbox-formcontrol-',this.model.get('name')].join(''), this.$el).spinbox('value');
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
        $(['spinbox-formcontrol-',this.model.get('name')].join(''), this.$el).spinbox(data);
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
        this.$el.removeClass('has-success has-error');
        
        var n = $(['spinbox-formcontrol-',this.model.get('name')].join(''), this.$el).spinbox('value');
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
    
    /**
     * 
     * @member {object} events - event handler functions for this View
     * 
     */
    'events':{},
    
    'className':'form-group input-form-control fuelux',
    
    /** @constructs NumberFormInput */
    'initialize':function(options) {
        //console.log(options);
        
        this.version = '1.0.0';
        
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
            $('input', this.$el).attr('disabled', 'disabled');
        } else if(this.model.get('readonly')) {
            $('input', this.$el).attr({'readonly':'readonly', 'disabled':'disabled'});
        }
        $(['spinbox-formcontrol-',this.model.get('name')].join(''), this.$el).spinbox(this.model.get('spinboxConfig'));
        return this.$el;
    }
});
