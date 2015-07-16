// plugin defaults
$.fn.DataTableView.defaults = {
    // Attributes applied to the container element created during construction.
    'wrapperAttributes':{
        'class':'data-table-view'
    },
    
    // affects the UI
    'mode':$.fn.DataTableView.MODES.MODIFY,
    
    // Database to DataTable type map
    'DB_TO_DT_TYPES':{
        'varchar'   : 'string',
        'tinytext'  : 'string',
        'mediumtext': 'string',
        'text'      : 'string',
        'longtext'  : 'string',
        'tinyint'   : 'num',
        'smallint'  : 'num',
        'mediumint' : 'num',
        'int'       : 'num',
        'bigint'    : 'num',
        'double'    : 'num',
        'float'     : 'num',
        'decimal'   : 'num',
        'date'      : 'date',
        'datetime'  : 'date',
        'timestamp' : 'date',
        'reference' : 'num',
        'object'    : 'num'
    },
    
    // Database to ColumnFilters type map
    'DB_TO_CF_TYPES':{
        'varchar'   : 'text',
        'tinytext'  : 'text',
        'mediumtext': 'text',
        'text'      : 'text',
        'longtext'  : 'text',
        'tinyint'   : 'number',
        'smallint'  : 'number',
        'mediumint' : 'number',
        'int'       : 'number',
        'bigint'    : 'number',
        'double'    : 'number',
        'float'     : 'number',
        'decimal'   : 'number',
        'date'      : 'date',
        'datetime'  : 'date',
        'timestamp' : 'date',
        'reference' : 'biglist',
        'object'    : 'enum'
    },
    
    // column metadata used to generate column configuration values for datatable and columnfilters
    'tableData':{
        'name':'table',
        'class':'row',
        'label':'table row',
        
        /**
         * Required if mode is READ_ONLY, MODIFY_ONLY, or MODIFY. 
         */
        'primaryKeyColumn':null,
        
        /**
         * 
         */
        'columns':[],
        
        /**
         * You can create named column collections and each one will show up 
         * as a button in the columnVisibilityControl. This is useful if there
         * are a lot of columns and you need to view different sets of columns.
         * An obect in the array will have a "name" and "columns" property. e.g. 
         * {"name":"MyGroup", "columns":["firstName", "lastName", "phone"]}
         */
        'groups':[],
        
        // TODO implement
        'requiredDefaultValue':false,
        'timestampDates':true
    },
    
    // this is for the ajax calls that manage the individual objects in the datatable
    'webServiceUrl':null,//'/wsc/rest',
    
    /**
     * The progressBar is a bootstrap component.
     */
    'progressBar':null, // TODO this should be its own View
    
    /**
     * The actionProgressPanel is a simple View that displays a progress bar and
     * message when there is some kind of action being performed.
     */
    'actionProgressPanel':null, // TODO this should be its own View
    
    /**
     * ColumnFilters configuration
     * @see https://github.com/owenwe/columnfilters
     */
    'columnfiltersConfig':{
        'cfWebServiceUrl':'/columnfilters', // change this to webServiceUrl
        'webServiceUrl':null,
        'mode':0,// will need to create a better enum 
        'filterCategories':[],
        'table':null,
        'columns':[], // set later
        'defaultColumnOrder':[[1,'asc']]
    },
    
    /**
     * anything that $.append() would take as an argument
     * Displays in the toolbar above the DataTable
     */
    'extraUI':null,
    
    /**
     * DataTables configuration
     * see http://datatables.net/reference/option/
     */
    'datatableConfig':{
        'exteriorController':null, // TODO set later; in initialize? datatableview
        'searching':false,
        'scrollX':true,
        'scrollY':'400px',
        'scrollCollapse':true,
        'dom':[
            '<"panel panel-default"',
                '<"panel-heading clearfix"',
                    '<"refresh-datatable-btn-container pull-left">',// the refresh table button
                        'l',// the number of results per page drop down
                        '<"column-visibility-container">',// 
                        '<"add-button-container">',// the add row button
                        '<"custom-ui">',
                        'p',// the pagination control
                '>',
            '>',
            'tpi<"clearfix">'].join(''),
        'processing':true,
        'serverSide':true,
        'ajax':{},
        'order':[[1,'asc']],
        'columnDefs':[],
        'columns':[]
    },
    
    'modalFormConfig':{}
};
