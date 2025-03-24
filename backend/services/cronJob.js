import cron from 'node-cron'
import { exec } from 'child_process'

cron.schedule('0 19 * * *', () => { // Run every day at 7 PM
    exec('cd ../  && git add . && git commit -m "Daily code push" && git push',
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing git push: ${error}`)
                return;
            }
            console.log(`Git push output: ${stdout}`)
            if (stderr) console.error(`Git push error output: ${stderr}`)
        })
})