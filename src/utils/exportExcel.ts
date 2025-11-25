import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data: any[], fileName: string, headers?: string[]) => {
    // Convert JSON data to worksheet
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    // Write workbook to binary array
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    // Create Blob and trigger download
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
};
