import UrlManager from "./url.js";

export default function ApiManager(){}

ApiManager.prototype.fetchNews = async function(url){
    const response = await fetch(url);
    var data = await response.json();
    console.log(data.data);
    return data.data;
}

