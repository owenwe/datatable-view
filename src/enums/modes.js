/**
 * Enum for the DataTableView mode values.
 * @readonly
 * @enum {number}
 */
$.fn.DataTableView.MODES = {
    /** The disabled value, which will disable all user interface controls. */
    'DISABLED':0,
    
    /**
     * The read-only value enables the columnfilters control, but the action column in 
     * the datable will have a "view" button/link. All form inputs will be disabled.
     */ 
    'READ_ONLY':1,
    
    /**
     * The modify-only value does the same as the MODIFY value, only the remove functions 
     * and user interface controls are not available.
     */
    'MODIFY_ONLY':3,
    
    /**
     * The modify value will cause the edit and remove buttons to be available in the 
     * datatable and the form inputs the be active.
     */ 
    'MODIFY':5,
    
    /**
     * The datatable-only value hides the columnfilters control and the buttons/links in the 
     * primary key column that cause the modal form to display.
     */
    'DATATABLE_ONLY':7
};
