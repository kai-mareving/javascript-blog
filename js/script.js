'use strict';

/*** Call active article to main column ***/
const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    console.log('clickedElement:', clickedElement);
    
    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
    console.log('targetArticle: ',targetArticle);
}

/*** Generate title links ***/
const articles = document.querySelectorAll('.posts article');
const articleIdList = [];
for (let article of articles) {
    let articleId = article.getAttribute('id');
    articleIdList.push(articleId);
}

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles';

const generateTitleLinks = function () {
    console.log('generateTitleLinks is working!' + '\n' + 'Our articles: ', articles);
    console.log('Article IDs: ', articleIdList);
    
    /* remove contents of titleList */
    /* then for each article: */
        /* get the article id (getAttribute)*/    
        /* find the title element & get the title from the title element (querySelector on article) */
        /* create HTML of the link & save it to a const */
        /* insert link into titleList */
}


/*** Action! ***/
const links = document.querySelectorAll('.titles a');
for (let link of links) {
    link.addEventListener('click', titleClickHandler);
}

generateTitleLinks();