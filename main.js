
// const API_KEY = 'my key'
// https://newsapi.org/v2/top-headlines?&country=kr&apiKey=${API_KEY}
// https://jspractice03.netlify.app/top-headlines?

console.log("test !!!")

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
        console.log("ddd",data)

    if(response.status===200){
        
        if(data.articles.length===0){
            throw new Error("검색 결과가 없습니다.");
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
const getLateNews = async ()=>{
    url = new URL(`https://jspractice03.netlify.app/top-headlines?`);
    getNews();
};
// 함수 호출
getLateNews();


// 카테고리 
const getNewsByCategory = async(event)=>{
    const category = event.target.textContent.toLowerCase();
    page = 1;
    console.log("category",category);
    url = new URL(`https://jspractice03.netlify.app/top-headlines?category=${category}`)
    getNews();
}

// 뉴스 보여주기
const render = () => {
	const newsHtml = newsList.map(news => `<div class="row news">
		<div class="col-lg-4" style="margin-bottom: 15px;">
			<img style="border-radius:5px;" onclick="window.open('${news.url}')" src="${news.urlToImage}" alt="뉴스 이미지" class="newsImage" onerror="imgError(this)">
		</div>
		<div class="col-lg-8">
			<h3 onclick="window.open('${news.url}')">${news.title}</h3>
			<p onclick="window.open('${news.url}')">${news.description == null || news.description == "" ? "내용없음": news.description.length > 200 ? news.description.substring(0, 200) + "..." : news.description}</p>
            <div style="display:flex; justify-content: space-between;">
            <div style="color:gray;">${news.source.name || "no source"}</div><div style="color:lightgray;">${moment(news.publishedAt).fromNow()}</div>
            </div>
            </div>
	</div>`
	).join('');
	document.getElementById('newsBoard').innerHTML = newsHtml;
	};

// 이미지 에러 핸들링
const imgError = (image) => {
        image.onerror = null; // 이미지 에러 핸들러를 중복 호출하지 않도록 이벤트 리스너 제거
        image.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU";
};

// 에러 랜더링
const errorRender =(errorMessage)=>{
    const errorHTML =`<div class="alert alert-dark" style="text-align:center; margin-top: 20px;" role="alert">
    ${errorMessage}</div>`;
    document.getElementById("newsBoard").innerHTML=errorHTML;
    //document.querySelector(".pagination").style.display = "none"; // 에러메세지가 뜰 때만 페이징 부분 숨기기
}


// pagination 
const paginationRender=()=>{
    // totalResult
    // page
    // pageSize
    // totalPages
    let totalPages = Math.ceil(totalResult/pageSize);
    // pageGroup
    let pageGroup = Math.ceil(page/groupSize);
    // lastPage
    let lastPage = pageGroup * groupSize;

    // 페이지가 5 이하일 때는 최대 3개 페이지만 보여주기 -> 이거 다시

    //마지막 페이지그룹이 그룹사이즈보다 작을 경우 lastPage = totalPage 처리
    if(lastPage > totalPages){
        lastPage=totalPages
    }
    // firstPage
    let firstPage = lastPage - (groupSize-1)<=0? 1: lastPage - (groupSize-1);

    let paginationHTML = "";

    // 첫번째 페이지일 때를 제외하고 이전 링크 보이게 하기
    if (page !== 1) {
        paginationHTML += `<li class="page-item" onclick="moveToPage(1)"><a class="page-link">&lt;&lt;</a></li>
      <li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link">&lt;</a></li>`;
    }

    // 페이지 번호 추가
    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `<li class="page-item ${i === page ? "active" : ""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
    }

    // 마지막 페이지일 때 제외하고 다음 기능 보이게 하기 
    if (page !== totalPages) {
        paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link">&gt;</a></li>
        <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link">&gt;&gt;</a></li>`;
    }
    // 페이지가 5 이하일 때는 이전 페이지와 다음 페이지 버튼을 모두 숨김
    if (totalPages <= 5) {
        paginationHTML = paginationHTML.replace(/<li class="page-item" onclick="moveToPage\(\d+\)"><a class="page-link">&lt;<\/a><\/li>/, "")
                                       .replace(/<li class="page-item" onclick="moveToPage\(\d+\)"><a class="page-link">&lt;&lt;<\/a><\/li>/, "")
                                       .replace(/<li class="page-item" onclick="moveToPage\(\d+\)"><a class="page-link">&gt;<\/a><\/li>/, "")
                                       .replace(/<li class="page-item" onclick="moveToPage\(\d+\)"><a class="page-link">&gt;&gt;<\/a><\/li>/, "");
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
    page = 1;
    const keyword = inputField.value.trim(); // 입력값에서 공백 제거
    if (keyword === "") { // 공백 입력하면 
        inputField.value = ""; // 입력창 비우기 
        alert('검색어를 입력하세요!'); // 알림창
        inputField.focus(); // 입력창으로 포커스
        return; // 검색 중지
    }
    url = new URL(`https://jspractice03.netlify.app/top-headlines?q=${keyword}`)
    //https://jspractice03.netlify.app/top-headlines?country=kr&q=${keyword}
    //https://newsapi.org/v2/top-headlines?&country=kr&q=${keyword}&apiKey=${API_KEY}
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

// 페이지 전환 함수
const nextPage = () => {
    const newsBoard = document.getElementById("newsBoard");
    newsBoard.classList.add("fadeOut");
    setTimeout(() => {
        // 여기에 페이지 전환 코드 추가
        // 예: 다음 페이지로 이동하는 로직 추가
        newsBoard.classList.remove("fadeOut");
    }, 500); // 애니메이션 지속 시간과 일치해야 함 (여기서는 0.5초)
}

const prevPage = () => {
    const newsBoard = document.getElementById("newsBoard");
    newsBoard.classList.add("fadeOut");
    setTimeout(() => {
        // 여기에 페이지 전환 코드 추가
        // 예: 이전 페이지로 이동하는 로직 추가
        newsBoard.classList.remove("fadeOut");
    }, 500); // 애니메이션 지속 시간과 일치해야 함 (여기서는 0.5초)
}

// 스크롤 
// 페이지 상단으로 스크롤하는 함수
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // 스크롤 부드럽게 이동
    });
}
// 페이지가 로드되었을 때 실행되는 코드
window.onload = function() {
    // 페이지 상단으로 스크롤하는 버튼
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    // 버튼이 존재하면
    if (scrollTopBtn) {
        // 페이지를 스크롤할 때마다 실행되는 함수
        window.addEventListener('scroll', function() {
            // 현재 스크롤 위치가 300보다 크면 버튼을 보이게 함
            if (window.pageYOffset > 400) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });
        // 버튼에 클릭 이벤트 추가
        scrollTopBtn.addEventListener("click", scrollToTop);
    }
};

// 날짜
const calenderArea=document.querySelector('.calendarArea')
const calenderMobile=document.querySelector('.calendarArea-mobile')
const times=moment().format('YYYY년 MM월 DD일');
calenderArea.innerHTML=`${times}`
calenderMobile.innerHTML=`${times}`
