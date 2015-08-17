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
