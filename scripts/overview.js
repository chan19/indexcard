(function(){
	Overview = function(domId){
		this._domContainer = jQuery("#"+domId);
		this._attachEvents();
	}
	Overview.prototype = {
		_data: {},
		open: function(aData){
			var html = this._getHtml(aData);
			jQuery("#overViewItemContainer").html(html);
			jQuery("#blocker").show();
			jQuery("#overViewContainer").show();
		},
		hide: function(){
			jQuery("#overViewContainer").hide();
			jQuery("#blocker").hide();
		},
		getCore: function(){
			return appManager;
		},
		_getHtml: function(aData){
			var html = "", s= "", aNote;
			var that = this;
			aData.forEach(function(o, i){
				aNote = o.notes || [];
				sNote = "";
				aNote.forEach(function(n){
					if(n){
						sNote += "<div class='overviewNotes'>" + that.getCore().sanitizeHtml(n) + "</div>" ;				
					}
				});
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
				printWindow.close();
			}
		},
		_getNode: function(){
			return this._node;
		},
		_attachEvents: function(){
			jQuery("#overviewContainerClose").click(this.hide.bind(this));
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