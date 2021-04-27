'use strict';

/* HANDLEBARS */
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-authorCloud-link').innerHTML),
};

/* GLOBAL */
const opts = {
  articleSelector: '.post', //# article list
  titleSelector: '.post-title', //# article title
  titleListSelector: '.titles', //# link list
  articleTagsSelector: '.post-tags .list', //# article tag list
  articleAuthorSelector: '.post-author',  //# author selector
  tagsListSelector: '.tags.list', //# right sidebar tag links
  cloudClassPrefix: 'cloud-size-', //# class names for tag cloud
  cloudClassCount: 5, //# num of classes for tag cloud sizing
  authorsListSelector: '.authors', //# right sidebar author links
};


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
  //> console.log('clickedElement:', clickedElement);
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
  console.log('> generateTitleLinks is working! customSelector: ', customSelector);
  //^ remove contents of titleList
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';
  //^ then for each article/ or each of the custom selected articles:
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  //> console.log('Articles: ', articles);

  //^ with a loop, using a single article, we download its ID into variable and then use it to generate <li>
  //or: let html = '';
  for (let article of articles) {
    //^ get the article id
    const articleId = article.getAttribute('id');
    //^ find the title element. Get the title from the title element
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    //^ create HTML of the link & save it to a const
    // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    //* [HANDLEBARS]
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
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
    //// console.log(tag + ' used ' + tags[tag] + ' times');
    tagInstances.push(tags[tag]);
  }
  //// console.log('tagInstances[] : ', tagInstances);
  //^ Return these numbers as an object containing 2 keys: max and min
  const params = {
    min: Math.min.apply(null, tagInstances),
    max: Math.max.apply(null, tagInstances),
  };

  return params;
};


const calculateCloudClass = function (count, params) {
  //// console.log('> count: ', count); console.log('> params: ', params);
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.cloudClassCount - 1) + 1);
  const className = opts.cloudClassPrefix + classNumber; //>console.log(className);
  return className;
};


const generateTags = function () {
  //*[NEW] create a new variable allTags with an empty object
  let allTags = {};
  //^ find all articles
  const articles = document.querySelectorAll(opts.articleSelector);

  //^ START LOOP: for every article:
  for (let article of articles) {
    //^ find tags wrapper
    const articleTagList = article.querySelectorAll(opts.articleTagsSelector);
    //^ make html variable with empty string
    let html = '';
    //^ get tags from data-tags attribute
    const articleTags = article.getAttribute('data-tags');
    //^ split tags into array
    const tagArray = articleTags.split(' ');

    //^ START LOOP: for each tag
    for (let tag of tagArray) {
      //^ generate HTML of the link
      //or: let tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      //* [HANDLEBARS]
      const linkHTMLData = { tag: tag };
      const linkHTML = templates.tagLink(linkHTMLData);
      //^ add generated code to html variable
      //or: html = html + ' ' + tagHTML;
      html += linkHTML;

      //^ [CLOUD] check if this link is NOT already in allTags
      if(!allTags[tag]){
        //^ [CLOUD] add tag to allTags object
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

  /* [[[[ TAG CLOUD ]]]] */
  //^ find list of tags in right column
  const tagList = document.querySelector(opts.tagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  //>console.log('tagsParams: ', tagsParams);

  //^ create variable for all links HTML code
  //or: let allTagsHTML = '';
  //*[HANLEBARS]
  const allTagsData = { tags: [] };

  //^ START LOOP: for each tag in allTags:
  for (let tag in allTags) {
    //^ generate code of a link and add it to allTagsHTML
    //or: allTagsHTML += '<li><a href="#tag-' + tag + '" + class="' + calculateCloudClass(allTags[tag],tagsParams) + '">' + tag + '</a></li>';
    //*[HANDLEBARS]
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateCloudClass(allTags[tag], tagsParams)
    });
  }

  //^ add HTML from allTagsHTML to tagList
  //or: tagList.innerHTML = allTagsHTML;
  //*[HANDLEBARS]
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  ////console.log('allTagsData: ', allTagsData);
  //> console.log('tagList: ', tagList);
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


const calculateAuthorParams = function (authors) {
  let authorInstances = [];
  for (let author in authors) {
    ////console.log(author + ' used ' + authors[author] + ' times');
    authorInstances.push(authors[author]);
  }
  ////console.log('authorInstances[] : ', authorInstances);
  //^ Return these numbers as an object containing 2 keys: max and min
  const params = {
    min: Math.min.apply(null, authorInstances),
    max: Math.max.apply(null, authorInstances),
  };

  return params;
};


const generateAuthors = function () {
  //>console.log('> generateAuthors is working!');
  //^ create a new variable allAuthors with an empty object
  let allAuthors = {};
  //^ find all articles
  const articles = document.querySelectorAll(opts.articleSelector);

  //^ START LOOP: for every article:
  for (let article of articles) {
    //^ find author wrapper
    const articleAuthorWrapper = article.querySelectorAll(opts.articleAuthorSelector);
    //^ make html variable with empty string
    let html = '';
    //^ get authors from data-author attribute
    const articleAuthor = article.getAttribute('data-author');
    //* [HANDLEBARS]
    //or: const authorHTMLData = { author: articleAuthor };
    let authorPersonals = articleAuthor.split(' ');
    const authorHTMLData = {
      id: articleAuthor,
      title: articleAuthor,
      name: authorPersonals[0],
      surname: authorPersonals[1]
    };
    //^ generate HTML of the link
    //or: const authorHTML = 'by <a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a>';
    //* [HANDLEBARS]
    const authorHTML = templates.authorLink(authorHTMLData);
    html += authorHTML;

    //* [NEW] check if this link is NOT already in allAuthors
    if(!allAuthors[articleAuthor]){
      //* [NEW] add articleAuthor to allAuthors object
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    //^ LOOP: insert HTML of all the links into the tags wrapper
    articleAuthorWrapper.forEach(element => {
      element.insertAdjacentHTML('beforeend', html);
      //or: element.innerHTML = html;
    });

    /* [[[[[ AUTHOR CLOUD ]]]] */
    //^ find list of authors in right column
    const authorList = document.querySelector(opts.authorsListSelector);
    const authorParams = calculateAuthorParams(allAuthors);
    //> console.log('authorParams: ', authorParams);

    //^ create variable for all links HTML code
    //or: let allAuthorsHTML = '';
    //* [HANLEBARS]
    const allAuthorsData = { authors: [] };

    //^ START LOOP: for each author in allAuthors:
    for (let author in allAuthors) {
      //^ generate code of a link and add it to allAuthorsHTML
      //or: allAuthorsHTML += '<li><a href="#author-' + author + '" class="' + calculateCloudClass(allAuthors[author], authorParams) + '"><span class="author-name">' + author + '</span></a></li>';
      //* [HANLEBARS] generate code of a link and add it to allAuthorsData
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateCloudClass(allAuthors[author], authorParams)
      });
    }

    //^ add HTML from allAuthorsHTML to authorList
    //or: authorList.innerHTML = allAuthorsHTML;
    //* [HANLEBARS]
    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
    //> console.log('authorList: ', authorList);
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
