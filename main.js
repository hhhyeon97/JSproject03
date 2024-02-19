
//const API_KEY = 'my api key...'

let news = []

const getLatesNews = async ()=>{
    const url = new URL(`https://jspractice03.netlify.app/top-headlines`);
    const response = await fetch(url);
    const data = await response.json();
    news = data.articles;
    console.log("뉴스 : ",news);
};

getLatesNews();