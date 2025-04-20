import html2pdf from 'html2pdf.js'

const GenerateBill = async ( billOf: string, ) => {
    const element = document.getElementById('pdf-content');

    const opt = {
        margin: 0.5,
        filename: `${billOf}-invoice.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save()
}

export default GenerateBill