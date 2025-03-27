// Download CSV

const convertArrayOfObjectsToCSV = (array: any[]) => {
    let result: any;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    
    // Check if array is empty
    if (array.length === 0) return '';
    
    const keys = Object.keys(array[0])

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach(item => {
        let ctr = 0;
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];

            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}


const downloadCSV = (file: string, array: any[]) => {
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv == null) return;

    const filename = `${file}.csv`;

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
}
// Download CSV

export { downloadCSV }