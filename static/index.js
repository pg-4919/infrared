const viewport = document.getElementById("viewport");
const searchBar = document.getElementById("search-bar");
const loadingIndicator = document.getElementById("loading-indicator");

function isUrl(string = ""){
    if (/^http(s?):\/\//.test(string) || string.includes(".") && string.substr(0, 1) !== " ") return true;
    return false;
}

function cleanUrl(string) {
    let url = string.trim();
    if (!isUrl(url)) url = "http://www.google.com/search?q=" + url;
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

function decodeString(string) {
    if (!string) return string;
    let [ input, ...search ] = string.split("?");
    return decodeURIComponent(input).split("").map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join("") + (search.length ? "?" + search.join("?") : "");
}

function decodeUltravioletUrl(string) {
    const encodedUrl = string.replace("https://infrared.up.railway.app/service/", "");
    return decodeString(encodedUrl);
}

function getEncodedUrl(string) {
    const url = cleanUrl(string);
    const encodedUrl = encodeString(url);
    return `/service/${encodedUrl}`;
}

searchBar.addEventListener("change", () => {
    viewport.setAttribute("src", "https://infrared.up.railway.app" + getEncodedUrl(searchBar.value));
    searchBar.value = cleanUrl(searchBar.value);
    searchBar.blur();
});

window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "/service/" });
});

viewport.addEventListener("load", () => {
    searchBar.value = decodeUltravioletUrl(viewport.contentWindow.location.href);
    loadingIndicator.style.visibility = "hidden";
    viewport.contentWindow.addEventListener("beforeunload", () => {
        loadingIndicator.style.visibility = "visible";
    });
    viewport.contentWindow.addEventListener("unload", () => {
        viewport.contentDocument.addEventListener("DOMContentLoaded", () => alert("pog"))
    });
});
