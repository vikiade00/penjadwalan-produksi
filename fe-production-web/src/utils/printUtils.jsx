// printUtils.js
export function print(data) {
  const printWindow = window.open("", "", "height=800,width=600");

  printWindow.document.write("<html><head><title>Print</title>");
  printWindow.document.write(
    "<style>body { font-family: Arial, sans-serif; }</style>"
  ); // Add any required styles
  printWindow.document.write("</head><body >");

  // Add your content for printing here
  printWindow.document.write("<h1>Production Report</h1>");

  // You can format data into HTML as needed
  if (data && data.length > 0) {
    printWindow.document.write(
      '<table border="1" cellpadding="5" cellspacing="0">'
    );
    printWindow.document.write(
      "<thead><tr><th>Date</th><th>Production</th></tr></thead>"
    );
    printWindow.document.write("<tbody>");
    data.forEach((item) => {
      printWindow.document.write(
        `<tr><td>${item.date}</td><td>${item.production}</td></tr>`
      );
    });
    printWindow.document.write("</tbody></table>");
  } else {
    printWindow.document.write("<p>No data available to print.</p>");
  }

  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
