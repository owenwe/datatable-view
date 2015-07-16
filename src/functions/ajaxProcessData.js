/**
 * This function is intended to be used for the ajax.data value for the datatable. 
 * It will acquire the column filters data object and append it along with the 
 * table name to the data being sent to the datatable's server-side script.
 * @callback ajaxDataProcess
 * @param {object} d
 * @param {DataTable} datatable
 */
var ajaxDataProcess = function(d, datatable) {
    // datatable.ajax.context is the DataTableView instance
    if(datatable.ajax.context) {
        var cf = datatable.ajax.context.model.get('columnFilters').getCurrentFilter();
        if(cf) {
            d.columnfilters = cf;
        }
        d.table = datatable.ajax.context.model.get('tableData').name;
    }
    return JSON.stringify(d);
};
