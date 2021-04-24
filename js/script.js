'use strict';

/* GLOBAL */
const optArticleSelector = '.post', //# article list
  optTitleSelector = '.post-title', //# article title
  optTitleListSelector = '.titles', //# link list
  optArticleTagsSelector = '.post-tags .list', //# article tag list
  optTagsListSelector = '.tags.list', //# right sidebar tag links
  optArticleAuthorSelector = '.post-author',  //# author selector
  optCloudClassPrefix = 'tag-size-', //# class names for tag cloud
  optCloudClassCount = 5; //# num of classes for tag cloud sizing

const buttonAllPosts = document.getElementById('btn-allposts');
const showAllPostLinks = function (event) {
  event.preventDefault();
  console.log('Show all posts!');
  generateTitleLinks();
};
buttonAllPosts.addEventListener('click', showAllPostLinks);


const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('clickedElement:', clickedElement);
  //^ remove class 'active' from all article links
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  //^ add class 'active' to the clicked link
  clickedElement.classList.add('active');

  //^ remove class 'active' from all articles
  const activeArticles = document.querySelectorAll('.posts article.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  //^ get 'href' attribute from the clicked link
  const articleSelector = clickedElement.getAttribute('href');
  //^ find the correct article using the selector (value of 'href' attribute)
  const targetArticle = document.querySelector(articleSelector);
  //^ add class 'active' to the correct article
  targetArticle.classList.add('active');
};


const generateTitleLinks = function(customSelector = '') {
  console.log('> generateTitleLinks is working! customSelector : ', customSelector);
  //^ remove contents of titleList
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  //^ then for each article/ or each of the custom selected articles:
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  //> console.log('Articles: ', articles);

  //^ with a loop, using a single article, we download its ID into variable and then use it to generate <li>
  //or: let html = '';
  for (let article of articles) {
    //^ get the article id
    const articleId = article.getAttribute('id');
    //^ find the title element. Get the title from the title element
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    //^ create HTML of the link & save it to a const
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    //^ insert link into html variable
    //or: html = html + linkHTML;
    //^ insert link into titleList
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }
  //or: titleList.innerHTML = html;

  //! Code below is placed at the end of generateTitleLinks() to be fired on each execution
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
};

generateTitleLinks();


const calculateTagsParams = function (tags) {
  let tagInstances = [];
  for (let tag in tags) {
    //> console.log(tag + ' used ' + tags[tag] + ' times');
    tagInstances.push(tags[tag]);
  }
  //> console.log('tagInstances[] : ', tagInstances);
  //^ Return these numbers as an object containing 2 keys: max and min
  const params = {
    min: Math.min.apply(null, tagInstances),
    max: Math.max.apply(null, tagInstances),
  };

  return params;
};


const calculateTagClass = function (count, params) {
  //// console.log('> count: ', count); console.log('> params: ', params);
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  const className = optCloudClassPrefix + classNumber; //>console.log(className);
  return className;
};


const generateTags = function () {
  //*[NEW] create a new variable allTags with an empty object
  let allTags = {};
  //^ find all articles
  const articles = document.querySelectorAll(optArticleSelector);

  //^ START LOOP: for every article:
  for (let article of articles) {
    //^ find tags wrapper
    const articleTagList = article.querySelectorAll(optArticleTagsSelector);
    //^ make html variable with empty string
    let html = '';
    //^ get tags from data-tags attribute
    const articleTags = article.getAttribute('data-tags');
    //^ split tags into array
    const tagArray = articleTags.split(' ');

    //^ START LOOP: for each tag
    for (let tag of tagArray) {
      //^ generate HTML of the link
      let tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      //^ add generated code to html variable
      html = html + ' ' + tagHTML;

      //* [NEW] check if this link is NOT already in allTags
      if(!allTags[tag]){
        //* [NEW] add tag to allTags object
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      //^ END LOOP: for each tag
    }
    //^ insert HTML of all the links into the tags wrapper
    articleTagList.forEach(element => {
      element.insertAdjacentHTML('beforeend', html);
    });
  }
  //* [NEW] find list of tags in right column
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  //>console.log('tagsParams: ', tagsParams);

  //* [NEW] create variable for all links HTML code
  let allTagsHTML = '';

  //* [NEW] START LOOP: for each tag in allTags:
  for (let tag in allTags) {
    //* [NEW] generate code of a link and add it to allTagsHTML
    allTagsHTML += '<li><a href="#tag-' + tag + '" + class="' + calculateTagClass(allTags[tag],tagsParams) + '">' + tag + ' (' + allTags[tag] + ') ' + '</a></li>';
  }

  //* [NEW] add HTML from allTagsHTML to tagList
  tagList.innerHTML = allTagsHTML;
  //// console.log('allTags: ', allTags);
  console.log('tagList: ', tagList);
  //^ END LOOP: for every article
};

generateTags();


const tagClickHandler = function (event) {
  //^ prevent default action for this event
  event.preventDefault();
  //^ make new constant named "clickedElement" and give it the value of "this"
  const clickedElement = this;
  //^ make a new constant "href" and read the attribute "href" of the clicked element
  const href = clickedElement.getAttribute('href');
  //^ make a new constant "tag" and extract tag from the "href" constant
  const tag = href.substr(5);
  //or: const tag = href.replace('#tag-', '');
  //^ find all tag links with class active
  const activeTagList = document.querySelectorAll('a.active[href^="#tag-"]');

  //^ START LOOP: for each active tag link
  for (let activeTag of activeTagList) {
    //^ remove class active
    activeTag.classList.remove('active');
    //^ END LOOP: for each active tag link
  }

  //^ find all tag links with "href" attribute equal to the "href" constant
  const clickedTagLinks = document.querySelectorAll('a[href="' + href + '"]');

  //^ START LOOP: for each found tag link
  for (let clickedTagLink of clickedTagLinks) {
    //^ add class active
    clickedTagLink.classList.add('active');
    //^ END LOOP: for each found tag link
  }
  //> console.log('clickedTagLinks : ', clickedTagLinks);
  //^ execute function "generateTitleLinks" with article selector as argument
  generateTitleLinks('[data-tags~="' + tag + '"]');
};


const addClickListenersToTags = function () {
  //^ find all links to tags
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  //> console.log('tagLinks : ', tagLinks);

  //^ START LOOP: for each link
  for (let tagLink of tagLinks) {
    //^ add tagClickHandler as event listener for that link
    tagLink.addEventListener('click', tagClickHandler);
  }
  //^ END LOOP: for each link
};

addClickListenersToTags();


const generateAuthors = function () {
  //>console.log('> generateAuthors is working!');
  //^ find all articles
  const articles = document.querySelectorAll(optArticleSelector);

  //^ START LOOP: for every article:
  for (let article of articles) {
    //^ find author wrapper
    const articleAuthorWrapper = article.querySelectorAll(optArticleAuthorSelector);
    //^ make html variable with empty string
    let html = '';
    //^ get authors from data-author attribute
    const articleAuthor = article.getAttribute('data-author');
    //^ generate HTML of the link
    const authorHTML = 'by <a href="#author-' + articleAuthor + '"><span>' + articleAuthor  + '</span></a>';
    html = html + authorHTML;

    //^ LOOP: insert HTML of all the links into the tags wrapper
    articleAuthorWrapper.forEach(element => {
      element.insertAdjacentHTML('beforeend', html);
      //or: element.innerHTML = html;
    });
  }
  //^ END LOOP: for every article
};

generateAuthors();


const authorClickHandler = function (event) {
  //>console.log('> authorClickHandler is working!');
  //^ prevent default action for this event
  event.preventDefault();
  const clickedElement = this;
  //>console.log('clickedElement : ', clickedElement);
  //^ make a new constant "href" and read the attribute "href" of the clicked element
  const href = clickedElement.getAttribute('href');
  //^ make a new constant "authorTag" and extract authorTag from the "href" constant
  const authorTag = href.replace('#author-', '');
  //or: href.substr(8);
  //^ find all tag links with class active
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  //> console.log('activeAuthors : ', activeAuthors);

  //^ START LOOP: for each active author link
  for (let activeAuthor of activeAuthors){
    //^ remove class active
    activeAuthor.classList.remove('active');
  }
  //^ END LOOP: for each active tag link

  //^ find all author links with "href" attribute equal to the "href" constant
  const authorLinks = document.querySelectorAll('a[href^="#author-' + authorTag + '"]');

  //^ START LOOP: for each found tag link
  for (let authorLink of authorLinks){
    //^ add class active
    authorLink.classList.add('active');
    //> console.log('authorLink : ', authorLink);
  }
  //^ END LOOP: for each found author link

  //! execute function "generateTitleLinks" with author selector as argument
  generateTitleLinks('[data-author="' + authorTag + '"]');
};


const addClickListenersToAuthors = function () {
  //^ find all links to authors
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  //^ START LOOP: for each link
  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
  //^ END LOOP: for each link
};

addClickListenersToAuthors();
