# DataTableView
A jQuery plugin that merges DataTables with ColumnFilters into a single view.

## Requirements
Resource | Minimum Version | Notes
--- | --- | --- 
jQuery | 2.1.x | 
Bootstrap | 3.3.2 | 
Backbone | 1.2.x | Will also need underscore.js, but if you get the version of Backbone that includes underscore then you will be fine.
DataTables | 1.10.4 | If you are going to use any of the plugins then those resources must be included as well. 
dataTables.bootstrap | 1.10.4 | Both js and css files. 
jquery.dataTables | 1.10.4 | 
bootstrap.datepicker | 1.4.0 | 
Moment.js | 2.9.0 | 
Fuelux | 3.0.2 | Only spinbox.js is needed. However, you will need the fuelux.min.css
Typeahead | 0.10.5 | The typeahead bundle will include all the resources for Typeahead that are needed.

## Usage
`$('div#cf-container').DataTableView({options...});`

or

`$.fn.DataTableView({options...});`

### Running Demo with Docker
Docker can make your life easier as a developer. Instead of opening the demo files in a browser from the local file system, you can run an Apache container and mount the project folder into a directory in htdocs. Furthermore, you can do this for more than one project.<br />
Debugging web apps when ran from the local file system can sometimes be troublesome and you usually don't want to be locked into one web server installed on your development OS.

```
docker run -d --name webdev -v ~/projects/workspace/datatable-view/:/usr/local/apache2/htdocs/dtv/ -v ~/projects/workspace/columnfilters/:/usr/local/apache2/htdocs/cf/ httpd:2.4
```
