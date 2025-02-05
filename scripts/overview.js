(function(){
	Overview = function(domId){
		this._domContainer = jQuery("#"+domId);
		this._attachEvents();
	}
	Overview.prototype = {
		_data: {},
		_month :["January","February","March","April","May","June","July","August","September","October","November","December"],
		_getCurDate: function(){
			let curDate = new Date();
			return curDate.getDate()+ " "+ this._month[curDate.getMonth()] + " "+curDate.getFullYear();
		},
		open: function(oData){
			var aCard = oData.cards;
			var html = this._getHtml(aCard);
			jQuery("#overViewItemContainer").html(html);
			jQuery("#overViewContainer .overViewContainerHeaderText").html(oData.fileName);
			jQuery("#overViewContainer .overViewContainerHeaderDate").html(this._getCurDate());
			jQuery("#overViewContainer .overViewContainerAuthor").hide();
			cloudBox.getUserProfile(function(o){
			    if(o.name=='Guest User'){
				
				} else {
					jQuery("#overViewContainer .overViewContainerAuthor").html(o.name).show();
				}
			});
			
			jQuery("#overViewContainer").show();
			this.getCore().fireEvent("dialogOpen", {
				id: "overview",
				closeHandler: this.hide.bind(this)
			});
		},
		hide: function(bSuppressEvent){
			jQuery("#overViewContainer").hide();
			if(!bSuppressEvent){
				this.getCore().fireEvent("dialogClose", {
					id: "overview"
				});					
			}		
		},
		getCore: function(){
			return appManager;
		},
		refreshOverview: function(){
			
		},
		_getHtml: function(aData){
			var html = "", s= "", aNote;
			var that = this;
			var oSettings = this._getMetadataSettings();
			var metadataHtml = "";
			aData.forEach(function(o, i){
				aNote = o.notes || [];
				sNote = "";
				if(oSettings.notes){
					aNote.forEach(function(n){
						if(n){
							sNote += "<div class='overviewNotes'>" + that.getCore().sanitizeHtml(n) + "</div>" ;				
						}
					});				
				}
				metadataHtml = "<div class='overviewItemMetadata'><div>";
				html += "<div class='overviewItem " +o.color+ "'>" +
						"<div class='overviewTitle'>" + (o.index +1 ) + ". " + o.title + "</div>" +
						"<div class='overviewContent'>" + that.getCore().sanitizeHtml(o.content) + "</div>" +
						sNote +
					 "</div>";
			});
			return html;
		},
		_getDocHtml: function(aData){
			
		},
		_getMetadataSettings: function(){
			return {
				act: true,
				location: true,
				pgCount: true,
				color: false,
				notes: true
			};
		},
		openSettings: function(){
			
		},
		print: function(){
			var printable = jQuery("#overViewContainer");
			var printWindow = window.open();
			printWindow.document.write("<link href='css/printableoverview.css' type='text/css' rel='stylesheet'>");
			printWindow.document.write("<div id='printableOverviewContainer'>");
			printWindow.document.write("<div id='printableOverviewHeader'>" + appManager.getFileName() + "</div>");
			printWindow.document.write(printable.html());
			printWindow.document.write("</div>");
			
			printWindow.document.querySelector("link").onload = function(sResponse){
				//printWindow.document.write("<style>" + sResponse + "</style>");
				printWindow.document.close();
				printWindow.focus();
				printWindow.print();
				//printWindow.close();
			}
		},
		_getNode: function(){
			return this._node;
		},
		_attachEvents: function(){
			var that = this;
			jQuery("#overviewContainerClose").click(function(){
				that.hide();
			});
			jQuery("#overViewPrint").click(this.print.bind(this));
		},
		toDoc: function(){
			
			var printable = jQuery("#overViewContainer");
			var s = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
						"xmlns:w='urn:schemas-microsoft-com:office:word' "+
						"xmlns='http://www.w3.org/TR/REC-html40'>"+
						"<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title>" +
						"<style>body{font-family: monospace; font-size: 12px;text-transform: uppercase;}</style>" +
						"<div id='printableOverviewContainer'>" +
						"<div id='printableOverviewHeader'>" + appManager.getFileName() + "</div>" + 
						printable.html() + "</div><body></html>";
       
			var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(s);
			var fileDownload = document.createElement("a");
			document.body.appendChild(fileDownload);
			fileDownload.href = source;
			fileDownload.download = 'document.doc';
			fileDownload.click();
			document.body.removeChild(fileDownload);
			
		}
	}
})();