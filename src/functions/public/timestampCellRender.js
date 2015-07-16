/**
 * DataTable cell render function for timestamps (big-ass integers)
 * @global
 * @see http://datatables.net/reference/option/columns.render
 * @function timestampCellRender
 * @param {*} data - The data for the cell (based on columns.data)
 * @param {string} type - The type call data requested - this will be 'filter', 'display', 'type' or 'sort'.
 * @param {*} full - The full data source for the row (not based on columns.data)
 * @param {object} meta -  An object that contains additional information about the cell being requested. This object contains the following properties: row=The row index for the requested cell., col=The column index for the requested cell., settings=The DataTables.Settings object for the table in question. This can be used to obtain an API instance if required.
 * @return {string} A formatted date string representing the timestamp.
 */
$.fn.DataTableView.timestampCellRender = function(data, type, full, meta) {
    return _.isFinite(data) ? new Date(data).toLocaleDateString() : '';
};

