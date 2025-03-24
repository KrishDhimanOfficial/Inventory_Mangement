import { PDFViewer } from '@react-pdf/renderer';
import PDF from './PDF';

const PDF_Page = () => {
    return (
        <div className='min-vh-100'>
            <PDFViewer className='min-vh-100 w-100'>
                <PDF />
            </PDFViewer>
        </div>
    )
}

export default PDF_Page