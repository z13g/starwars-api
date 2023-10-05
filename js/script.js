import { ignore } from "./modules/filter.js";

const swapiApp = (async function () {

    const SWAPIURL = "https://swapi.dev/api"
    const navBar = document.querySelector(".nav-bar")
    const cardContainer = document.querySelector(".card-container");
    const siteContainer = document.querySelector(".site");
    const contentContainer = document.querySelector(".content");
    const pictureApi = "https://dog.ceo/api/breeds/image/random"
    const logo = document.querySelector(".logo");

    try {
        const response = await fetch(SWAPIURL);
        const jsonData = await response.json();
        for (let key in jsonData) {
            let navItem = document.createElement("a");
            navItem.addEventListener("click", navClick)
            navItem.className = "nav-item"
            navItem.innerText = key;
            navItem.href = jsonData[key];
            navBar.appendChild(navItem);
        }
        getHomePage();
        logo.addEventListener("click", (e) => {
            createHomePage();
        });
    }
    catch (error) {
        console.log(error);
    }

    async function navClick(e) {
        console.log(e);
        e.preventDefault();
        setPageElements();
        siteContainer.style.display = "flex";
        document.querySelector(".active")?.classList.remove("active");
        this.classList.add("active");
        let data = await getData(this.href);
        setButtons(data);
        data.results.forEach(dataItem => {
            let card = document.createElement("div");
            card.className = "card"

            card.innerText = (dataItem.hasOwnProperty('name')) ? dataItem.name : dataItem.title;

            card.addEventListener("click", (e) => {
                showDataItem(dataItem, card)
            });
            document.querySelector(".card-container").appendChild(card)
        })
    }

    async function setPageElements() {
        siteContainer.innerHTML = "";
        let cardContainer = document.createElement("div");
        cardContainer.className = "card-container";
        let content = document.createElement("div");
        content.className = "content";
        siteContainer.appendChild(cardContainer);
        siteContainer.appendChild(content);
    }

    async function getHomePage() {
        const page = document.querySelector(".card-container")
        if (page.innerHTML.trim() === "") {
            createHomePage();
        }
    }

    async function createHomePage() {
        document.querySelector(".active")?.classList.remove("active");
        siteContainer.innerHTML = "";
        siteContainer.style.display = "block";

        let frontPage = document.createElement("div");
        frontPage.className = "front-page";
        siteContainer.appendChild(frontPage)

        let heading = document.createElement("h1");
        heading.textContent = "Welcome to Starwars API";
        frontPage.appendChild(heading)

        const desArray = [
            "A unique and interactive hub for all Star Wars enthusiasts. Powered by advanced technology, our platform gathers extensive data from the Star Wars API and dynamically generates web content using JavaScript, offering an immersive browsing experience to our users.",
            "Instead of multiple HTML pages, we pride ourselves in operating on a single HTML file. The magic behind this efficient operation lies within JavaScript. It manipulates the Document Object Model (DOM) and populates it with relevant data based on the API's endpoint, effectively creating, modifying, and presenting the content you see on the site.",
            "From detailed profiles of your favorite characters, starships, vehicles, to the iconic species, planets, and films – all the information you seek is right at your fingertips. Our interface is designed to transition seamlessly between the vast content categories without ever having to load a new page, delivering an uninterrupted and fluid user experience.",
            "Step into the expansive universe of Star Wars with Starwars API, where your journey through the galaxies is guided by the force of JavaScript. Discover more about the characters, dive deeper into the epic sagas, and explore the intricate nuances of this beloved franchise like never before!"
        ];

        let frontPageContent = document.createElement("div");
        frontPageContent.className = "front-page-container"
        frontPage.appendChild(frontPageContent);

        let descContainer = document.createElement("div");
        descContainer.className = "desc-container";
        frontPageContent.appendChild(descContainer);

        let pageImage = document.createElement("div");
        pageImage.className = "page-image";
        frontPageContent.appendChild(pageImage);

        let imageContainer = document.createElement("div");
        imageContainer.className = "image-container";
        pageImage.appendChild(imageContainer);

        let image = document.createElement("img");
        image.src = "../img/wallpaper.png";
        image.className = "wallpaper";
        imageContainer.appendChild(image);

        let imageText = document.createElement("p");
        imageText.innerText = "The Rise of Skywalker";
        imageText.className = "image-text";
        imageContainer.appendChild(imageText);

        let imageText2 = document.createElement("p");
        imageText2.innerHTML = '<i class="fa-solid fa-chevron-left"></i> See More';
        imageText2.className = "image-text image-text-desc";
        imageContainer.appendChild(imageText2);

        let imageBtn2 = document.createElement("p");
        imageBtn2.innerHTML = '<i class="fa-solid fa-info"></i>'
        imageBtn2.className = "image-btn image-info";
        imageContainer.appendChild(imageBtn2);
        let imageBtn = document.createElement("p");
        imageBtn.innerHTML = '<i class="fa-solid fa-display"></i>'
        imageBtn.className = "image-btn";
        imageContainer.appendChild(imageBtn);
        let imageBtn3 = document.createElement("p");
        imageBtn3.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>'
        imageBtn3.className = "image-btn image-more";
        imageContainer.appendChild(imageBtn3);

        for (let i = 0; i < desArray.length; i++) {
            let description = document.createElement("p");
            description.innerText = desArray[i];
            descContainer.appendChild(description)
        }        

        let footer = document.createElement("div");
        footer.className = "footer";
        siteContainer.appendChild(footer);

        let footerText = document.createElement("p");
        footerText.textContent = "COPYRIGHT © 2023 ALL RIGHTS RESERVED BY STARWARS API. ";
        footer.appendChild(footerText);
    }

    async function getData(url) {
        const response = await fetch(url);
        return await response.json();
    }

    async function showDataItem(dataItem) {
        const contentContainer = document.querySelector(".content");
        contentContainer.innerHTML = "";
        let itemContainer = document.createElement("div");
        itemContainer.className = "item-container";
        itemContainer.addEventListener("click", (e) => {
            showDetails(dataItem)
        });
        contentContainer.appendChild(itemContainer)       
        const picContainer = document.createElement("div");
        picContainer.className = "pic-container";
        itemContainer.appendChild(picContainer)
        const itemPic = document.createElement("img");
        itemPic.className = "itemPic";
        fetchPicture();
        picContainer.appendChild(itemPic);    
        let content = document.createElement("div");
        content.className = "card-content"
        itemContainer.appendChild(content);
        console.log(dataItem)
        for (let [k, v] of Object.entries(dataItem)) {
            if (ignore.includes(k)) { continue; }

            let htmlCode = (Array.isArray(v)) ? await decideDesignUponDataItem(k, v, true) : await decideDesignUponDataItem(k, v, false)
            
            if (htmlCode == "") {
                content.insertAdjacentHTML("beforeend", `<span class="key">${k.charAt(0).toUpperCase() + k.slice(1)}</span> <span class="val">${v}</span><br>`);
            } else {
                content.insertAdjacentHTML("beforeend", `<span class="key">${htmlCode}</span><br>`);
            }
        }
    }

    async function fetchPicture() {
        fetch(pictureApi)
            .then(function (response) {
                if (response.status == 200) {
                    return response.json();
                }
                //Error
                document.querySelector(".error-cont").style.display = "block"
            })
            .then(function (data) {
                const itemPic = document.querySelector(".itemPic")
                itemPic.src = data.message;
        });
    }

    async function decideDesignUponDataItem(key, value, callPoint) {
        let v = typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value;

        if (Array.isArray(v)) {
            v = v.join('\n');
        }
        const keyToCode = {
            'name': `<div class="content-headline">${v}</div>`,
            'height': `<i class="fa-solid fa-arrows-up-down"></i> ${v} cm`,
            'mass': `<i class="fa-solid fa-weight-scale"></i> ${v} kg`,
            'hair_color': `<i class="fa-solid fa-palette"></i> ${v} hair color`,
            'skin_color': `<i class="fa-solid fa-palette"></i> ${v} skin color`,
            'eye_color': `<i class="fa-solid fa-palette"></i> ${v} eye color`,
            'birth_year': `<i class="fa-solid fa-cake-candles"></i> Birth year: ${v}`,
            'gender': `<i class="fa-solid fa-venus-mars"></i> ${v}`,
            'homeworld': `<i class="fa-solid fa-house"></i> Homeworld: ${v}`,
        };
    
        if (callPoint) {
            keyToCode['films'] = `<br>Films:<br>${v.replace(/\n/g, '<br>')}`;
            keyToCode['species'] = `Species:<br>${v.replace(/\n/g, '<br>')}`;
            keyToCode['starships'] = `Starships:<br>${v.replace(/\n/g, '<br>')}`;
            keyToCode['characters'] = `Characters:<br>${v.replace(/\n/g, '<br>')}`;
            keyToCode['planets'] = `Planets:<br>${v.replace(/\n/g, '<br>')}`;
            keyToCode['residents'] = `Residents:<br>${v.replace(/\n/g, '<br>')}`;
            keyToCode['url'] = `Url: ${v}`;
        }
    
        const code = keyToCode[key] || "";
    
        return code;
    }
    
    
    async function showDetails(dataItem) {
        siteContainer.innerHTML = "";
        let detailContainer = document.createElement("div");
        detailContainer.className = "detail-container";
        detailContainer.style.backgroundImage = "url(../img/wallpaper2.png)";
        siteContainer.appendChild(detailContainer);
        let detailCard = document.createElement("div");
        detailCard.className = "detail-card-container";
        detailContainer.appendChild(detailCard);

        for (let [k, v] of Object.entries(dataItem)) {
            let htmlCode = await decideDesignUponDataItem(k, v, true);  
            detailCard.insertAdjacentHTML("beforeend", `<span class="key">${htmlCode}</span><br>`);
        }
    }

    async function setButtons(data) {

        if (data.next == null && data.previous == null) {
            return;
        }

        let buttonsContainer = document.createElement("div");
        buttonsContainer.className = "buttons-container";
        document.querySelector(".card-container").appendChild(buttonsContainer);

        if (data.previous !== null) {
            let previous = document.createElement("a");
            previous.className = "buttons prev-btn";
            previous.innerHTML = '<a class="fa-solid fa-arrow-left"></a>'
            previous.href = data.previous;
            buttonsContainer.appendChild(previous);
            previous.addEventListener("click", navClick)
        }

        if (data.next !== null) {
            let next = document.createElement("a");
            next.className = "buttons next-btn";
            next.innerHTML = '<a class="fa-solid fa-arrow-right"></a>';
            next.href = data.next;
            buttonsContainer.appendChild(next);
            next.addEventListener("click", navClick)
        }

    }

})();