

'use strict';

angular.module('app.wizards').factory('RequestInfo', function () {

    var RequestModel = {
        params: undefined,
        instance: undefined,
        metadata: undefined,
        sampleGridInstance: undefined,
        itemGridInstance: undefined,
        selectedItemIds: undefined,
        selectedItemOwners: undefined,
        selectdSampleKey : undefined,
        sampleItemMap : undefined,
        error: "",
        init: function()
        {
            this.params = undefined;
            this.instance = undefined;
            this.metadata = undefined;
            this.sampleGridInstance = undefined;
            this.itemGridInstance = undefined;
            this.selectdSampleKey = undefined;
            this.selectedItemIds = undefined;
            this.selectedItemOwners = undefined;
            this.sampleItemsMap = new Object();
            this.error = "";
        },
        requestId: function()
        {
            if (this.instance)
            {
                return this.instance.obj_id;
            }
            else
            {
                return undefined;
            }
        },
        requestPk: function()
        {
            if (this.instance) {
                return this.instance.obj_pk;
            }
            else {
                return undefined;
            }
        },
        getPropertyValue : function(property)
        {
            if (this.instance && this.metadata)
            {
                var propertyValue = this.instance[property];

                if (propertyValue) {
                    if (this.metadata.properties[property].enum) {
                        if (propertyValue > 0) {
                            // convert property value from index to enum name
                            propertyValue = this.metadata.properties[property].enum[propertyValue];
                        }
                        else
                        {
                            // 0 is for unknown, convert it to empty string
                            propertyValue = "";
                        }
                    }
                }

                return propertyValue
            }
            else
            {
                return undefined;
            }
        }
    };

    return RequestModel;
});
