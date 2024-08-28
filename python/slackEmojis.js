function getUrl(imgCell) {
    img = imgCell.querySelector('img')
    url = img.src
    return url
}

function getEmojiName(emojiNameCell) {
    emojiName = emojiNameCell.querySelector('b.black').textContent
    return emojiName
}


function getDateAdded(dateAddedCell) {
    dateAdded = dateAddedCell.firstChild.firstChild.textContent
    return dateAdded
}


function getAddedBy(addedByCell) {
    addedBy = addedByCell.firstChild.firstChild.textContent
    return addedBy
}


function getData(table) {
    rows = table.children

    data = [];
    for (let row of rows) {
        columns = row.firstChild.firstChild.children

        var [imgCell, emojiNameCell, dateAddedCell, addedByCell, lockCell] = columns

        url = getUrl(imgCell)
        emojiName = getEmojiName(emojiNameCell)
        dateAdded = getDateAdded(dateAddedCell)
        addedBy = getAddedBy(addedByCell)

        datum = {
            'name': emojiName,
            'url': url,
            'date_added': dateAdded,
            'added_by': addedBy,
        }
        console.log(datum)
        data.push(datum)
    }

    return data
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function isScrolledToBottom(element) {
  return element.scrollHeight - element.scrollTop === element.clientHeight;
}


async function main() {
    table = $0
    scrollable = table.parentElement.parentElement

    var allData = []
    while (true) {
        data = getData(table)

        scrollable.scrollBy({
            top: 1000
        })

        allData = allData.concat(data)

        if (isScrolledToBottom(scrollable))
            break

        await sleep(1000)
    }

    const uniqueMap = new Map(allData.map(item => [item.name, item]));
    const uniqueArray = Array.from(uniqueMap.values());

    json = JSON.stringify(uniqueArray, null, 2);
    console.log(json);
}

main()

