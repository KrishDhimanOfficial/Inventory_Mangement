import config from "../config/config.js";
import settingsModel from "../models/settings.model.js";
import deleteImage from "../services/deleteImg.js";
import validate from "../services/validateData.js";

const setting_controller = {
    getsystemDetails: async (req, res) => {
        try {
            const response = await settingsModel.aggregate([
                {
                    $addFields: {
                        logo: {
                            $concat: [config.logoImgPath, "$logo"]
                        }
                    }
                }
            ])
            return res.status(200).json(response[0])
        } catch (error) {
            console.log('getsystemDetails : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
    saveSystemSetting: async (req, res) => {
        try {
            const { name, email, phone, currency, address } = req.body;
            const exitence = await settingsModel.find({})
            const response = await settingsModel.findByIdAndUpdate({ _id: '67fe3b9745ab8f099cfffebb' }, {
                name: JSON.parse(name),
                email: JSON.parse(email),
                phone: JSON.parse(phone),
                currency: JSON.parse(currency),
                address: JSON.parse(address),
                logo: req.file?.filename ? req.file?.filename : exitence[0].logo
            })
            if (req.file?.filename) await deleteImage(`logo/${exitence[0].logo}`)
            if (!response) return res.json({ error: 'Error occur! Please try again.' })
            return res.status(200).json({ success: 'Information updated.' })
        } catch (error) {
            await deleteImage(`logo/${req.file?.filename}`)
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('saveSystemSetting : ' + error.message)
            return res.status(503).json({ error: 'Server currently unavailable.' })
        }
    },
}

export default setting_controller