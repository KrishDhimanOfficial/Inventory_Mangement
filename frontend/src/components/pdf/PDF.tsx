import { Page, Text, View, Document, } from '@react-pdf/renderer'
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table'
import styles from './styles'

// Create Document Component
const PDF = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
            <Table>
                <TH>
                    <TD>Header 1</TD>
                    <TD>Header 2</TD>
                </TH>
                <TR>
                    <TD>Data 1</TD>
                    <TD>Data 2</TD>
                </TR>
            </Table>
        </Page>
    </Document>
)

export default PDF