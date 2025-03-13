import cron from 'node-cron'
import { exec } from 'child_process';


cron.schedule('0 22 * * *', () => { // Run every day at 10 PM
    exec('git add . && git commit -m "Daily code push" && git push', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing git push: ${error}`)
            return;
        }
        console.log(`Git push output: ${stdout}`);
        if (stderr) {
            console.error(`Git push error output: ${stderr}`)
        }
    })
})

cron.schedule('0 21 * * *', () => { // Run every day at 9 PM
    exec('cd ../ cd frontend && git add . && git commit -m "Daily code push" && git push', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing git push: ${error}`)
            return;
        }
        console.log(`Git push output: ${stdout}`)
        if (stderr) {
            console.error(`Git push error output: ${stderr}`)
        }
    })
})