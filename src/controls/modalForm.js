/**
 * ModalForm View
 * This Backbone view contains the form controls, the action panel, and the navigation controls.
 * @class
 * @classdesc This view is constructed from the parent DataTableView
 * @version 1.0.0
 * @param {object}              options - configuration options for this View instance
 * @param {enum}                options.mode - a $.fn.DataTableView.MODES enum value
 * @param {boolean}             [options.showNavigation=true] - if false, then the first/previous/next/last navigation buttons will not display during an edit operation
 * @param {boolean}             [options.showProgressPanel=true] - if false, then the progress panel will not display during ajax actions
 * @param {element|jQuery}      [options.bodyContent=null] - the dom elements to append to the modal body initially
 * @param {object}              [options.modalConfig={backdrop:'static', keyboard:false, show:false}] - the Bootstrap Modal component configuration
 * @param {object}              [options.formAttributes={class:'form-horizontal', accept-charset:'utf-8', role:'form'}] - the attributes for the form in the modal body
 */
var ModalForm = Backbone.View.extend({
    
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
    
    'toggleActionPanel':function(visible) {
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
            $('div.modal-footer button.dtview-modal-form-action-button', this.$el).attr('disabled', 'disabled');
            $('div.modal-content', this.$el)[0].scrollIntoView({'behavior':'smooth', 'block':'start'});
        }
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
            $('div.modal-footer button.dtview-modal-form-action-button', this.$el).removeAttr('disabled');
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
    
    'initialize':function(options) {
        //console.log(options);
        var privateOptions = {
            'headerNav':new FormNavigation({}),
            'footerNav':new FormNavigation({}),
            'actionPanel':new ActionProgressPanel({}),
            'visible':false
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

