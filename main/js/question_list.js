/* ------------------------------------------------------------------------------
*
*  # Datatables API
*
*  Demo JS code for datatable_api.html page
*
* ---------------------------------------------------------------------------- */

function modify_question(question_id) {
    window.location.href = 'question_modify.html?id=' + question_id;
}

function delete_question(question_id) {
    swal({
            title: "Are you sure?",
            text: "You will not be able to recover this question!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel pls!",
        },
        function(isConfirm){
            if (isConfirm) {
                let data = new FormData();
                data.append('question_id', question_id);
                $.ajax({
                    url: SERVER_URL_PREFIX + '/question/delete',
                    method: 'post',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        window.location.reload();
                    },
                    error: function (err) {
                        const { success, message } = err;
                        if (success === false) {
                            new PNotify({
                                title: message,
                                icon: 'icon-blocked',
                                type: 'error'
                            });
                        }
                    }
                });
            }
        });
}

document.addEventListener('DOMContentLoaded', function () {

    $.ajax({
        url: SERVER_URL_PREFIX + '/questions/getall',
        method: 'post',
        cache: false,
        contentType: false,
        processData: false,
        success: function(res) {
            const { success, data } = res;
            if (success === true) {
                for (let i = 0; i < data.length; i++) {
                    const question = data[i];
                    let html = '<tr>\n' +
                        '                    <td>' + question['specialist_id'] + '</td>\n' +
                        '                    <td>' + question['domain_id'] + '</td>\n' +
                        '                    <td>' + question['textquestion'] + '</td>\n' +
                        '                    <td>' + question['difficulty'] + '</td>\n' +
                        '                    <td>' + (question['active'] == 1 ? 'Yes' : 'No') + '</td>\n' +
                        '                    <td>\n' +
                        '                    <button type="button" class="btn btn-primary btn-xs" onclick="modify_question(' + question['id'] + ')">Modify</button>\n' +
                        '                        </td>\n' +
                        '                        <td>\n' +
                        '                        <button type="button" class="btn btn-danger btn-xs" onclick="delete_question(' + question['id'] + ')">Delete</button>\n' +
                        '                        </td>\n' +
                        '                        </tr>';
                    $('#dt_list_question tbody').append(html);
                }
            }
            init_table();
        },
        error: function(err) {
            console.log(err);
            init_table();
        }
    })

    // Table setup
    // ------------------------------
    function init_table() {
        // Setting datatable defaults
        $.extend($.fn.dataTable.defaults, {
            autoWidth: false,
            columnDefs: [],
            dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
            language: {
                search: '<span>Filter:</span> _INPUT_',
                searchPlaceholder: 'Type to filter...',
                lengthMenu: '<span>Show:</span> _MENU_',
                paginate: {'first': 'First', 'last': 'Last', 'next': $('html').attr('dir') == 'rtl' ? '&larr;' : '&rarr;', 'previous': $('html').attr('dir') == 'rtl' ? '&rarr;' : '&larr;'}
            },
            drawCallback: function () {
                $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
            },
            preDrawCallback: function () {
                $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
            }
        });

        $('#dt_list_question').DataTable({
            columnDefs: [{
                orderable: false,
                width: '100px',
                targets: [5]
            }, {
                orderable: false,
                width: '100px',
                targets: [6]
            }],
            // initComplete: function () {
            //     this.api().columns().every(function () {
            //         var column = this;
            //         column.prop('orderable', false);
            //         var select = $('<select class="filter-select" data-placeholder="Filter"><option value=""></option></select>')
            //             .appendTo($(column.footer()).not(':nth-last-child(1),:nth-last-child(2),:nth-last-child(3),:nth-last-child(4)').empty())
            //             .on('change', function () {
            //                 var val = $.fn.dataTable.util.escapeRegex(
            //                     $(this).val()
            //                 );
            //
            //                 column
            //                     .search(val ? '^' + val + '$' : '', true, false)
            //                     .draw();
            //             });
            //
            //         column.data().unique().sort().each(function (d, j) {
            //             select.append('<option value="' + d.replace(/<[^>]+>/g, '') + '">' + d + '</option>')
            //         });
            //     });
            // }
        });

        // External table additions
        // ------------------------------

        // Enable Select2 select for the length option
        $('.dataTables_length select').select2({
            minimumResultsForSearch: Infinity,
            width: 'auto'
        });

        // Enable Select2 select for individual column searching
        $('.filter-select').select2();
    }

    $('#btn_add_question').on('click', function() {
        window.location.href = 'question_create.html';
    });
});


