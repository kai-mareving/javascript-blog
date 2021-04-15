'use strict';

/** GLOBAL **/
const optArticleSelector = '.post', //article list
  optTitleSelector = '.post-title', //article title
  optTitleListSelector = '.titles', //link list
  optArticleTagsSelector = '.post-tags .list'; //article tag list


const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  // console.log('clickedElement:', clickedElement);

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
  // console.log('targetArticle: ', targetArticle);
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
  // console.log('titleList: ', titleList);

  /* Code below is placed at the end of generateTitleLinks() to be fired on each execution */
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
};


generateTitleLinks();


function generateTags(){
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagList = article.querySelectorAll(optArticleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    // console.log('articleTags : ', articleTags);

    /* split tags into array */
    const tagArray = articleTags.split(' ');
    console.log('tagArray : ', tagArray);

    /* START LOOP: for each tag */
    for (let tag of tagArray) {
      /* generate HTML of the link */
      let tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      console.log('tagHTML : ', tagHTML);

      /* add generated code to html variable */
      html = html + ' ' + tagHTML;
      /* END LOOP: for each tag */
    }
    console.log('html : ', html);

    /* insert HTML of all the links into the tags wrapper */
    tagList.forEach(element => {
      element.insertAdjacentHTML('beforeend', html);
    });
    console.log('tagList : ', tagList);
  }
  /* END LOOP: for every article: */
}

generateTags();