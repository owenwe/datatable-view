/**
 * Text input form control, this will create an instance of TextFormInput
 * @class
 * @classdesc This is the most basic input form control. All Form Input View's will have a .type(), .name(), .get(), .set(), validate(), and .reset()
 * @version 1.0.0
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
var TextFormInput = Backbone.View.extend({
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
    
    /** @constructs TextFormInput */
    'initialize':function(options) {
        //console.log(options);
        
        this.version = '1.0.0';
        
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
