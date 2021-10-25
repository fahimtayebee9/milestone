export default function UrlManager(){
    UrlManager.apiKey            = "3500244f1e0e7fb7f2647a8c7a70ad56";
    this.baseImgUrl              = "https://image.tmdb.org/t/p/w1280";
    UrlManager.defaultUrl        = "https://api.themoviedb.org/3";
    this.baseUrl                 = "https://api.themoviedb.org/3/discover/";
    this.moviesUrl               = this.baseUrl + "movie?api_key=" + UrlManager.apiKey;
    this.youtubeUrl              = "https://www.youtube.com/watch?v=";
    UrlManager.bannerImgUrl      = "https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces";
    UrlManager.castImgUrl        = "https://www.themoviedb.org/t/p/w138_and_h175_face";
    UrlManager.backDropPath      = "https://www.themoviedb.org/t/p/w533_and_h300_bestv2";
}

UrlManager.prototype.createUrl = function(key = [], value = []){
    let options = "";
    for(let i = 0; i < key.length && value.length; i++){
        options += `&${key[i]}=${value[i]}`;
    }
    let newUrl = this.moviesUrl + options;
    return newUrl;
}

UrlManager.prototype.createFindUrl = function(find, domain){
    let newUrl = `${UrlManager.defaultUrl}/${domain}/${find}?api_key=${UrlManager.apiKey}`;
    return newUrl;
}

UrlManager.prototype.getMovieInfo = (domain, id, data) => {
    let newUrl  = "";
    newUrl = (data == "" || data == null) ? 
                `${UrlManager.defaultUrl}/${domain}/${id}?api_key=${UrlManager.apiKey}` : 
                `${UrlManager.defaultUrl}/${domain}/${id}/${data}?api_key=${UrlManager.apiKey}`;

    return newUrl;
}

UrlManager.prototype.createSearchUrl = function(key = [] , value = []){
    let options = "";
    for(let i = 0; i < key.length && value.length; i++){
        options += `&${key[i]}=${value[i]}`;
    }
    let newUrl = `${UrlManager.defaultUrl}/search/movie?api_key=${UrlManager.apiKey}${options}`;
    return newUrl;
}