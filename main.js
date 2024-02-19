
//const API_KEY = 'my api key...'

let newsList = []

const getLatesNews = async ()=>{
    const url = new URL(`https://jspractice03.netlify.app/top-headlines`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render(); // newsList가 확정된 이후 render 호출
    console.log("뉴스 : ",newsList);
};

getLatesNews();



// news 랜더링

const render=()=>{
    const newsHTML = newsList.map(item=>` <div class="row news">
    <div class="col-lg-4" style="margin-bottom: 10px;">
        <img class="newsImage" src=${item.urlToImage} alt="img">
    </div>
    <div class="col-lg-8">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <div>
            ${item.source.name} · ${item.publishedAt}
        </div>
    </div>
</div>`).join('');

    console.log('html', newsHTML);

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