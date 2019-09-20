async function getIdolList() {
    const container = document.getElementById('dynamic-list');
    const response = await ParseApi.getItemList();
    console.log(response);

    response.forEach(element => {
        const { name, price, group, description, count, imgUrl } = element["attributes"];
        const objectId = element.id;

        const html =  `<div class="item row-container" id="${objectId}">` +
        `<img src="${imgUrl}" class="profile">` +
        `<div class="column-container">` +
            `<div class="title idol-Name">${name}</div>` +
            `<div class="description">${description}</div>` +
            `<div class="tags Hashtag">` +
                `<span class="tag">${group}</span>` +
            `</div>` +
        `</div>` +
        `<div class="column-container subinfo-container">` +
            `<span class="Sub-Text quantity">Quantity: ${count}</span>` +
            `<span class="Sub-Text">$${price}</span>` +
        `</div>` +
        `<button class="buy-button" onclick="purchaseItem('${objectId}')">Buy</button>` +
    `</div>`;

    const e = document.createElement('div');
    e.innerHTML = html;
    console.log(e);
    container.appendChild(e);

    });
}