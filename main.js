
const API_KEY = 'my key..'
// https://newsapi.org/v2/top-headlines?pageSize=3&country=kr&apiKey=${API_KEY}
// https://jspractice03.netlify.app/top-headlines?pageSize=3
let newsList = []
const menus = document.querySelectorAll(".menus button")
//console.log(menus)
menus.forEach(menu=>menu.addEventListener("click",()=>getNewsByCategory(event)))

const getLatesNews = async ()=>{
    const url = new URL(`https://jspractice03.netlify.app/top-headlines?pageSize=3`);
    const response = await fetch(url);
    const data = await response.json();
    //console.log("test",data);
    newsList = data.articles;
    render(); // newsList가 확정된 이후 render 호출
    console.log("뉴스 : ",newsList);
};

getLatesNews();


// 카테고리 
const getNewsByCategory = async(event)=>{
    const category = event.target.textContent.toLowerCase();
    console.log("category",category);
    const url = new URL(`https://jspractice03.netlify.app/top-headlines?category=${category}&pageSize=3`)
    const response = await fetch(url)
    const data = await response.json()
    console.log("data",data)

    newsList = data.articles;
    render();
}



// news 랜더링
const render=()=>{
    const newsHTML = newsList.map(item => {

        let imageUrl = item.urlToImage ? item.urlToImage : 'https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg';
        let desc = item.description ? (item.description.length > 200 ? item.description.substring(0, 200) + '...' : item.description) : '내용 없음';
        let sc = item.source.name ? item.source.name : 'no source';

        return `
            <div class="row news">
                <div class="col-lg-4" style="margin-bottom: 15px;">
                    <img class="newsImage" src="${imageUrl}" alt="img">
                </div>
                <div class="col-lg-8">
                    <h3>${item.title}</h3>
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


// 1. 카테고리 버튼 클릭 이벤트 추가
// 2. 카테코리별 뉴스 가져오기(필터)
// 3. 분류된 뉴스 보여주기(렌더)



// menu 
const toggleBtn = document.querySelector('.navbar-togglebtn');
const menu = document.querySelector('.menus');

toggleBtn.addEventListener('click', () => {
	
	menu.classList.toggle('active');
	
});

// 검색 on/off
const openSearch = () => {
    let inputArea = document.getElementById("inputArea");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
  };

// 검색 기능
const searchNews = async()=>{
    const keyword = document.getElementById("searchInput").value;
    console.log("키워드",keyword);
    const url = new URL(`https://jspractice03.netlify.app/top-headlines?country=kr&q=${keyword}`)
    const response = await fetch(url) // url 부른다
    const data = await response.json() // json 형태로 뽑는다
    console.log("키워드 data",data)
    
    newsList = data.articles; // 검색결과를 다시 리스트에 담기 

    render()  // 렌더링
}
