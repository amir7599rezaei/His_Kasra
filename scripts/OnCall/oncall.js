var OnCall_create = OnCall_create || {};

(function ($, window, document) {

    var toast_options = {
        stack: true,
        fullscreen: true,
        timeout: 3000,
        has_progress: true,
        rtl: true
    }


    var $thisModal;
    //OnCall_create.ready = function () {
    //   // OnCall_create.CreateButton
    //  //  add("text");
    //}

    OnCall_create.onSave = function () {
        debugger;
        $thisModal = $($(event.target).parents('.kasra-modal-dialog')[0]).data('kasra-modal-dialog');



        if (OnCall_create.chkItem()) {

            var dataobj = {
                STime: $('#STime').val(),
                ETime: $('#ETime').val(),
                Acronym: OnCall_create.CategoryStructureTitle,
                Description: $('#Description').val(),
                CategoryStructureId: OnCall_create.CategoryStructureID
            };

            var jsonObj = JSON.stringify({ 'OncallCodeSetting': dataobj });
            $.ajax({
                url: 'HIS/OnCall/SaveOncallCodeSetting',
                data: { strpbl: jsonObj },
                method: 'POST',
                success: function (data) {
                    var res = JSON.parse(data);
                    var typemsg = 'success';
                    if (!res.Success) {
                        typemsg = 'error';
                    }
                    debugger;
                    $.Toast("", res.Message, typemsg, toast_options);
                    if (typemsg == 'success') {
                        $thisModal.closeModal(res.Data[0]);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("با خطا مواجه شد" + jqXHR.responseText);
                }
            });
        }


    }

    OnCall_create.onSelectOncallCodeSetting = function onSelect(obj) {
        debugger;
        var id = $(obj).data('assigned-id');
        var acronym = $(obj).data('assigned-acronym');
        //var date = $(obj).data('assigned-date');
        $thisModal = $($(event.target).parents('.kasra-modal-dialog')[0]).data('kasra-modal-dialog');

        $thisModal.closeModal({ id: id, acronym: acronym });
    }


    OnCall_create.chkItem = function () {

        if ($('#STime').val() == '') {
            $.Toast("", OnCall_create.MesageSTime, 'error', toast_options);
            return false;
        }
        if ($('#ETime').val() == '') {
            $.Toast("", OnCall_create.MesageETime, 'error', toast_options);
            return false;
        }

        return true;
    }
    // OnCall_create.CreateButton =
    //function add(type) {
    //    debugger;
    //    //Create an input type dynamically.   
    //    var element = document.createElement("input");
    //    //Assign different attributes to the element. 
    //    element.type = type;
    //    element.value = type; // Really? You want the default value to be the type string?
    //    element.name = type; // And the name too?
    //    element.onclick = function () { // Note this is a function
    //        alert("blabla");
    //    };

    //    var foo = document.getElementById("buttonsDiv");
    //    //Append the element in page (in span).  
    //    foo.appendChild(element);
    //}

    //invoke = (event) => {
    //    debugger;
    //    let nameOfFunction = this[event.target.name];
    //    let arg1 = event.target.getAttribute('data-arg1');
    //    //We can add more args as needed...
    //    window[nameOfFunction](arg1)
    //    //hope function is in window. 
    //    //Else the respective object need to be used 
    //})
    //}

    $(document).ready(OnCall_create.ready);
})(jQuery, window, document)