
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