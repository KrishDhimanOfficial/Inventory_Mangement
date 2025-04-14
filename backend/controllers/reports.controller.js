import { parseISO, format } from 'date-fns'

const reportController = {
    getPurchaseReport: async (req, res) => {
        try {
            console.log(req.query);
            const startDate = format(parseISO(req.query.startDate), 'yyyy-MM-dd')
            const endDate = format(parseISO(req.query.endDate), 'yyyy-MM-dd')
            console.log(startDate, endDate);

            // const response = await model;
            // return res.status(200).json(response)
        } catch (error) {
            console.log('getPurchaseReport : ' + error.message)
        }
    },
}

export default reportController