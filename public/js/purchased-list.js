async function showPurchasedItem() {
    const container = document.getElementById('purchased-list');
    const result = await ParseApi.getUserItemList();

    let htmls = [];
    result.forEach(element => {
        const { count, objectId } = element;
        const { name, price, group, description, imgUrl} = element.character;

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
            `<span class="Sub-Text quantity">보유 수량: ${count}</span>` +
            `<span class="Sub-Text">$${price}</span>` +
        `</div>` +
        `<button class="sell-button sell" onclick="sell('${objectId}')">Sell</button>` +
    `</div>`;

    const e = document.createElement('div');
    e.innerHTML = html;

    container.appendChild(e);
    });
  }