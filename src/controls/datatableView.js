/**
 * The main Backbone View used in this plugin.
 * @typedef {Backbone#View} DataTableView
 * @property {Array} formInputs
 * @class
 * @param {object} options - configuration options for the View
 */
var DataTableView = Backbone.View.extend({
    
    /**
     * {object} template - used to render this View
     * @private
     */
    'template':_.template(template_dtv_view),
    
    /**
     * 
     * @private
     * @function setFormInputs
     * @param {object} data - the data from the datatable row
     */
    'setFormInputs':function(data, reset) {
        var fieldConfig, i, fi;
        for(i in this.model.get('formInputs')) {
            fi = this.model.get('formInputs')[i];
            fieldConfig = _.findWhere(this.get('tableData').columns, {'data':fi.model.get('name')});
            
            if(reset) {
                fi.reset();
            }
            
            //console.log(fieldConfig);
            if(_.has(data, fi.model.get('name'))) {
                if(fieldConfig && _.has(fieldConfig, 'setFields') && _.isArray(fieldConfig.setFields)) {
                    fi.set.apply(fi, _.values( _.pick(data, fieldConfig.setFields) ));
                } else {
                    fi.set(data[fi.model.get('name')]);
                }
            }
        }
    },
    
    /**
     * Used as a shortcut method to "this.model.get('foo')"
     * @public
     * @function get
     * @param {string} key - the model key
     * @return {*}
     */
    'get':function(key) {
        return this.model.get(key);
    },
    
    /**
     * Calls the .validate() function on each of the form input controls and stores the result in the return object. 
     * If the modalForm control is not visible then this function returns false.
     * @public
     * @function validate
     * @return {object|false}
     */
    'validate':function() {
        if(this.get('modalForm').get('visible')) {
            var formObj = {}, formObjConfig, keyValue, dataObj, i;
            for(i in this.get('formInputs')) {
                if(_.indexOf(['select','buttonGroup'], this.get('formInputs')[i].type())>-1) {
                    formObjConfig = _.findWhere(this.get('tableData').columns, {'data':this.get('formInputs')[i].name()});
                    keyValue = _.isFinite(formObjConfig.datasource[0][formObjConfig.valueKey]) ? this.get('formInputs')[i].validate()[formObjConfig.data]*1 : this.get('formInputs')[i].validate()[formObjConfig.data];
                    var searchObj = {};
                    searchObj[formObjConfig.valueKey] = keyValue;
                    dataObj = _.findWhere(formObjConfig.datasource, searchObj)
                    if(dataObj) {
                        $.extend(formObj, _.createKeyValueObject(this.get('formInputs')[i].name(),dataObj));
                    }
                } else {
                    $.extend(formObj, this.get('formInputs')[i].validate());
                }
            }
            return formObj;
        } else {
            return false;
        }
    },
    
    /**
     * This View's events object. 
     * @member {object} events
     * @property {object} events - The events object
     * @property {function} init.dt - Event triggered when the DataTable is done initializing.
     */
    'events':{
        // DATATABLE INIT COMPLETE
        'init.dt':function(e, settings, json) {
            // add the columnfilters control to the interface
            this.$el.prepend(this.model.get('columnFilters').$el);
            
            var dt = $(this.model.get('datatable').table().container());
            
            // create refresh data table button
            $('div.refresh-datatable-btn-container', this.$el).append([
                '<button type="button" class="btn btn-default" title="refresh data">',
                    '<span class="glyphicon glyphicon-refresh"></span>',
                '</button>'
            ].join(''));
            
            // create and set the columnVisibilityControl
            this.model.set('columnVisibilityControl', new DatatableColumnVisibilityControl({
                'class':'pull-left',
                'widthOverride':430,
                'columns':_.object(
                    _.rest(this.model.get('datatable').columns().dataSrc().toArray(),1), 
                    _.map(
                        _.filter(settings.aoColumns, function(c) {
                            return c.data!==null && (!_.has(c,'cfexclude') || (_.has(c,'cfexclude') && !c.cfexclude));
                        }), 
                        function(d) {
                            return {'title':d.sTitle, 'visible':d.bVisible, 'index':d.idx*1, 'data':d.data};
                        }
                    )
                ),
                'groups':this.model.get('tableData').groups
            }));
            $('.column-visibility-container', dt).append(this.model.get('columnVisibilityControl').render());
            
            /*
             * column visibility event listeners
             * when the DatatableView triggers a "columnVisibilityControl.change" event it will send
             * an array of column indexes and an array of column keys (strings) with it
             * ColumnVisibilityChangeEvent([1,3,5,...], ['name','amount','location',...])
             */
            this.listenTo(this.model.get('columnVisibilityControl'), 'columnVisibilityControl.column.change', function(columnIndex, isVisible) {
                this.model.get('datatable').column(columnIndex).visible(isVisible, false);
                
                // this threw an error in the 1.10.7 version of DataTables
                //this.model.get('datatable').columns.adjust().draw( false );
                
                this.model.get('datatable').draw(false).columns.adjust();
                
                // broadcast this event from this View
                this.trigger('datatableView.columnVisibility.column.change', 
                        this.model.get('datatable').columns(':visible:not(.action-column)').indexes().toArray(),
                        this.model.get('datatable').columns(':visible:not(.action-column)').dataSrc().toArray()
                );
            });
            this.listenTo(this.model.get('columnVisibilityControl'), 'columnVisibilityControl.group.change', function(visibleColumnIndexes) {
                // first hide all columns except the first
                this.model.get('datatable').columns(':not(.action-column)').visible(false, false);
                
                // show columns using visibleColumnIndexes
                this.model.get('datatable').columns(visibleColumnIndexes).visible(true, false);
                this.model.get('datatable').draw(false).columns.adjust();
                this.trigger('datatableView.columnVisibility.column.change', 
                    visibleColumnIndexes,
                    this.model.get('datatable').columns(':visible:not(.action-column)').dataSrc().toArray()
                );
            });
            
            // check for a modify mode, attach an "add" button to control bar
            if(_.indexOf([$.fn.DataTableView.MODES.MODIFY_ONLY, $.fn.DataTableView.MODES.MODIFY], this.model.get('mode'))>-1) {
                // create add row data table button
                $('div.add-button-container', this.$el).append(
                    ['<button type="button" class="btn btn-success pull-left">Add ','</button>'].join(this.model.get('tableData').label)
                );
            }
            
            // check for extra UI
            if(this.model.get('extraUI')) {
                $('div.custom-ui', dt).append(this.model.get('extraUI'));
            }
        },
        
        /**
         * Event handler for when the refresh button is clicked
         */
        'click div.refresh-datatable-btn-container':function(e) {
            // TODO use the first argument of .ajax.reload() to hide the action panel and progress
            this.model.get('datatable').ajax.reload(null, false);
        },
        
        /**
         * Event handler for when the add button is clicked
         */
        'click div.add-button-container button':function(e) {
            // clear and reset each form input control
            for(var i in this.model.get('formInputs')) {
                this.model.get('formInputs')[i].reset();
            }
            
            // update the header title, action button, show navigation, then the modal
            this.model.get('modalForm').updateTitle('Create '+this.model.get('tableData').label).updateActionButtonTitle('Create').toggleNavigation(false).show();
        },
        
        /**
         * Event handler for when the edit/view button in the datatable row is clicked
         */
        'click .dtview-edit-btn':function(e) {
            var domRow = $(e.currentTarget).parent().parent().parent()[0],
                //dIndex = this.model.get('datatable').row(domRow, {'page':'current'}).index(),
                dIndex = this.get('fc').fnGetPosition(domRow),
                dIndexes = this.get('datatable').rows({'page':'current'}).indexes().toArray(),
                d = this.get('datatable').row(dIndex, {'page':'current'}).data(),
                currentIndex = _.indexOf(dIndexes, dIndex), // the index of the row relative to the paged table rows
                fIndex,
                actionTitle = [$(e.currentTarget).data('view-only') ? 'View' : 'Edit', this.model.get('tableData').label].join(' ');
            
            if(d) {
                // tell the modalForm to change the title and action button label
                this.model.get('modalForm').updateTitle(actionTitle)
                                           .updateActionButtonTitle('Save')
                                           .updateNav(currentIndex, dIndexes.length)
                                           .show();
                this.setFormInputs(d);
            }
        },
        
        /**
         * Event handler for when a navigation control within the modalForm triggers a change event
         */
        'modalForm.nav.change':function(e, modalForm, newIndex) {
            // ASSERTION: if this event is fired then the navigation buttons are visible
            // get the data from the datatable and send it back to the modalForm
            var dIndexes = this.get('datatable').rows({'page':'current'}).indexes().toArray();
            modalForm.updateNav(newIndex, dIndexes.length);
            
            // d == the full data object for the datatable row
            var d = this.get('datatable').row(dIndexes[newIndex], {'page':'current'}).data(),
                fIndex;
            
            // reset the form controls and add the data from the datatable row
            this.setFormInputs(d, true);
        },
        
        /**
         * Event handler for when the remove button is clicked within the datatable row
         */
        'click button.dtview-del-btn':function(e) {
            var domRow = $(e.currentTarget).parent().parent().parent()[0],
                dIndex = this.get('fc').fnGetPosition(domRow),
                d = this.get('datatable').row(dIndex, {'page':'current'}).data();
            
            // TODO check if webServiceUrl is good and ajax a delete call
            if(this.get('webServiceUrl')) {
                
            }
            
            // TODO add broadcast event
            this.$el.trigger('datatableview.row.delete', [d]);
        },
        
        /**
         * Event handler for when the modalForm broadcasts a modalForm.action.click event.
         * This performs standard validation on the form inputs
         * @fires DataTableView#datatableview.validate.pass
         * @fires DataTableView#datatableview.validate.fail
         */
        'modalForm.action.click':function(e) {
            var formData = this.validate(),
                requiredKeys = _.pluck(_.filter(this.get('tableData').columns, function(fi){ return fi.required==true; }), 'data'),
                missingKeys = _.difference(requiredKeys, _.keys(formData));
            
            if(formData && missingKeys.length==0) {
                this.get('modalForm').toggleActionPanel(true);
                
                // broadcasts a datatableview.validate.pass event with: returned validation object
                this.$el.trigger('datatableview.validate.pass', [formData]);
                
                // TODO check if webserviceUrl is good and ajax formData to it
                if(this.get('webServiceUrl')) {
                    
                }
            } else {
                // broadcasts a datatableview.validate.fail event with: returned validation object, data names of the form inputs, failed validation message
                this.$el.trigger(
                    'datatableview.validate.fail', 
                    [
                         formData,
                         missingKeys,
                        'required fields did not validate: ' + _.pluck(_.filter(this.get('tableData').columns, function(fi){ return _.contains(missingKeys, fi.data); }), 'title').join(', ')
                    ]
                );
            }
            console.log(formData);
        },
        
        'modalForm.visibility.change':function(e, visible) {
            if(!visible) {
                // reset form inputs
                var i;
                for(i in this.get('formInputs')) {
                    this.get('formInputs')[i].reset();
                }
            }
        }
    },
    
    'initialize':function(options) {
        // ASSERTION: the datatableConfig.ajax configuration value must an object so that the context property can be added
        options.datatableConfig.ajax.context = this;
        
        // put all options into this View's model
        this.model = new Backbone.Model(options);
        
        // create and set the columnFilters property
        this.model.set('columnFilters', new VDataFilters(this.get('columnfiltersConfig')));
        
        // the modalView -- use options.formInputs to generate the bodyContent config property
        var bodyContent = this.get('formInputs').length ? $.map(this.get('formInputs'), function(e,i){return e.$el;}) : null,
            i, fiContainer, 
            isReadonly = _.indexOf([$.fn.DataTableView.MODES.DISABLED, $.fn.DataTableView.MODES.READ_ONLY, $.fn.DataTableView.MODES.DATATABLE_ONLY], this.get('mode'))>-1,
            modalConfig = this.get('modalFormConfig');
        if(this.get('formTemplate')) {
            //console.log(this.model.get('formTemplate'));
            bodyContent = this.get('formTemplate');
            // loop through the formInput array and try to match each control with an element in the formTemplate
            for(i in this.get('formInputs')) {
                // if there is a matching template container element then put the form control's $el in it
                fiContainer = $(['*[data-table-view-column="', this.get('formInputs')[i].model.get('name'), '"]'].join(''), bodyContent);
                if(fiContainer.length) {
                    //console.log(fiContainer);
                    fiContainer.append(this.get('formInputs')[i].$el);
                } else {
                    bodyContent.append(this.get('formInputs')[i].$el);
                }
            }
        }
        
        if(isReadonly) {
            $.extend(modalConfig, {'mode':this.get('mode')});
        }
        
        this.model.set('modalForm', new ModalForm($.extend(modalConfig, {'bodyContent':bodyContent})));
        
        // render the view after initialized
        this.render();
    },
    
    'render':function() {
        // create the DOM elements and place into the View's $el
        this.$el.append(this.template({}));
        
        this.$el.prepend(this.model.get('modalForm').$el)
        
        // create the datatable
        this.model.set('datatable', $('table.dtview-datatable', this.$el).DataTable(this.model.get('datatableConfig')));
        
        this.model.set('fc', new $.fn.dataTable.FixedColumns(this.model.get('datatable')));
    }
});

/**
 * This is the jQuery plugin function for DataTableView
 * @param {Object} config
 * @returns {DataTableView}
 */
$.fn.DataTableView = function(config) {
    // this == jquery object of what was passed
    // TODO restrict to div and table
    if(this.length<1 || !this.is('div')) {
        console.error('no element given to DataTableView');
        return;
    }
    
    // variables used in this scope
    var container, 
        primaryKeyColumn, 
        protectedConfig, 
        isReadonly = _.indexOf([$.fn.DataTableView.MODES.DISABLED, $.fn.DataTableView.MODES.READ_ONLY, $.fn.DataTableView.MODES.DATATABLE_ONLY], config.mode)>-1,
        displayTableColumns = [],
        datatableColumns = [], // used to define each column in the datatable
        datatableColumnDefs = [], // the styles and other UI properties for the columns
        columnfiltersColumns,
        i = 0; // tableData.columns loop iterator index
    
    // config.tableData.primaryKeyColumn is required
    // TODO make it so a primary key column is not requried
    primaryKeyColumn = _.findWhere(config.tableData.columns, {'data':config.tableData.primaryKeyColumn});
    if(!primaryKeyColumn) {
        console.error('a column must be identified by the tableData.primaryKeyColumn value');
        return;
    }
    
    /** 
     * protected configuration values
     * These cannot be overridden or altered prior to running the constructor
     */
    protectedConfig = {
         // a link to the DOM element containing the DataTableView
        'container':null,
        
        // The modalForm houses the add/edit form as well as the actionProgressPanel
        'modalForm':null, 
        
        // used if there is an element in the object this was called on that has a data-table-view-template attribute with a value set to "form"
        'formTemplate':null,
        
        // this is the ColumnFilters control
        'columnFilters':null,
        
        // This is a View that controls what columns are visible in the DataTable
        'columnVisibilityControl':null,
        
        // this is the DataTable control
        'datatable':null,
        
        // used for the edit functions
        'rowIndex':-1, 'editIndexes':[],
        
        // these are generated from the tableData.columns array
        'formInputs':[],
        
        // a formInput name to formInput mapping object
        'formInputsMap':{}
    };
    
    // check if there is a form template
    if($('*[data-table-view-template="form"]', this).length) {
        protectedConfig.formTemplate = $('*[data-table-view-template="form"]', this).detach();
    }
    
    // process the columns from the defaults object
    /* TODO create 2 ways to define the columns; with a passed array of objects, and
     * by processing the pre-populated table within the jQuery object this function was called on.
     * <table>
     *     <thead>
     *         <tr>
     *             <th data-data="{data}"
     *                 data-type="{type}" 
     *                 data-visible="{true/false}"
     *                 data-required="{true/false}"  
     *                 data-cftype="{cftype}" 
     *                 data-cfexclude="{true/false}" 
     *                 data-controlType="{control-type}" [displayKey, valueKey, table]>{title}</th>
     *             ...
     *         </tr>
     *     </thead>
     *     <tbody>
     *         <tr>
     *             <td></td>
     *             ...
     * there are some limitations with the html option as some column properties cannot be set, e.g. datasource, render.
     */
    
    // add the first column, which will be the action column and linked to the primary key column
    datatableColumns.push({
        'data':primaryKeyColumn.data,
        'title':'',
        'cfexclude':true,
        'render':isReadonly ? primaryKeyColumnReadonlyRender : primaryKeyColumnModifyRender
    });
    
    // add an action column definition to the datatableColumnDefs array
    datatableColumnDefs.push({'targets':0, 'orderable':false, 'sortable':false, 'width':'35px', 'className':'dtv-action-column'});
    
    // add the primary key column to the form inputs
    protectedConfig.formInputsMap[primaryKeyColumn.data] = new HiddenFormInput($.extend({'required':true}, primaryKeyColumn.control));
    protectedConfig.formInputs.push(protectedConfig.formInputsMap[primaryKeyColumn.data]);
    
    
    /**
     * Loop through the tableData.columns array, using each loop iteration object to 
     * construct the config objects for datatable, columnfilters, well as the form
     * inputs used when adding or editing a datatable item. 
     */
    displayTableColumns = _.without(config.tableData.columns, primaryKeyColumn);
    for(i in displayTableColumns) {
        var col = displayTableColumns[i], 
            metaCol = {
                'data':col.data, // data is the key in the data row object (area)
                //'name':col.name,
                'title':col.title,
                'type':$.fn.DataTableView.defaults.DB_TO_DT_TYPES[col.type.toLowerCase()]
            }, 
            colClassName = 'text-center', 
            inpt = $.extend(true, {'name':col.data, 'label':col.title}, col.control);
        
        // check for the visible property
        _.extend(metaCol, (_.has(col, 'visible') && _.isBoolean(col.visible)) ? {'visible':col.visible} : {'visible':true});
        
        // set the css class names depending on the database type
        switch(col.type) {
            // anything short-form text
            case 'varchar': // TODO need to add clipping at nth character class
            case 'tinytext':
                colClassName = 'text-center text-nowrap text-capitalize';
                break;
            // any long text type
            case 'mediumtext':
            case 'text':
            case 'longtext':
                colClassName = 'notes-column';
                break;
        }
        
        // columnDef object is complete
        datatableColumnDefs.push({'targets':i, 'className':colClassName});
        
        /**
         * Column.render handling
         * The render data table function can be overridden, otherwise the defaults will be used for certain types
         */
        if(_.has(col, 'render')) {
            _.extend(metaCol, {'render':col.render});
        } else if( _.contains(['object','reference'], col.type) && _.has(col, 'displayKey') && _.has(col, 'valueKey')) {
            // object type requires displayKey and valueKey
            _.extend(metaCol, {'displayKey':col.displayKey, 'valueKey':col.valueKey, 'render':{_:col.displayKey, 'sort':col.valueKey} });
            
            if(_.has(col,'table')) {
                _.extend(metaCol, {'table':col.table});
            }
            
            // check for biglist/typeahead
            if(_.has(col,'datasource')) {
                _.extend(metaCol, {'datasource':col.datasource});
            }
            
        } else if(col.type==='date') {
            // date values can vary
            if($.fn.DataTableView.defaults.tableData.timestampDates) {
                _.extend(metaCol, {'render': $.fn.DataTableView.timestampCellRender});
            }
            // TODO add more configuration options for dates
        }
        
        // ColumnFilters properties
        if(_.has(col, 'cfexclude') && _.isBoolean(col.cfexclude)) {
            _.extend(metaCol, {'cfexclude':col.cfexclude});
        }
        
        datatableColumns.push(metaCol);
        
        /**
         * Generate Form Inputs
         */
        if(!_.has(col, 'inputExclude') || (_.has(col, 'inputExclude') && !col.inputExclude)) {
            
            // check for required property, fallback to $.fn.DataTableView.defaults.tableData.requiredDefaultValue if not provided
            if(_.has(col, 'required') && _.isBoolean(col.required)) {
                inpt.required = col.required;
            } else {
                col.required = $.fn.DataTableView.defaults.tableData.requiredDefaultValue;
            }
            
            // check for readonly/disabled mode for the whole datatable view
            // if the datatable view mode isn't set to readonly/disabled check for a readonly property on the column, 
            // then check for a disabled property
            // readonly has priority over disabled
            if(isReadonly) {
                inpt.readonly = true;
            } else if(_.has(col, 'readonly') && _.isBoolean(col.readonly)){
                inpt.readonly = col.readonly;
            } else if(_.has(col, 'disabled') && _.isBoolean(col.disabled)) {
                inpt.disabled = col.disabled;
            }
            
            switch(inpt.type) {
                case 'hidden':
                    protectedConfig.formInputsMap[col.data] = new HiddenFormInput(inpt);
                    break;
                case 'text':
                case 'textarea':
                    protectedConfig.formInputsMap[col.data] = new TextFormInput(inpt);
                    break;
                case 'number':
                    protectedConfig.formInputsMap[col.data] = new NumberFormInput(inpt);
                    break;
                case 'toggle':
                    protectedConfig.formInputsMap[col.data] = new ButtonToggleFormInput(inpt);
                    break;
                case 'timestamp':
                    protectedConfig.formInputsMap[col.data] = new DatepickerFormInput($.extend(inpt,{'timestamp':true}));
                    break;
                case 'datepicker':
                    protectedConfig.formInputsMap[col.data] = new DatepickerFormInput(inpt);
                    break;
                case 'buttonGroup':
                    // ASSERTION: col.type==object
                    $.extend(inpt, {
                        'buttons':$.map(col.datasource, function(v, idx){ return {'label':v[col.displayKey], 'value':v[col.valueKey]} }),
                        'valueKey':col.valueKey
                    });
                    protectedConfig.formInputsMap[col.data] = new ButtonGroupToggleFormInput(inpt);
                    break;
                case 'select':
                    // ASSERTION: col.type==object
                    $.extend(inpt, {
                        'options':$.map(col.datasource, function(v, idx){ return {'label':v[col.displayKey], 'value':v[col.valueKey]} }),
                        'valueKey':col.valueKey
                    });
                    protectedConfig.formInputsMap[col.data] = new SelectFormInput(inpt);
                    break;
                case 'typeahead':
                    protectedConfig.formInputsMap[col.data] = new TypeaheadFormInput(
                        $.extend(true, {
                            'datasets':{'name':inpt.name, 'source':col.datasource, 'displayKey':col.displayKey}
                        }, inpt)
                    );
                    break;
                case 'custom':
                    protectedConfig.formInputsMap[col.data] = new inpt.controlClass(_.omit(inpt, ['type', 'controlClass']));
                    break;
            }
            
            if(_.has(protectedConfig.formInputsMap, col.data)) {
                protectedConfig.formInputs.push(protectedConfig.formInputsMap[col.data]);
            }
        }
    }
    
    // create the container for the view
    container = $('<div />').attr($.fn.DataTableView.defaults.wrapperAttributes);
    this.replaceWith(container);
    $.fn.DataTableView.defaults.container = container;
    
    // combine and save the defaults with the passed in configuration object and protected configuration options
    // allow for configuration options to be passed with the constructor, but will need to have some options that can't be overridden
    $.fn.DataTableView.defaults = $.extend(true, {'el':$.fn.DataTableView.defaults.container}, $.fn.DataTableView.defaults, config, protectedConfig);
    
    // set the datatableConfig.columns and .columnDefs properties
    $.fn.DataTableView.defaults.datatableConfig.columns = datatableColumns;
    $.fn.DataTableView.defaults.datatableConfig.columnDefs = datatableColumnDefs;
    
    // finalize column filters config
    $.fn.DataTableView.defaults.columnfiltersConfig.table = $.fn.DataTableView.defaults.tableData.name;
    $.fn.DataTableView.defaults.columnfiltersConfig.tableColumns = datatableColumns;
    
    // set the datatableConfig.ajax property
    $.fn.DataTableView.defaults.datatableConfig.ajax = {
        'url':$.fn.DataTableView.defaults.columnfiltersConfig.cfWebServiceUrl,
        'type':'POST',
        'dataType':'json',
        'contentType':'application/json',
        'data':ajaxDataProcess,
        'processData':false
    };
    
    // create and return a DataTableView object 
    return new DataTableView($.fn.DataTableView.defaults);
}
