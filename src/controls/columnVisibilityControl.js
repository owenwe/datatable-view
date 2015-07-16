var DatatableColumnVisibilityControl = Backbone.View.extend({
    'template_nogroups':_.template(template_cvc_noGroups, {'variable':'config'}),
    'template_groups':_.template(template_cvc_groups, {'variable':'config'}),
    
    'events':{
        // CLICK AND CHANGE EVENTS FOR COLUMN VISIBILITY CONTROL
        'click ul.dropdown-menu input, ul.dropdown-menu label':function(e) {
            // just stop the event from bubbling so the dropdown-menu will stay on screen
            e.stopPropagation();
        },
        'change ul.dropdown-menu input':function(e) {
            //this.datatable.columns(e.currentTarget.value*1).visible(e.currentTarget.checked);
            this.trigger('columnVisibilityControl.column.change', e.currentTarget.value*1, e.currentTarget.checked);
            e.stopPropagation();
            return false;
        },
        'click ul.dropdown-menu button':function(e) {
            var groupIndex = $(e.currentTarget).data('group-index')*1,
                gcolumns = groupIndex<0 ? this.model.get('default') : this.model.get('groups')[$(e.currentTarget).data('group-index')].columns;
            
            $('div.checkbox input', this.$el).each(function(i) {
                this.checked = ( _.indexOf(gcolumns, $(this).data('column')) > -1);
            });
            
            this.trigger('columnVisibilityControl.group.change', _.pluck(_.pick(this.model.get('columns'), gcolumns), 'index'));
            
            e.stopPropagation();
        }
    },
    
    'className':'btn-group',
    
    'initialize':function(options) {
        /**
         * options.columns is expected to be:
         * { <key == the same as data (name of the column key)>
         * index:<original index of column from datatable columns>
         * data:<the name of the column key>
         * title:<the descriptive label for the column>
         * visible:<a boolean for visibility>
         * }
         * example:
         * {
         *     'id':{'index':0, 'data':'id', 'title':'', 'visible':false}, 
         *     'name':{'index':1, 'data':'name', 'title':'Name', 'visible':true},
         *     'status':{'index':2, 'data':'status', 'title':'Status', 'visible':true},
         *     ...
         * }
         */
        // any conguration option can be overridden
        var config = $.extend(true, {'columns':{}, 'default':[], 'groups':[]}, options), d;
        
        // a class can be added to this.$el
        if(_.has(options, 'class')) {
            this.$el.addClass(options['class']);
        }
        
        // the width of the column visibility button container can be specified
        if(_.has(options, 'widthOverride') && _.isNumber(options.widthOverride)) {
            _.extend(config, {'widthOverride':options.widthOverride+'px'});
        }
        
        // add a sorted version of columns
        _.extend(config, {'sorted':_.sortBy(config.columns, 'index')})
        
        // check if a default was provided
        if(config['default'].length<1) {
            config['default'] = _.pluck( _.filter(config.sorted, function(c){ return (_.has(c,'visible') && c.visible); }) , 'data');
        }
        
        this.model = new Backbone.Model(config);
    },
    
    'render':function() {
        return this.$el.append( this.model.get('groups').length ? this.template_groups(this.model.toJSON()) : this.template_nogroups(this.model.toJSON()) );
    }
});
