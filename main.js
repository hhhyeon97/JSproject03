
const API_KEY = 'my key..'
// https://newsapi.org/v2/top-headlines?pageSize=3&country=kr&apiKey=${API_KEY}
let newsList = []
const menus = document.querySelectorAll(".menus button")
menus.forEach(menu=>menu.addEventListener("click",()=>getNewsByCategory(event)))

let url = new URL(`https://jspractice03.netlify.app/top-headlines?`);

// 페이징과 관련한 변수 설정
let totalResult = 0
let page = 1
const pageSize = 10
const groupSize = 5


// 중복되는 코드 묶기+에러 핸들링
const getNews = async()=>{
    try {
        url.searchParams.set("page",page); // - > &page=page 와 같다
        url.searchParams.set("pageSize",pageSize);
        
        const response = await fetch(url); // url 부른다
        const data = await response.json(); // json 형태로 뽑는다

    if(response.status===200){
        
        if(data.articles.length===0){
            throw new Error("No result for this search");
        }
        newsList = data.articles; // 뽑은 데이터를 배열에 담는다
        totalResult = data.totalResults; // 페이징을 위해 totalResult 데이터 담기
        render(); // 화면에 보여준다
        paginationRender(); // 화면 렌더 후 페이징도 보여준다
    }else{
        throw new Error(data.message)
    }    
    }catch(error){
        console.log("error",error.message)
        errorRender(error.message);
    }
}

// 기본 뉴스 
const getLatesNews = async ()=>{
    url = new URL(`https://jspractice03.netlify.app/top-headlines?pageSize=3`);
    getNews();
};
// 함수 호출
getLatesNews();


// 카테고리 
const getNewsByCategory = async(event)=>{
    const category = event.target.textContent.toLowerCase();
    console.log("category",category);
    url = new URL(`https://jspractice03.netlify.app/top-headlines?category=${category}&pageSize=3`)
    getNews();
}

// 뉴스 랜더링
const render = () => {
    if (newsList.length === 0) { // 검색 결과가 없을 때
        document.getElementById("newsBoard").innerHTML = `
            <div class="no-results">
            '<span class="highlight">${inputField.value}</span>'에 대한 검색 결과가 없습니다.
            </div>
        `;
    } else { // 검색 결과가 있을 때
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

        document.getElementById("newsBoard").innerHTML = newsHTML;
    }
}

// 에러 랜더링
const errorRender =(errorMessage)=>{
    const errorHTML =`<div class="alert alert-danger" role="alert">
    ${errorMessage}</div>`;

    document.getElementById("newsBoard").innerHTML=errorHTML;
}


// pagination 
const paginationRender=()=>{
    // totalResult
    // page
    // pageSize
    // totalPages
    const totalPages = Math.ceil(totalResult/pageSize);
    // pageGroup
    const pageGroup = Math.ceil(page/groupSize);
    // lastPage
    const lastPage = pageGroup * groupSize;
    //마지막 페이지그룹이 그룹사이즈보다 작을 경우 lastPage = totalPage 처리
    if(lastPage > totalPages){
        lastPage=totalPages
    }
    // firstPage
    const firstPage = lastPage - (groupSize-1)<=0? 1: lastPage - (groupSize-1);

    let paginationHTML = "";

    // 첫번째 페이지일 때를 제외하고 이전 링크 보이게 하기
    if (page !== 1) {
        paginationHTML += `<li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link">Previous</a></li>`;
    }

    // 페이지 번호 추가
    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `<li class="page-item ${i === page ? "active" : ""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
    }

    // 마지막 페이지일 때 제외하고 다음 기능 보이게 하기 
    if (page !== totalPages) {
        paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link">Next</a></li>`;
    }

    document.querySelector(".pagination").innerHTML = paginationHTML;

}

const moveToPage=(pageNum)=>{
    console.log("move to page",pageNum);
    page = pageNum; // page값 유동적으로 변경
    getNews()
}


// 메뉴바
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
    url = new URL(`https://jspractice03.netlify.app/top-headlines?country=kr&q=${keyword}`)

    getNews();
}

// 모바일 검색 기능
const mobileInputField = document.getElementById("mobileInput");
const mobileSearchNews = async()=>{
    const keyword = mobileInputField.value.trim(); // 입력값에서 공백 제거
    if (keyword === "") { // 공백 입력하면 
        mobileInputField.value = ""; // 입력창 비우기 
        alert('검색어를 입력하세요!'); // 알림창
        mobileInputField.focus(); // 입력창으로 포커스
        return; // 검색 중지
    }
    url = new URL(`https://jspractice03.netlify.app/top-headlines?country=kr&q=${keyword}`)

    getNews();
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
mobileInputField.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        mobileSearchNews();
    }
});