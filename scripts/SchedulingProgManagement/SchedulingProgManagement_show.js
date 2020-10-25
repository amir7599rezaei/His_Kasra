var SchedulingProgManagement_show = SchedulingProgManagement_show || {};

(function ($, window, document) {

    var toast_options = {
        stack: true,
        fullscreen: true,
        timeout: 3000,
        has_progress: true,
        rtl: true
    }

    var selectedAutoItem = {};

    SchedulingProgManagement_show.ready = function () { }

    SchedulingProgManagement_show.GetFilterData = function () {
        debugger;
        var departmentData = $('#DepartmentAutoComplete').data('kendoMultiSelect').dataItem();
        var wpData = $('#replaceShiftWP_DDL').data('kendoDropDownList').dataItem();
        var versionData = $('#replaceShiftStatus_DDL').data('kendoDropDownList').dataItem();

        return {
            departmentId: (typeof (departmentData) == "undefined" || departmentData == null) ? 0 : departmentData.Id,
            wpId: (typeof (wpData) == "undefined" || wpData == null) ? 0 : wpData.val,
            statusId: (typeof (versionData) == "undefined" || versionData == null) ? 0 : versionData.val
        };
    }

    SchedulingProgManagement_show.onAdditionalDataDepartmentAutoComplete = function () {
        return {
            Code: $("#DepartmentAutoComplete").val(),
            MenuItemID: "1318829"
        };
    }

    SchedulingProgManagement_show.preview_onClick = function () {
        debugger;
        //var departmentData = $('#DepartmentAutoComplete').data('kendoMultiSelect').dataItem();
        var wpData = $('#replaceShiftWP_DDL').data('kendoDropDownList').dataItem();
        var grid = $('#SchedulingProgManagementGrid').data('kendoGrid');

        if (grid.select().length == 0) {
            $.Toast("", "لطفا یک سطر انتخاب نمایید.", "error", toast_options);
            return;
        }
        var selectedData = grid.dataItem(grid.select())

        SchedulingProgManagement_show.modal = $.Modal({
            title: SchedulingProgManagement_show.SchedulingProgModalTitle,
            width: "5000px",
            height: "5000px",
            pageurl: "HIS/SchedulingProg/SchedulingProg",
            autoFixHeight: false,
            ajaxData: {
                DepartmentID: (typeof (selectedData) == "undefined" || selectedData == null) ? 0 : selectedData.DepartmentID,
                DepartmentName: (typeof (selectedData) == "undefined" || selectedData == null) ? 0 : selectedData.DeptName,
                WPID: (typeof (wpData) == "undefined" || wpData == null) ? 0 : wpData.val
            },
            rtl: true,
            has_toolbar: true,
            methodCall: "Post",
            callback_func: function () {
                debugger;
            }
        });
        SchedulingProgManagement_show.modal.showModal();
    }

    SchedulingProgManagement_show.autocompleteDepartment_select = function (selectedItem) {
        selectedAutoItem = selectedItem.dataItem;
        //selectedItem.dataItem.Id/Code
        //selectedItem.dataItem.Name
    }

    SchedulingProgManagement_show.autocompleteDepartment_change = function (selectedItem) { }

    SchedulingProgManagement_show.replaceShiftWP_DDL_onselect = function (selectedItem) { }

    SchedulingProgManagement_show.replaceShiftStatus_DDL_onselect = function (selectedItem) { }

    SchedulingProgManagement_show.OnClickDisplayFlow = function (packId) {

        SchedulingProgManagement_show.modal = $.Modal({
            title: SchedulingProgManagement_show.workFlowModalTitle,
            width: "1024px",
            height: "768px",
            use_iframe: true,
            pageurl: "/FrmPresentation/App_Pages/BaseInfo/WorkFlow/DocFlow.aspx?DocTypeID=34&DocID=" + packId,
            rtl: true,
            has_toolbar: false,
            methodCall: "Get"
        });

        SchedulingProgManagement_show.modal.showModal();

    }

    SchedulingProgManagement_show.onFilterBtn = function () {
        $('#SchedulingProgManagementGrid').data('kendoGrid').dataSource.read();
    }

    $(document).ready(SchedulingProgManagement_show.ready);

})(jQuery, window, document)