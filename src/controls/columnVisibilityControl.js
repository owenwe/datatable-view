var DatatableColumnVisibilityControl = Backbone.View.extend(
/** @lends DatatableColumnVisibilityControl.prototype */
{
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
    
    /**
     * This View controls the visibility properties of DataTable columns.
     * @typedef {Backbone-View} DatatableColumnVisibilityControl
     * @class
     * @classdesc A UI control to manage a collection on/off properties. In this 
     * case a series of visibility booleans from DataTable columns.
     * @version 1.0.1
     * @constructs DatatableColumnVisibilityControl
     * @extends Backbone-View
     * @param {object} options - The configuration options for this View instance.
     * All of the values except for the <em>class</em> property are passed to 
     * this view's <code>model<code> constructor.
     * @param {object} options.columns - This is expected to be an object where 
     * each property key is the "data" value in the datatable columns config.
     * The value of each property is expected to have these properties:<br />
     * <ul>
     *     <li><strong>index</strong> - original index of column from datatable columns</li>
     *     <li><strong>data</strong> - the name of the column key</li>
     *     <li><strong>title</strong> - the descriptive label for the column</li>
     *     <li><strong>visible</strong> - a boolean for visibility</li>
     * </ul>
     * @param {object[]} [groups] - An object array where each object has a 
     * <em>name</em> and <em>columns</em> properties.
     * @param {string[]} [default] - An array of column names that are visible 
     * by default. It's best to leave this parameter alone.
     * @param {number} [options.widthOverride] - The width of the group of 
     * button switches for each of the columns. Increasing this number allows 
     * more buttons per horizontal row, saving vertical space.
     */
    'initialize':function(options) {
        this.version = '1.0.1';
        var config = $.extend(true, 
            {
                'columns':{}, 
                'default':[], 
                'groups':[]
            }, 
            _.omit(options, ['class']),
            {
                // a sorted version of columns
                'sorted':_.sortBy(options.columns, 'index')
            }
        );
        
        // a class can be added to this.$el
        if(_.has(options, 'class')) {
            this.$el.addClass(options['class']);
        }
        
        // check if a default was provided
        if(config['default'].length<1) {
            config['default'] = _.pluck(_.filter(config.sorted, function(c) {
                return (_.has(c,'visible') && c.visible)
            }), 'data');
        }
        
        this.model = new Backbone.Model(config);
    },
    
    'render':function() {
        return this.$el.append(
            this.model.get('groups').length ? 
                this.template_groups(this.model.toJSON()) : 
                this.template_nogroups(this.model.toJSON())
            );
    }
});
