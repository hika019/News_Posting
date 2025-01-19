const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const cnn = "https://www.cnn.co.jp";

const scrapePostDate = async(url) => {
    console.log('Scraping post date from', url);

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const dateElement = $('.metadata-updatetime');
        let dateText = dateElement.text().trim();
        if (dateText === null) {
            console.log('Date not found');
            return;
        }
        dateText = dateText.replace(/[a-zA-Z]+/g, '').replace('    ', ' ').trim();
        const [datePart, timePart] = dateText.split(' ');
        const [year, month, day] = datePart.split('.').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        const date = new Date(year, month - 1, day, hour, minute);
        console.log(date);
        return date;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * @typedef {Object} NewsItem
 * @property {string} title - ニュースのタイトル
 * @property {string} link - ニュースのリンク
 * @property {Date} date - ニュースの投稿日時
 */

/**
 * ニュースのタイトルとリンクをスクレイピングする関数
 * @returns {Promise<NewsItem[]>} ニュースアイテムの配列を含むPromise
 */
const scrapeNewsList = async() => {
    let newsList = [];
    try {
        const response = await axios.get(cnn+'/archives/');
        const $ = cheerio.load(response.data);
        const news = [];

        $('.pg-container-main .list-news-line li').each((index, element) => {
            const title = $(element).find('a').text().replace('\n', '').trim();
            let link = $(element).find('a').attr('href');
            console.log("list: ", title, link);
            if (link && !link.startsWith(cnn)) {
                link = cnn + link;
            }
            if (title && link) {
                newsList.push({ title, link });
            }
        });

        //console.log(newsWithDates);
    } catch (error) {
        console.error(error);
    } finally {
        console.log("finally", newsList);
        const newsWithDates = await Promise.all(newsList.map(async (news) => {
            news.date = await scrapePostDate(news.link);
            return news;
        }));
        return newsWithDates;
    }
}

module.exports = { scrapeNewsList };