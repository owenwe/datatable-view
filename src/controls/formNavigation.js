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

