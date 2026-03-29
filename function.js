window.function = function (html, fileName, format, zoom, orientation, margin, breakBefore, breakAfter, breakAvoid, fidelity, customDimensions) {
	// FIDELITY MAPPING
	const fidelityMap = {
		low: 1,
		standard: 1.5,
		high: 2,
	};

	// DYNAMIC VALUES
	html = html.value ?? "No HTML set.";
	fileName = fileName.value ?? "file";
	format = format.value ?? "a4";
	zoom = zoom.value ?? "1";
	orientation = orientation.value ?? "portrait";
	margin = margin.value ?? "0";
	breakBefore = breakBefore.value ? breakBefore.value.split(",") : [];
	breakAfter = breakAfter.value ? breakAfter.value.split(",") : [];
	breakAvoid = breakAvoid.value ? breakAvoid.value.split(",") : [];
	quality = fidelityMap[fidelity.value] ?? 1.5;
	customDimensions = customDimensions.value ? customDimensions.value.split(",").map(Number) : null;

	// DOCUMENT DIMENSIONS
	const formatDimensions = {
		a0: [4967, 7022],
		a1: [3508, 4967],
		a2: [2480, 3508],
		a3: [1754, 2480],
		a4: [1240, 1754],
		a5: [874, 1240],
		a6: [620, 874],
		a7: [437, 620],
		a8: [307, 437],
		a9: [219, 307],
		a10: [154, 219],
		b0: [5906, 8350],
		b1: [4175, 5906],
		b2: [2953, 4175],
		b3: [2085, 2953],
		b4: [1476, 2085],
		b5: [1039, 1476],
		b6: [738, 1039],
		b7: [520, 738],
		b8: [366, 520],
		b9: [260, 366],
		b10: [183, 260],
		c0: [5415, 7659],
		c1: [3827, 5415],
		c2: [2705, 3827],
		c3: [1913, 2705],
		c4: [1352, 1913],
		c5: [957, 1352],
		c6: [673, 957],
		c7: [478, 673],
		c8: [337, 478],
		c9: [236, 337],
		c10: [165, 236],
		dl: [650, 1299],
		letter: [1276, 1648],
		government_letter: [1199, 1577],
		legal: [1276, 2102],
		junior_legal: [1199, 750],
		ledger: [2551, 1648],
		tabloid: [1648, 2551],
		credit_card: [319, 508],
	};

	// GET FINAL DIMESIONS FROM SELECTED FORMAT
	const dimensions = customDimensions || formatDimensions[format];
	const finalDimensions = dimensions.map((dimension) => Math.round(dimension / zoom));

	const customCSS = `
	* { margin: 0; padding: 0; box-sizing: border-box; }

	body {
	  margin: 0!important;
	  padding-top: 50px;
	}

	.dl-bar {
	  position: fixed;
	  top: 0;
	  left: 0;
	  right: 0;
	  height: 44px;
	  background: #1a1a1a;
	  display: flex;
	  align-items: center;
	  justify-content: flex-end;
	  padding: 0 12px;
	  z-index: 99999;
	  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
	}

	button#download {
	  border-radius: 6px;
	  font-size: 13px;
	  font-weight: 600;
	  line-height: 1;
	  color: #fff;
	  border: none;
	  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
	  padding: 8px 18px;
	  background: #E87722;
	  cursor: pointer;
	  transition: background 0.15s;
	}

	button#download:hover {
	  background: #d06a1e;
	}

	button#download.downloading {
	  background: #b45a18;
	  color: #fff;
	}

	button#download.done {
	  background: #16a34a;
	  color: #fff;
	}

	@media print {
	  .dl-bar { display: none !important; }
	  body { padding-top: 0 !important; }
	}

	::-webkit-scrollbar {
	  width: 5px;
	  background-color: rgb(0 0 0 / 8%);
	}

	::-webkit-scrollbar-thumb {
	  background-color: rgb(0 0 0 / 32%);
	  border-radius: 4px;
	}
	`;

	// HTML THAT IS RETURNED AS A RENDERABLE URL
	const originalHTML = `
	  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
	  <style>${customCSS}</style>
	  <div class="dl-bar">
		<button id="download">Download PDF</button>
	  </div>
	  <div id="content">${html}</div>
	  <script>
	  document.getElementById('download').addEventListener('click', function() {
		var element = document.getElementById('content');
		var button = this;
		button.innerText = 'Downloading...';
		button.className = 'downloading';
  
		var opt = {
		pagebreak: { mode: ['css'], before: ${JSON.stringify(breakBefore)}, after: ${JSON.stringify(breakAfter)}, avoid: ${JSON.stringify(breakAvoid)} },
		margin: ${margin},
		filename: ${JSON.stringify(fileName)},
		html2canvas: {
		  useCORS: true,
		  scale: ${quality}
		},
		jsPDF: {
		  unit: 'px',
		  orientation: '${orientation}',
		  format: [${finalDimensions}],
		  hotfixes: ['px_scaling']
		}
		};
		html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
		button.innerText = 'Done ✓';
		button.className = 'done';
		setTimeout(function() { 
		  button.innerText = 'Download PDF';
		  button.className = ''; 
		}, 2000);
		}).save();
	  });
	  </script>
	  `;
	var encodedHtml = encodeURIComponent(originalHTML);
	return "data:text/html;charset=utf-8," + encodedHtml;
};
