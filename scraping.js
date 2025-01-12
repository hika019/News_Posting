const puppeteer = require('puppeteer');
process.on('uncaughtException', (err) => {
    console.log(`${err.stack}`);
});
require("dotenv").config();

const scrapePostDate = async(url) => {
    const browser = await puppeteer.launch({ timeout: process.env.TIMEOUT }); // タイムアウトを60秒に延長
    let date = null;
    try {
        const page = await browser.newPage();
        await page.goto(url, { timeout: 60000 }); // タイムアウトを60秒に延長
        const postDate = await page.evaluate(() => {
            const dateElement = document.querySelector('.metadata-updatetime');
            var dateText = dateElement.textContent ? dateElement.textContent.trim() : null;
            console.log(dateText);
            if (dateText === null) {
                return null;
            }
            dateText = dateText.replace(/[a-zA-Z]+/g, '').replace('    ', ' ').trim();
            return dateText;
        });
        const postDateText = postDate;
        if (postDateText === null) {
            console.log('Date not found');
            return;
        }
        const [datePart, timePart] = postDateText.split(' ');
                    const [year, month, day] = datePart.split('.').map(Number);
                    const [hour, minute] = timePart.split(':').map(Number);
        date = new Date(year, month - 1, day, hour, minute);
        console.log(date);
    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
        return date;
    }
}

const scrapeNewsList = async() => {
    const browser = await puppeteer.launch({ timeout: process.env.TIMEOUT }); // タイムアウトを60秒に延長
    let newsWithDates = [];
    try {
        const page = await browser.newPage();
        await page.goto('https://www.cnn.co.jp/archives/'); // タイムアウトを60秒に延長
        let newsList = await page.evaluate(() => {
            const news = [];
            document.querySelectorAll('.list-news-line li').forEach(item => {
                const links = item.querySelectorAll('a');
                const title = links.length > 1 ? links[1].textContent.replace(/\n/g, '').trim() : null;
                const link = item.querySelector('a').href;
                if (title !== null && link !== null) {
                    news.push({ title, link });
                }
            });
            return news;
        });
        console.log(newsList);;
        // 非同期処理を待つ
        newsWithDates = await Promise.all(newsList.map(async (news) => {
            console.log(news.link);
            news.date = await scrapePostDate(news.link);
            return news;
        }));

        console.log(newsWithDates);
    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
        return newsWithDates;
    }
}

scrapeNewsList().then(result => console.log('aaa', result));