'use strict';

/* generateTitleLinks() helper variables */
const optArticleSelector = '.post', //article list
  optTitleSelector = '.post-title', //article title
  optTitleListSelector = '.titles'; //link list


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
  console.log('targetArticle: ', targetArticle);
};


const generateTitleLinks = function () {
  console.log('generateTitleLinks is working!');

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* then for each article: */
  const articles = document.querySelectorAll(optArticleSelector);
  // console.log('Articles: ', articles);

  /* with a loop, using a single article, we download its ID into variable and then use it to generate <li> */
  // let html = '';
  for (let article of articles) {

    /* get the article id*/
    const articleId = article.getAttribute('id');

    /* find the title element & get the title from the title element*/
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    // console.log('articleId: ', articleId);
    // console.log('ArticleTitle: ', articleTitle);

    /* create HTML of the link & save it to a const */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    // console.log(linkHTML);

    /* insert link into html variable */
    // html = html + linkHTML;

    /* insert link into titleList */
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }
  // titleList.innerHTML = html;
  console.log('titleList: ', titleList);

  /* NEBULA */
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
};


generateTitleLinks();

/* it is important that the links are generated before you assign listeners to them, because otherwise, you'd assign listeners, remove the links, generate new ones - and they would't have the titleClickHandler function assigned to them */

/* NEBULA: Code below will ultimately be placed at the end of generateTitleLinks() to be fired on each execution */