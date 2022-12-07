API_KEY = '';

const searchTxt = document.querySelector('#search-txt');
const searchBtn = document.querySelector('#search-btn');
const article = document.querySelector('article');
const leftBtn = document.querySelector('.btn--left');
const rightBtn = document.querySelector('.btn--right');
const currentPage = document.querySelector('.number');
const classification = document.querySelector('.classification');
const century = document.querySelector('#century');
const noImage = 'assets/images/no-image.png';

let nextPage, previousPage;
let searchTerm = '';
let selectedClassification = '';
let selectedCentury = '';

const classificationArray = [
    'Jewelry = 19',
    'Paintings = 26',
    'Mosaics = 149',
    'Books = 47',
    'Drawings = 21',
    'Sculpture = 30',
    'Gems = 1078',
    'Vessels = 57',
];

classificationArray.forEach((element) => {
    const name = document.createElement('li');
    name.textContent = element.split(' ')[0];
    classification.appendChild(name);
    const id = element.split(' ')[2];
    name.addEventListener('click', () => {
        selectedClassification = id;
        searchTerm = searchTxt.value;
        getSearchResults(searchTerm, selectedClassification, selectedCentury);
    });
});

// create a function which fetches the data for the next and previous page
const fetchPages = (url) => {
    if (url) {
        article.textContent = '';
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                nextPage = data.info.next;
                previousPage = data.info.prev;
                currentPage.innerHTML = data.info.page;
                generateGalleryObjects(data);
            });
    } else return;
};

searchBtn.addEventListener('click', () => {
    article.textContent = '';
    searchTerm = searchTxt.value;
    getSearchResults(searchTerm, selectedClassification, selectedCentury);
    searchTxt.value = '';
});

rightBtn.addEventListener('click', () => {
    fetchPages(nextPage);
});

leftBtn.addEventListener('click', () => {
    fetchPages(previousPage);
});

century.addEventListener('change', () => {
    searchTerm = searchTxt.value;
    selectedCentury = century.value;
    console.log(century.value);
    getSearchResults(searchTerm, selectedClassification, selectedCentury);
});

function getCentury() {
    fetch(
        `https://api.harvardartmuseums.org/century?size=100&apikey=${API_KEY}`
    )
        .then((response) => response.json())
        .then((data) =>
            data.records.forEach((element) => {
                const option = document.createElement('option');
                option.text = element.name;
                option.value = element.id;
                century.appendChild(option);
            })
        );
}

getCentury();

const generateGalleryObjects = (array) => {
    array.records.forEach((obj) => {
        const articleContainer = document.createElement('div');
        articleContainer.classList.add('card');
        const image = document.createElement('img');
        obj.primaryimageurl
            ? (image.src = obj.primaryimageurl)
            : (image.src = 'assets/images/no-image.png');
        const articleContent = document.createElement('div');
        articleContent.innerHTML = `<p>${obj.objectnumber}</p><p>${
            obj.people ? obj.people[0].name : ''
        }
            </p><p>${obj.title}</p><p>${obj.worktypes[0].worktype}</p>`;
        const readMoreBtn = document.createElement('a');
        readMoreBtn.textContent = 'Read more';
        readMoreBtn.setAttribute('href', `${obj.url}`);
        readMoreBtn.setAttribute('target', '_blank');
        articleContainer.appendChild(image);
        articleContainer.appendChild(articleContent);
        articleContainer.appendChild(readMoreBtn);
        article.appendChild(articleContainer);
    });
};

const getSearchResults = (query = '', category = '', century = '') => {
    article.textContent = '';
    nextPage = '';
    previousPage = '';
    fetch(
        `https://api.harvardartmuseums.org/object?q=${query}&classification=${category}&century=${century}&size=9&page=1&apikey=${API_KEY}`
    )
        .then((res) => res.json())
        .then((data) => {
            generateGalleryObjects(data);
            currentPage.innerHTML = data.info.page;
            nextPage = data.info.next;
            console.log(data);
        });
};

getSearchResults();
