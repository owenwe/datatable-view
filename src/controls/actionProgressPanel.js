var ActionProgressPanel = Backbone.View.extend(
/** @lends ActionProgressPanel.prototype */
{
    'template':_.template(template_app_view, {'variable':'config'}),
    
    'toggle':function(visible) {
        this.$el.toggle(visible);
        return this;
    },
    
    'updateLabel':function(newLabel) {
        $('div.progress-bar span', this.$el).empty().append(newLabel);
        return this;
    },
    
    'updateProgress':function(newValue) {
        if(_.isFinite(newValue) && newValue<=this.model.get('max')) {
            var v = [newValue,'%'].join('');
            // update attributes: aria-valuenow, style.width
            $('div.progress-bar', this.$el).attr({'aria-valuenow':newValue, 'style':['width',v].join(':')});
            
            // update div.progress-bar span innerHtml
            $('div.progress-bar span').empty().html(v);
        }
        return this;
    },
    
    'updateMessage':function(newContent) {
        $('div.panel-body', this.$el).empty().append(newContent);
        return this;
    },
    
    'reset':function() {
        this.render();
        return this;
    },
    
    'events':{
        
    },
    
    'className':'panel action-progress-panel',
    
    /**
     * ActionProgressPanel View
     * This Backbone view contains a panel with a bootstrap progress bar component in the header.
     * @typedef {Backbone-View} ActionProgressPanel
     * @class
     * @classdesc This view is constructed from the parent ModalForm. It is for showing a progress bar during ajax transmissions and displaying errors.
     * @version 1.0.1
     * @constructs ActionProgressPanel
     * @extends Backbone-View
     * @param {object}             options - configuration options for this View instance
     * @param {object}             [options.progressAttributes={class:"progress-bar progress-bar-striped active", role:"progressbar", style:"width:100%"}] - the default attributes for the bootstrap progressbar div
     * @param {string}             [options.errorMessage='Processing errors'] - the default error message
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        this.model = new Backbone.Model({
            'progressAttributes':{
                'class':'progress-bar progress-bar-striped active',
                'role':'progressbar',
                'style':'width:100%'
            },
            'label':'',
            'defaultValue':100,
            'min':0,
            'max':100,
            'errorMessage':''
        });
        this.render();
    },
    
    'render':function() {
        this.$el.empty().append(this.template(this.model.toJSON()));
        return this.$el;
    }
});

