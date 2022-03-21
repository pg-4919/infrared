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
    loadingIndicator.style.visibility = "hidden";
    viewport.contentWindow.addEventListener("beforeunload", () => {
        searchBar.value = viewport.contentWindow.location.href;
        loadingIndicator.style.visibility = "visible";
    });
});
