const scrollTo = function(containerSelector, targetSelector) {
    const container = document.querySelector(containerSelector);
    const target = document.querySelector(targetSelector);
    container.scrollLeft = target.offsetLeft
}
export default scrollTo
