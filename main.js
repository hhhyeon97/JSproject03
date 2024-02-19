
//const API_KEY = 'my api key...'

let newsList = []

const getLatesNews = async ()=>{
    const url = new URL(`https://jspractice03.netlify.app/top-headlines?pageSize=5`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render(); // newsList가 확정된 이후 render 호출
    console.log("뉴스 : ",newsList);
};

getLatesNews();



// news 랜더링

const render=()=>{
    const newsHTML = newsList.map(item => {

        let imageUrl = item.urlToImage ? item.urlToImage : 'https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg'; // 이미지가 없는 경우 대체 이미지 사용
        let desc = item.description ? (item.description.length > 200 ? item.description.substring(0, 200) + '...' : item.description) : '내용 없음';
        let sc = item.source.name ? item.source.name : 'no source';

        return `
            <div class="row news">
                <div class="col-lg-4" style="margin-bottom: 10px;">
                    <img class="newsImage" src="${imageUrl}" alt="img">
                </div>
                <div class="col-lg-8">
                    <h2>${item.title}</h2>
                    <p>${desc}</p>
                    <div>
                        ${sc} ·  ${moment(
                            item.publishedAt
                         ).fromNow()}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById("newsBoard").innerHTML=newsHTML;
}








// menu 
const toggleBtn = document.querySelector('.navbar-togglebtn');
const menu = document.querySelector('.menus');

toggleBtn.addEventListener('click', () => {
	
	menu.classList.toggle('active');
	
});

// search
const openSearch = () => {
    let inputArea = document.getElementById("inputArea");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
  };