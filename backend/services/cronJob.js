import cron from 'node-cron'
import userModel from '../models/user.model.js'
import { exec } from 'child_process';

cron.schedule('0 0 * * *', async () => { // Run At Every day at midnight
    const unverifiedUsers = await userModel.find({ isVerified: false })
    await userModel.deleteMany({ _id: { $in: unverifiedUsers.map(user => user._id) } })
    console.log('Deleted unverified users...')
})

cron.schedule('* * * * *', () => { // Run every day at 11 PM
    exec('git add . && git commit -m "Daily code push" && git push', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing git push: ${error}`);
            return;
        }
        console.log(`Git push output: ${stdout}`);
        if (stderr) {
            console.error(`Git push error output: ${stderr}`);
        }
    }),
    exec('cd frontend && git add . && git commit -m "Daily code push" && git push', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing git push: ${error}`);
            return;
        }
        console.log(`Git push output: ${stdout}`);
        if (stderr) {
            console.error(`Git push error output: ${stderr}`);
        }
    })
})