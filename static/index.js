const browserViewport = document.getElementById("browser-viewport");
const searchBar = document.getElementById("search-bar");
const loadingRing = document.getElementById("loading-ring");

function isUrl(string = ""){
    if (/^http(s?):\/\//.test(string) || string.includes(".") && string.substr(0, 1) !== " ") return true;
    return false;
}

function cleanUrl(string) {
    let url = string.trim();
    if (!isUrl(url)) url = "https://www.google.com/search?q=" + url;
    else if (!(url.startsWith("https://") || url.startsWith("http://"))) url = "http://" + url;
    return url;
}

function encodeString(string) {
    if (!string) return string;
    return encodeURIComponent(
        string.toString()
            .split("")
            .map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char)
            .join("")
    );
}

function getEncodedUrl(string) {
    const url = cleanUrl(string);
    const encodedUrl = encodeString(url);
    return `/service/${encodedUrl}`;
}

searchBar.addEventListener("change", () => {
    browserViewport.setAttribute("src", "https://infrared.up.railway.app" + getEncodedUrl(searchBar.value));
    loadingRing.style.visibility = "visible";
});

browserViewport.addEventListener("click", () => {
    checkIframeLoaded();
});

browserViewport.addEventListener("load", () => {
    loadingRing.style.visibility = "hidden";
});

browserViewport.contentWindow.addEventListener("hashchange", () => {
    loadingRing.style.visibility = "visible";
});
