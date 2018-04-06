sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
], function(Controller, oDataModel, MessageBox, BusyIndicator) {
	"use strict";

	return Controller.extend("z.ecomprintlist.controller.View1", {

		onInit: function() {
			this._oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyy-MM-dd",
				calendarType: sap.ui.core.CalendarType.Gregorian
			});
			var config = this.getOwnerComponent().getManifest();
			var sServiceUrl = config["sap.app"].dataSources.ZECOMBPOST_SRV.uri;
			this._oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, true);
		},

		chooseDate: function() {
			var oView = this.getView();
			oView.byId("calendarbutton").setVisible(false);
			oView.byId("calendar").setVisible(true);
			oView.byId("label_date").setVisible(false);
			this.oView.byId("saveButton").setVisible(false);
		},

		handleCalendarSelect: function(evt) {
			var oCalendar = this.oView.byId("calendar");
			var aSelectedDates = oCalendar.getSelectedDates();
			if (aSelectedDates.length > 0) {
				var oDate = aSelectedDates[0].getStartDate();
				this.oView.byId("label_date").setText(this._oFormatYyyymmdd.format(oDate));
				this.oView.byId("calendarbutton").setVisible(true);
				this.oView.byId("calendar").setVisible(false);
				this.oView.byId("label_date").setVisible(true);
				this.oView.byId("saveButton").setVisible(true);
			}
		},

		processList: function() {
			var oView = this.getView();
			var sPath = "/FProcessList";
			var oDate = oView.byId("label_date").getText();
			BusyIndicator.show();
			this._oModel.callFunction(sPath, {
				method: "GET",
				urlParameters: {
					ZDate: oDate
				},
				success: function(oData, response) {
					BusyIndicator.hide();
					MessageBox.information(response.data.Message);
					oView.byId("calendarbutton").setVisible(true);
					oView.byId("calendar").setVisible(false);
					oView.byId("saveButton").setVisible(false);
					oView.byId("label_date").setText("");
				},
				error: function(error) {
					BusyIndicator.hide();
					MessageBox.error(JSON.parse(error.response.body).error.message.value, {
						title: "Error"
					});
				}
			});
		}
	});
});