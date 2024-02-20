
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
const inputField = document.getElementById("searchInput");
const searchNews = async()=>{
    const keyword = inputField.value.trim(); // 입력값에서 공백 제거
    if (keyword === "") { // 공백 입력하면 
        inputField.value = ""; // 입력창 비우기 
        alert('검색어를 입력하세요!'); // 알림창
        inputField.focus(); // 입력창으로 포커스
        return; // 검색 중지
    }

    console.log("키워드",keyword);
    const url = new URL(`https://jspractice03.netlify.app/top-headlines?country=kr&q=${keyword}`)
    const response = await fetch(url) // url 부른다
    const data = await response.json() // json 형태로 뽑는다
    console.log("키워드 data",data)
    
    newsList = data.articles; // 검색결과를 다시 리스트에 담기 
    // 검색 결과가 없을 때 
    if(newsList.length==0){
        let message = document.getElementById("message");
        message.textContent = '결과 없음';
    }
    
    render()  // 렌더링
}


// 로고 클릭 시 다시 리셋되게 
const totalNewsWrapper = document.querySelector("#title");
const logoImage = totalNewsWrapper.querySelector("#totalNews");
logoImage.addEventListener("click", () => {
    location.reload();
});


// 검색어 입력 창에 이벤트 리스너 추가
inputField.addEventListener("keydown", function(event) {
    // 엔터 키를 눌렀을 때
    if (event.key === "Enter") {
        // 검색 실행
        searchNews();
    }
});