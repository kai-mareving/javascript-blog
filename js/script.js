'use strict';

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
    const linkHash = clickedElement.getAttribute('href');
    const hrefValue = linkHash.replaceAll('#', ''); 

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const hrefArticle = document.getElementById(hrefValue);

    /* [DONE] add class 'active' to the correct article */
    hrefArticle.classList.add('active');
    console.log(hrefArticle);
}

const links = document.querySelectorAll('.titles a');
for (let link of links) {
    link.addEventListener('click', titleClickHandler);
}