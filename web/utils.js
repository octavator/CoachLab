const scrollTo = function(containerSelector, targetSelector) {
    const container = document.querySelector(containerSelector);
    const target = document.querySelector(targetSelector);
    container.scrollLeft = target.offsetLeft
}

const resIdToDate = function(res_id) {
    const date_str = res_id.split(" ")[0]
    const year = date_str.split("/")[2]
    const month = date_str.split("/")[1]
    const day = date_str.split("/")[0]
    const time_str = res_id.split(" ")[1].split("+")[0].slice(0, -3)
    return new Date(`${year},${month},${day},${time_str}`)
}

const formatDate = function(date) {
    return date.toLocaleString("fr-FR").replace(":", "h").replace(":00", "").replace(" ", "  ")
}

export {scrollTo, resIdToDate, formatDate}
