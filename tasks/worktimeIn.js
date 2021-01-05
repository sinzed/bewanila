const puppeteer = require('puppeteer')
const config = require('../config/config')

describe('add working hours not because you are lazy but because you have something more important to do', ()=>{
    it('should add working hours by correcting comeInFilter', async function () {
            const browser = await puppeteer.launch({
                headless: config.headless,
                ignoreHTTPSErrors: true,
                args: [
                  "--proxy-server='direct://'",
                  '--proxy-bypass-list=*',
                  '--disable-gpu',
                  '--disable-dev-shm-usage',
                  '--disable-setuid-sandbox',
                  '--no-first-run',
                  '--no-sandbox',
                  '--no-zygote',
                  '--single-process',
                  '--ignore-certificate-errors',
                  '--ignore-certificate-errors-spki-list',
                  '--enable-features=NetworkService'
                ]
              });
            const page = await browser.newPage()
            // await page.goto(config.url)
            await page.goto("https://alinaweb/Webterminal/")
            await page.type('#txtUser', config.username)
            await page.type('#txtPassword', config.password)
            await page.click("#btnLogin")
            page.waitForTimeout(5000)
            await page.waitForNavigation()
            const frame = await page.frames().find(frame => frame.name() === 'Upper');
            await frame.evaluate(() => {
                const kommenBtn = Array.from(document.querySelectorAll('a#Kommen'))
                kommenBtn[0].click();
            })
            await page.waitForTimeout(2000)
            const frameStage = await page.frames().find(frame => frame.name() === 'Stage');
            await frameStage.evaluate(() => {
                const okBtn = Array.from(document.querySelectorAll('a#Stempelung1_StempelSection_btnOk'))
                okBtn[0].click();
            })
            browser.close()
    })
})
