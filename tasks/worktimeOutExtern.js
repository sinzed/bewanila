const puppeteer = require('puppeteer')
const fs = require('fs').promises;
const config = require('../config/config')

describe('add working hours not because you are lazy but because you have something more important to do', ()=>{
    it('should add working hours by correcting comeExternOutFilter', async function () {
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
            try {
              const cookiesString = await fs.readFile('./cookies.json');
              const cookies = JSON.parse(cookiesString);
              await page.setCookie(...cookies);
            }
            catch(ex){
              console.warn(ex);
              await page.goto(config.externalUrl)
              // await page.waitForNavigation()
              await page.waitForTimeout(2000)
              await page.type('#i0116', config.email)
              await page.click('#idSIButton9')
              await page.waitForTimeout(2000)
              await page.type('#i0118', config.accountPass)
              await page.click('#idSIButton9')
              await page.waitForSelector('#idChkBx_SAOTCAS_TD')
              await page.click("#idChkBx_SAOTCAS_TD")
              await page.waitForSelector('#idBtn_Back')
              await page.click('#idBtn_Back')
              await page.waitForSelector('#txtUser')
              const cookies = await page.cookies();
              await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
            }
            await page.goto(config.externalUrl)
            await page.type('#txtUser', config.username)
            await page.type('#txtPassword', config.password)
            await page.click("#btnLogin")
            await page.waitForTimeout(3000)
            // await page.waitForNavigation()
            const frame = await page.frames().find(frame => frame.name() === 'Upper');
            await frame.evaluate(() => {
                const kommenBtn = Array.from(document.querySelectorAll('a#Gehen'))
                kommenBtn[0].click();
            })
            await page.waitForTimeout(2000)
            const frameStage = await page.frames().find(frame => frame.name() === 'Stage');
            await frameStage.evaluate(() => {
                const okBtn = Array.from(document.querySelectorAll('a#Stempelung1_StempelSection_btnOk'))
                okBtn[0].click();
            })
    })
})
