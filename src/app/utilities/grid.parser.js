/**
 * Created by kalpesh on 21/03/16.
 */


/**
 * Grid Parser
 */
APP.service('GridParser', function() {

    this.parseSearchColumns = function(columns, wantAll) {
        var newColumns =  wantAll ? [{id: "all", name: "All"}] : [];
        $.each(columns, function(key, val) {
            if (val.search) {
                var data = {id: key, name: val.display_name};
                newColumns.push(data);
            }
        });
        return newColumns;
    };

    this.parseDisplayColumns = function (columns, inputs) {
        var newColumns = [];
        var searchColumns = [];
        $.each(columns, function (key, val) {
            if (val.show) {
                var className = "";
                var order = "ASC";
                if (val.sort) {
                    className = "sorting";
                    angular.forEach(inputs.sorting, function (sortAttr) {
                        if (key == sortAttr.key) {
                            if (sortAttr.direction == 'ASC') {
                                className += "_desc";
                                order = "DESC";
                            }
                            if (sortAttr.direction == 'DESC') {
                                className += "_asc";
                                order = "ASC";
                            }
                        }
                    });
                }
                var data = {
                    'id': key,
                    'name': val.display_name,
                    'placeholder': val.placeholder ? val.placeholder : val.display_name,
                    'class': className,
                    'key': key,
                    'direction': order,
                    'type': val.data_type ? val.data_type : "string"
                };
                newColumns.push(data);
                if(val.search)
                    searchColumns.push(data);
            }
        });
        return {newColumns: newColumns, searchColumns: searchColumns};
    };

    this.generatePaginationLinks = function(start, per_page, total_records, uri, fnct_name) {
        if(fnct_name == ''){
            fnct_name = ''+fnct_name+'';
        }
        var columns = 1;

        var noPerPage = per_page * columns;//Number of content in one page

        var noOfPage = 0;//Holds number of pages

        if (total_records % noPerPage === 0) {
            noOfPage = Math.floor(total_records / noPerPage);
        }
        else {
            noOfPage = Math.floor((total_records / noPerPage) + 1);
        }

        //if total content is less than number of content in one page
        if (total_records < noPerPage) {
            if (total_records % columns === 0) {
                per_page = Math.floor(total_records / columns);
            }
            else {
                per_page = Math.floor((total_records / columns) + 1);
            }
            noOfPage = 1;
        }

        var whichPage = start + 1;//Current page number
        var pagination = 5;//To show page numbers, better to keep odd number like 3,5,7 etc
        var midPagination = Math.floor(pagination / 2);

        var html = "";

        //to generate pagination

        if (whichPage !== 1) {
            html += '<li class="first"><a href="' + uri + '" ng-click="'+fnct_name+'(0, \'' + uri + '\', false);">First</a></li>';
        }
        if (whichPage > 1) {
            html += '<li class="prev"><a href="' + uri + '" ng-click="'+fnct_name+'(' + (whichPage - 2) + ',\'' + uri + '\', false);"><span class="fa fa-chevron-left"></span></a></li>';
        }


        //generate page numbers
        var fno = whichPage - midPagination;
        var lno = whichPage + midPagination;

        if (fno < 1 && noOfPage > pagination) {
            fno = 1;
            lno = pagination;
        }
        else if (fno < 1 && noOfPage <= pagination) {
            fno = 1;
            lno = noOfPage;
        }
        else if (lno > noOfPage && noOfPage <= pagination) {
            fno = 1;
            lno = noOfPage;
        }
        else if (lno > noOfPage && noOfPage > pagination) {
            lno = noOfPage;
            fno = (lno - pagination) + 1;
        }

        //loop pages numbers
        for (var k = fno; k <= lno; k++) {
            if (whichPage === k) {
                if (noOfPage !== 1) {
                    html += '<li class="active"><a href="' + uri + '">' + k + '</a></li>';
                }
            }
            else {
                html += '<li class=""><a href="' + uri + '" ng-click="'+fnct_name+'(' + (k - 1) + ',\'' + uri + '\', false);">' + k + '</a></li>';
            }
        }


        if (whichPage < noOfPage) {
            html += '<li class="next"><a href="' + uri + '" ng-click="'+fnct_name+'(' + (whichPage) + ',\'' + uri + '\', false);"><span class="fa fa-chevron-right"></span></a></li>';
        }
        if (whichPage !== noOfPage) {
            html += '<li class="last"><a href="' + uri + '" ng-click="'+fnct_name+'(' + (noOfPage - 1) + ', \'' + uri + '\', false);">Last</a></li>';
        }

//            if (whichPage <= (noOfPage - pagination)) {
//                html += '<li class="next"><a href="'+ uri +'" ng-click="'+fnct_name+'(' + noPerPage * (whichPage - 1 + pagination) + ',\''+uri+'\', false);"><span class="fa fa-angle-right"></span><span class="fa fa-angle-right"></span></a></li>';
//            }
        return html;
    };

    return this;
});
