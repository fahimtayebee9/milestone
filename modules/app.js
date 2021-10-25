import ApiManager from "./api.js";
import UrlManager from "./url.js";
import Element from "./element.js";

export default function App () {
    
    // GETTING REQUIRED ELEMENTS
    // const element    = new Element();
    const urlManager = new UrlManager();
    App.current      = 1;
    App.compareArray = [];

    // FETCH DATA FROM URL
    const fetchMovies = async (url) => {
        const response = await fetch(url);
        if(response.status == 200){
            var data = await response.json();
            return data;
        }
    }

    // FETCH ALL FOR HOME
    const fetchAll = async (currentPage) => {
        const data = await fetchMovies(urlManager.createUrl( [ 'page', 'sort_by'] , [ currentPage, 'popularity.desc' ] ));
        if(data != null){
            renderMovies(data.results);
            renderPagination(data, currentPage);
        }
    }

    // SEARCH ACTION
    const seachAction = async () => {
        var searchInput = Element.searchField.value;
        renderPreloader();
        const data = await fetchMovies(urlManager.createSearchUrl( [ 'page', 'sort_by', 'query' ] , [ 1, 'popularity.desc' , searchInput ]) );
        if(data.total_results >= 1){
            renderMovies(data.results);
        }
    }

    // CHANGE PAGE (not working)
    const changePage = async (event) => {
        renderPreloader();
        if(event.target.id == "nextBtn"){
            await fetchAll(++App.current);
            if(App.current > 1){
                document.querySelector('#prevBtn-con').classList.remove('disabled');
            }
        }
        else if(event.target.id == "prevBtn"){
            await fetchAll(--App.current);
            if(App.current < 2){
                document.querySelector('#prevBtn-con').classList.add('disabled');
            }
        }
        else{
            for(let i = 0; i <= event.target.id; i++){
                if(App.current == Number(event.target.id)){
                    break;
                }
                App.current++;
            }
            await fetchAll(event.target.id);
            
            if(App.current > 1){
                document.querySelector('#prevBtn-con').classList.remove('disabled');
            }
            else if(App.current < 2){
                document.querySelector('#prevBtn-con').classList.add('disabled');
            }
        }
    }

    // Pagination 
    const renderPagination = (result, page) => {
        let count = 0;
        
        let markUp = `<li class="page-item ${(page === 1)? "disabled" :""}" id="prevBtn-con">
                            <button class="page-link" href="#" id="prevBtn" tabindex="-1" aria-disabled="true">Previous</button>
                        </li>`;
        for(let pg = 1 ; pg <= result.total_pages; pg++){
            let active = (pg == page) ? "active" : "";

            if(pg <= App.current + 4){
                markUp += `<li class="page-item pg-c ${active}"><button type="button" class="page-link page-no" href="#" id="${pg}" >${pg}</button></li>`;
            }
            else if(pg > App.current + 5 && count == 0){
                markUp += `<li class="page-item pg-c"><a class="page-link" href="#">...</a></li>`;
                count++;
            }
        }
        markUp += `<li class="page-item ${(page === result.total_pages)? "disabled" :""}" id="nextBtn-con">
                        <button class="page-link" id="nextBtn" href="#">Next</button>
                    </li>`;
        setValue(Element.paginationUl, markUp);
        
        removePreviusElement();

        paginationEventListener();
    }

    // PAGINATION EVENT LISTENER
    const paginationEventListener = () => {
        document.querySelectorAll('.page-no').forEach( button => {
            button.addEventListener('click', changePage);
        });
        document.querySelector('#nextBtn').addEventListener('click', changePage);
        document.querySelector('#prevBtn').addEventListener('click', changePage);
    }

    // REMOVE PREVIOUS ELEMENT
    const removePreviusElement = () => {
        const pg_elements   = document.querySelectorAll('.pg-c');
        const active_el     = document.querySelector('.page-item:is(.active)');
        let index_active    = -10;
        for(let i = 0; i < pg_elements.length; i++){
            if(pg_elements[i] == active_el){
                index_active = i ;
            }
        }

        if(index_active != -10){
            for(let i = 0; i < index_active-1; i++){
                pg_elements[i].remove();
            }
        }
    }

    // MENU ITEM CLICK
    const renderMenuResult = async (event) => {
        event.preventDefault();
        renderPreloader();
        const data = (event.target.id == 0 ) ? 
                    await fetchAll(1) : 
                    await fetchMovies(urlManager.createUrl( [ 'page', 'sort_by','with_genres'] , [ 1 , 'popularity.desc', event.target.id] ));
        if(data != null){
            renderMovies(data.results);
            renderPagination(data, currentPage);
        }
    }

    // RENDER PRELOADER WHEN NEEDED
    const renderPreloader = () => {
        Element.preloader.classList.remove('d-none');
        Element.preloader.classList.add('d-flex');
        Element.mainDiv.classList.remove('d-block');
        Element.mainDiv.classList.add('d-none');
        setTimeout(function(){
            Element.preloader.classList.add('d-none');
            Element.preloader.classList.remove('d-flex');
            Element.mainDiv.classList.add('d-block');
        }, 2000);
    }

    // RENDER RATING CIRLCE
    const renderRatingCircle = (vote_average, info = false) => {
        var radius  = (info == false) ? 25 : 30;
        var cxcy    = (info == false) ? 35 : 40;
        var hw      = (info == false) ? 70 : 80;
        var circumference = radius * 2 * Math.PI;

        const offset = circumference - vote_average / 10 * circumference;
        let circle_color  = "", circle_bg = ""; 
        if(vote_average >= 7.0){
            circle_color = "#21d07a";
            circle_bg = "#081c22";
        }
        else if(vote_average <= 6.9 && vote_average >= 4.0){
            circle_color = "#f5ed00";
            circle_bg = "#313000";
        }
        else{
            circle_color = "#ce0249";
            circle_bg = "#310011";
        }
        const ratingCirlce = `<div class="rating-holder" style="background: ${circle_bg};">
                                    <p class="rating">${vote_average}</p>
                                    <div class="rating-box">
                                        <svg class="progress-ring" height="${hw}" width="${hw}" >
                                            <circle 
                                                class="progress-ring__circle"
                                                stroke-dashoffset="${offset}"
                                                stroke-dasharray="${circumference} ${circumference}"
                                                stroke="${circle_color}"
                                                stroke-width="4.5"
                                                fill="transparent"
                                                stroke-linecap="round"
                                                r="${radius}"
                                                cx="${cxcy}"
                                                cy="${cxcy}" />
                                        </svg>
                                    </div>
                                </div>`;
        return ratingCirlce;
    }

    // RENDER ALERT
    const renderAlert = () => {
        Swal.fire({
            title: 'Alert',
            text: "Do you want to see comparison of movies now?",
            icon: 'question',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Show Comparison'
        }).then((result) => {
            if (result.isConfirmed) {
                Element.compModal.classList.add('show');
                Element.compModal.style.display = "block";
                console.log(Element.compModal.classList);
                return true;
            }
            else{
                return false;
            }
        });
    }

    // REMOVE FROM COMPARE LIST
    const removeFromList = (event) => {
        // App.compareArray.remove(event.target.id);
        for (let i = 0; i < App.compareArray.length; i++) {
            if (App.compareArray[i].id == event.target.id) {
                App.compareArray.pop(App.compareArray[i]);
                Element.compCount.innerHTML = App.compareArray.length;
                renderDropDown();
            }
        }
    }

    // RENDER DROPDOWN
    const renderDropDown = async () => {
        let markup = "";
        Element.dropDown.innerHTML = "";
        if(App.compareArray.length > 0){
            App.compareArray.forEach(item => {
                markup += `<li>
                                <span class="item">
                                    <span class="item-left">
                                        <img src="${urlManager.baseImgUrl}${item.poster_path}" class="img-fluid w-25" alt="" />
                                        <span class="item-info">
                                            <span>${item.title}</span>
                                            <span>${item.genres[0].name}</span>
                                        </span>
                                    </span>
                                    <span class="item-right">
                                        <button class="btn btn-xs btn-danger pull-right remove" id="${item.id}" >x</button>
                                    </span>
                                </span>
                            </li>`;
            });
            markup += `<li class="divider"></li>
                        <li class="bordered-top text-center justify-content-center m-auto">
                            <button type="button" class="text-center comp-ref comp-btn"  data-toggle="modal" data-target="#compareDialog">View Comparison</button>
                        </li>`;
        }
        else{
            markup += `<li>
                            <p class="m-0 pt-3 pb-3 text-center font-weight-bold">No Movies In List</p>
                        </li>`;
        }
        Element.dropDown.innerHTML = markup;
        document.querySelector('.comp-btn').addEventListener('click', renderCompareDialogCheck);
        document.querySelectorAll('.remove').forEach( element => {
            element.addEventListener('click', removeFromList)
        });;
    }

    // GET MOVIE
    const getMovie = async (id) => {
        let movieData = await getInfos(id, null);
        return movieData;
    }

    // ADD TO COMPARE LIST
    const addToCompare = async (event) => {
        event.preventDefault();
        if(event.target.id != null && App.compareArray.length < 2){
            let movieData = await getMovie(event.target.id);
            App.compareArray.push(movieData);
            Element.compCount.innerHTML = App.compareArray.length;
            renderDropDown();
        }
        else if(App.compareArray.length === 2){
            Swal.fire({
                title: 'Warning...!!!',
                text: "Do you want to remove the last movie added in the list and add this movie?",
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    App.compareArray.pop();
                    
                    App.compareArray.push(movieData);
                    return true;
                }
                else{
                    return false;
                }
            });
            Element.compCount.innerHTML = App.compareArray.length;
        }
    }

    // RENDER SINGLE MOVIE DATA
    const renderMovies = async (movies) => {
        let markUp = '';
        let count = 0;

        Element.movideDetails_list.innerHTML = "";
        
        movies.forEach(movie => {
            const subTitle = (movie.title.length > 16) ? `${movie.title.substr(0,16)}..` : movie.title;
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const release_date = new Date(movie.release_date);
            
            renderDetails(movie.id,`movieDetail_${count}`);

            markUp += `<div class="col-md-6 col-sm-6 col-lg-3 col-10 mb-3 ">
                            <div data-target="movieDetails" data-toggle="modal" class="mv-box " id="movieBox_${count}">
                                <div class="img-holder">
                                    <img loading="lazy" class="img-fluid w-100 lazy" src="${urlManager.baseImgUrl}${movie.poster_path}">
                                    <div class="compare-btns">
                                        <button type="button" id="${movie.id}" class="btn-custom comp-btn">
                                            <i class="fas fa-balance-scale" id="${movie.id}"></i>
                                        </button>
                                        <button type="button" class="movieBtn_${count} btn-custom" data-toggle="modal" data-target="#movieDetail_${count}" >
                                            <i class="far fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="content-holder d-flex justify-content-between align-items-center">
                                    <div class="title-holder">
                                        <h4 class="title">${subTitle}
                                            <span class="tooltip">${movie.title}</span>
                                        </h4>
                                        <div class="genreBox" id="genre-Box">
                                            <p class="genre-title">${release_date.toLocaleDateString("en-US", options)}</p>
                                        </div>
                                    </div>
                                    ${renderRatingCircle(movie.vote_average, false)}
                                </div>
                                <div class="overview-box">
                                    <h5 class="hd-title">${movie.title} (Overview)</h5>
                                    <p class="overview">${movie.overview.substr(0, 280)}...</p>
                                </div>
                            </div>
                        </div>`;
            setValue(Element.wrapperBnr, markUp);
            count++;
        });

        document.querySelectorAll('.comp-btn').forEach( button => {
            button.addEventListener('click', addToCompare);
        });
    };

    const setValue = (elementObj, value) => {
        elementObj.innerHTML = value;
    }

    // GET MOVIE DETAILS (CREDITS, KEYWORDS, GENRES)
    const getInfos = async (id,key) => {
        let url = (key == null) ? urlManager.createFindUrl(id, 'movie'): urlManager.getMovieInfo('movie', id, key);
        if(key == "images"){
            url += "&include_image_language=en";
        }
        const result = await fetchMovies(url);
        return result;
    }

    // RENDER INFOS OF MOVIE DATAS (CREDITS, KEYWORDS, GENRES)
    const renderInfos = (data, type = "") =>{
        let markUp = "";
        if( Array.isArray(data)){
            let c = 0;
            if(type == "genre"){
                data.forEach( item => {
                    markUp += (c == data.length-1 ) ? `${item.name}` : `${item.name}, `;
                    c++;
                });
            }
            else if(type == "country"){
                data.forEach( item => {
                    markUp += (c == data.length-1 ) ? `${item.iso_3166_1}` : `${item.iso_3166_1}, `;
                    c++;
                });
            }
            else if( type == "cast"){
                data.forEach( item => {
                    markUp += `<div class="col-md-3">
                                    <div class="cast-box">
                                        <div class="img-box">
                                            <img src="${(item.profile_path != null) ? UrlManager.castImgUrl + item.profile_path : 
                                                    "https://www.lgrc.us/wp-content/uploads/2020/09/Businessman-Headshot-Placeholder.jpg" }" class="img-fluid w-100" alt="">
                                        </div>
                                        <div class="info-box">
                                            <h5 class="r-name">${item.original_name}</h5>
                                            <p class="m-name">${item.character}</p>
                                        </div>
                                    </div>
                                </div>`;
                });
                
            }
            else if (type == "videos"){
                data.forEach( item => {
                    markUp += `<div class="cast-box">
                                <div class="video card no_border">
                                    <div class="wrapper" 
                                        style="background-image: url('https://i.ytimg.com/vi/${item.key}/hqdefault.jpg');">
                                        <a class="no_click play_trailer" 
                                            href="https://www.themoviedb.org/video/play?key=${item.key}" 
                                            data-site="YouTube" 
                                            data-id="${item.key}" 
                                            data-title="${item.name}" 
                                            things="" change"="" (2021)"="">
                                                <div class="play_background"><i class="fas fa-play"></i></div></a>
                                    </div>
                                </div>
                            </div>`;
                });
            }
            else if (type == "images"){
                data.forEach( item => {
                    markUp += `<div class="cast-box">
                                    <div class="backdrop">
                                        <img loading="lazy" class="backdrop" src="${UrlManager.backDropPath}${item.file_path}" alt="F9">
                                    </div>
                                </div>`;
                });
            }
            else if(type == "keywords"){
                data.forEach( item => {
                    markUp += `<p class="genre-title mr-1 mb-1">${item.name}</p>`;
                });
            }
            return markUp;
        }
        else{

        }
    }

    // RENDER SINGLE MOVIE DETAILS MODAL
    const renderDetails = async (movie_id, modal_id) => {
        let markUp          = "";
        const movieData     = await getInfos(movie_id, null);
        const options       = { year: 'numeric', month: 'long', day: 'numeric' };
        const release_date  = new Date(movieData.release_date);
        const r_year        = release_date.getFullYear();
        const runtime       = `${Math.floor((movieData.runtime / 60))}h ${ Math.floor(  movieData.runtime - Math.floor((movieData.runtime / 60)) * 60) }m`;
        const CREDITS       = await getInfos(movie_id, 'credits'); 
        const KEYWORDS      = await getInfos(movie_id, 'keywords');
        const VIDEOS        = await getInfos(movie_id, 'videos');
        const IMAGES        = await getInfos(movie_id, 'images');

        markUp += `
            <div class="modal fade" id="${modal_id}" tabindex="-1" aria-labelledby="${modal_id}" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content ">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="mvd-banner"
                                style="background-image: url(${UrlManager.bannerImgUrl}${movieData.poster_path});">
                                <div class="container">
                                    <div class="mvd-bnr-box">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="img-holder">
                                                    <img class="img-fluid w-100"
                                                        src="${urlManager.baseImgUrl}${movieData.poster_path}"
                                                        alt="">
                                                </div>
                                            </div>
                                            <div class="col-md-8">
                                                <div class="mvd-title">
                                                    <h1>${movieData.title} <span class="year">(${r_year})</span></h1>
                                                    <div class="sub-title">
                                                        <span class="release">${release_date.toLocaleDateString("en-US", options)} (${renderInfos(movieData.production_countries, 'country')})</span>
                                                        <span class="genres">${renderInfos(movieData.genres, 'genre')}</span>
                                                        <span class="runtime">${runtime}</span>
                                                    </div>
                                                </div>

                                                <div class="tag-box">
                                                    <div class="userRating">
                                                        ${renderRatingCircle(movieData.vote_average, true)}
                                                        <p>
                                                            User Score
                                                        </p>
                                                    </div>
                                                    <p class="tagline">
                                                        ${movieData.tagline}
                                                    </p>
                                                </div>

                                                <div class="overview-box">
                                                    <h5 class="hd-title">Overview</h5>
                                                    <p class="overview">
                                                        ${movieData.overview}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mvd-info">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-md-9">
                                            <div class="mvd-casts">
                                                <h1>Top Billed Cast</h1>
                                                <div class="row casts-list">
                                                    ${renderInfos(CREDITS.cast, 'cast')}
                                                </div>
                                            </div>

                                            <div class="mvd-media">
                                                <div class="media-header d-flex justify-content-start align-items-center">
                                                    <h1>Media</h1>

                                                    <nav>
                                                        <div class="nav nav-tabs m-auto" id="nav-tab" role="tablist">
                                                            <a class="nav-item nav-link active" data-toggle="tab" href="#videos" role="tab" aria-controls="videos" aria-selected="false">Videos</a>
                                                            
                                                        </div>
                                                    </nav>
                                                </div>

                                                <!-- Tab panes -->
                                                <div class="tab-content " id="nav-tabContent">
                                                    <div class="tab-pane fade active show" id="videos" role="tabpanel" aria-labelledby="privacy-tab">
                                                        <div class="casts-list d-flex justify-content-start align-items-center">
                                                            ${renderInfos(VIDEOS.results,'videos')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-md-3">
                                            <div class="info-area">
                                                <div class="info-box">
                                                    <h5 class="r-name">Status</h5>
                                                    <p class="m-name">${movieData.status}</p>
                                                </div>
                                                <div class="info-box">
                                                    <h5 class="r-name">Original Language</h5>
                                                    <p class="m-name">${movieData.original_language.toUpperCase()}</p>
                                                </div>
                                                <div class="info-box">
                                                    <h5 class="r-name">Budget</h5>
                                                    <p class="m-name">$${movieData.budget}</p>
                                                </div>
                                                <div class="info-box">
                                                    <h5 class="r-name">Revenue</h5>
                                                    <p class="m-name">$${movieData.revenue}</p>
                                                </div>
                                            </div>
                                            <div class="info-area keywords">
                                                <h1>Keywords</h1>
                                                <div class="info-box">
                                                    ${renderInfos(KEYWORDS.keywords, 'keywords')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        Element.movideDetails_list.insertAdjacentHTML('beforeend', markUp);
    }

    // CALCULATE RUNTIME
    const calculateRuntime = (runtime) => {
        let runtime_h = Math.floor((runtime / 60));
        let runtime_m = Math.floor(  runtime - runtime_h * 60);
        return `${runtime_h}h ${runtime_m}m`;
    }

    // CALCULATE DATE
    const calculateDate = (release_date) => {
        const options       = { year: 'numeric', month: 'long', day: 'numeric' };
        const date  = new Date(release_date).toLocaleDateString('en-Us',options);
        return date;
    }

    // COMPARE MOVIE DATA
    const compareData = (data_1, data_2) => {
        let returnVal = [];
        if( parseFloat(data_1) > parseFloat(data_2)){
            returnVal = ["rating_high.png", "success", "transform: rotate(180deg);"];
            return returnVal;
        }
        else{
            returnVal = ["rating_low.png", "danger", "transform: rotate(0deg);"];
            return returnVal;
        }
    }

    const renderDataList = (data, elem_id) => {
        document.getElementById('movieSuggest_2').innerHTML = "";
        document.getElementById('movieSuggest_1').innerHTML = "";

        if(data != null){
            for(let i = 0; i < 6; i++){
                console.log(data.results[i])
                const option = document.createElement('option');
                option.setAttribute('value', data.results[i].title);
                option.textContent = data.results[i].title;
                if(elem_id == "searchField_comp_2"){
                    document.getElementById('movieSuggest_2').appendChild(option);
                }
                else if(elem_id == "searchField_comp_1"){
                    document.getElementById('movieSuggest_1').appendChild(option);
                }
            }
        }
    }

    // SEARCH ACTION
    const compareSeachSuggestion = async (event) => {
        let btn_id = event.target.id;
        let searchInput = null;
        searchInput = document.getElementById(btn_id).value;
        const data = (searchInput != null) ?
                    await fetchMovies(urlManager.createSearchUrl( [ 'page', 'sort_by', 'query' ] , [ 1, 'popularity.desc' , searchInput ]) )
                    : null;
        console.log(data);
        if(data != null){
            renderDataList(data, btn_id);
        }
    }

    const renderModalTable = () => {
        let movieData_1 = App.compareArray[0];
        let movieData_2 = App.compareArray[1];

        let markUp = `<table class="table">
                            <thead>
                                <tr>
                                    <th scope="col" style="border-top: none;"></th>
                                    <th scope="col" style="border-top: none;"></th>
                                    <th scope="col" style="border-top: none;"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Poster</th>
                                    <td>
                                        <div class="img-holder">
                                            <img class="img-fluid w-25"
                                                src="${urlManager.baseImgUrl}${movieData_1.poster_path}"
                                                alt="${movieData_1.title} Poster">
                                        </div>
                                    </td>
                                    <td>
                                        <div class="img-holder">
                                            <img class="img-fluid w-25"
                                                src="${urlManager.baseImgUrl}${movieData_2.poster_path}"
                                                alt="${movieData_1.title} Poster">
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Title</th>
                                    <td>${movieData_1.title} (${movieData_1.status})</td>
                                    <td>${movieData_2.title} (${movieData_2.status})</td>
                                </tr>
                                <tr>
                                    <th scope="row">Genre</th>
                                    <td>${renderInfos(movieData_1.genres, 'genre')}</td>
                                    <td>${renderInfos(movieData_2.genres, 'genre')}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Runtime</th>
                                    <td>${calculateRuntime(movieData_1.runtime)}</td>
                                    <td>${calculateRuntime(movieData_2.runtime)}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Release Date</th>
                                    <td>${calculateDate(movieData_1.release_date)}</td>
                                    <td>${calculateDate(movieData_2.release_date)}</td>
                                </tr>
                                <tr>
                                    <th scope="row">User Rating</th>
                                    <td>
                                        <div class="data-td">
                                            <p class="data ${compareData(movieData_1.vote_average, movieData_2.vote_average)[1]}">${movieData_1.vote_average}</p>
                                            <img src="assets/img/${compareData(movieData_1.vote_average, movieData_2.vote_average)[0]}" 
                                                style="${compareData(movieData_1.vote_average, movieData_2.vote_average)[2]}" class="img-fluid w-25" alt="">
                                        </div>
                                    </td>
                                    <td>
                                        <div class="data-td">
                                            <p class="data ${compareData(movieData_2.vote_average, movieData_1.vote_average)[1]}">${movieData_2.vote_average}</p>
                                            <img src="assets/img/${compareData(movieData_2.vote_average, movieData_1.vote_average)[0]}" 
                                                style="${compareData(movieData_2.vote_average, movieData_1.vote_average)[2]}" class="img-fluid w-25" alt="">
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Budget</th>
                                    <td >
                                        <div class="data-td">
                                            <p class="data ${compareData(movieData_1.budget, movieData_2.budget)[1]}">$ ${movieData_1.budget}</p>
                                            <img src="assets/img/${compareData(movieData_1.budget, movieData_2.budget)[0]}" 
                                                style="${compareData(movieData_1.budget, movieData_2.budget)[2]}" class="img-fluid w-25" alt="">
                                        </div>
                                    </td>
                                    <td >
                                        <div class="data-td">
                                            <p class="data ${compareData(movieData_2.budget, movieData_1.budget)[1]}">$ ${movieData_2.budget}</p>
                                            <img src="assets/img/${compareData(movieData_2.budget, movieData_1.budget)[0]}" 
                                                style="${compareData(movieData_2.budget, movieData_1.budget)[2]}" class="img-fluid w-25" alt="">
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Revenue</th>
                                    <td >
                                        <div class="data-td">
                                            <p class="data ${compareData(movieData_1.revenue, movieData_2.revenue)[1]}">$ ${movieData_1.revenue}</p>
                                            <img src="assets/img/${compareData(movieData_1.revenue, movieData_2.revenue)[0]}" 
                                                style="${compareData(movieData_1.revenue, movieData_2.revenue)[2]}" class="img-fluid w-25" alt="">
                                        </div>
                                    </td>
                                    <td >
                                        <div class="data-td">
                                            <p class="data ${compareData(movieData_2.revenue, movieData_1.revenue)[1]}">$ ${movieData_2.revenue}</p>
                                            <img src="assets/img/${compareData(movieData_2.revenue, movieData_1.revenue)[0]}" 
                                                style="${compareData(movieData_2.revenue, movieData_1.revenue)[2]}" class="img-fluid w-25" alt="">
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Popularity</th>
                                    <td >
                                        <div class="data-td">
                                            <p class="data ${compareData(movieData_1.popularity, movieData_2.popularity)[1]}">${movieData_1.popularity}</p>
                                            <img src="assets/img/${compareData(movieData_1.popularity, movieData_2.popularity)[0]}" 
                                                style="${compareData(movieData_1.popularity, movieData_2.popularity)[2]}" class="img-fluid w-25" alt="">
                                        </div>
                                    </td>
                                    <td >
                                        <div class="data-td">
                                            <p class="data ${compareData(movieData_2.popularity, movieData_1.popularity)[1]}">${movieData_2.popularity}</p>
                                            <img src="assets/img/${compareData(movieData_2.popularity, movieData_1.popularity)[0]}" 
                                                style="${compareData(movieData_2.popularity, movieData_1.popularity)[2]}" class="img-fluid w-25" alt="">
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Total Votes</th>
                                    <td >
                                        <div class="data-td">
                                            <p class="data ${compareData(movieData_1.vote_count, movieData_2.vote_count)[1]}">${movieData_1.vote_count}</p>
                                            <img src="assets/img/${compareData(movieData_1.vote_count, movieData_2.vote_count)[0]}" 
                                                style="${compareData(movieData_1.vote_count, movieData_2.vote_count)[2]}" class="img-fluid w-25" alt="">
                                        </div>
                                    </td>
                                    <td>
                                        <div class="data-td">
                                            <p class="data ${compareData(movieData_2.vote_count, movieData_1.vote_count)[1]}">${movieData_2.vote_count}</p>
                                            <img src="assets/img/${compareData(movieData_2.vote_count, movieData_1.vote_count)[0]}" 
                                                style="${compareData(movieData_2.vote_count, movieData_1.vote_count)[2]}" class="img-fluid w-25" alt="">
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>`;
        return markUp;
    }

    // RENDER MODAL DIALOG
    const renderModalDialog = async () => {
        const markUp = `<div class="modal fade comp-modal" id="compareDialog" tabindex="-1" aria-labelledby="compareDialog" aria-hidden="true">
                            <div class="modal-dialog" style="width: 100%;">
                                <div class="modal-content ">
                                    <div class="modal-header">
                                        <button type="button" class="close mdl-close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mvd-banner">
                                            <div class="container-fluid">
                                                <div class="mvd-bnr-box">
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <h1 class="title">Compare Movies</h1>
                                                            ${renderModalTable()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

        Element.compareBox.innerHTML = markUp;

        document.querySelector('.mdl-close').addEventListener('click', function(){
            while(App.compareArray.length > 0) {
                App.compareArray.pop();
            }
            Element.compCount.innerHTML = App.compareArray.length;
            renderDropDown();
        });
    }

    // COMPARISON DATA CHECKING
    const renderCompareDialogCheck = (event) => {
        event.preventDefault();
        if(App.compareArray.length != 0 && App.compareArray.length == 2){
            renderModalDialog();
        }
        else if(App.compareArray.length < 2){
            Swal.fire({
                title: 'Warning...!!!',
                text: "Please add 2 movies to compare.",
                icon: 'warning'
            });
        }
    }

    // EVENT LISTENERS
    const eventListeners = () => {
        Element.btnSearch.addEventListener('click',seachAction);
        
        Element.menuList.forEach( function(item){
            item.addEventListener('click',renderMenuResult);
        });
        
        Element.movieBox.forEach( function(item){
            item.addEventListener('click', renderDetails);
        });
    }

    // RENDER ALL
    const renderAll = () => {
        // Fetch Movies
        fetchAll(1);
        
        eventListeners();
    };

    return {
        renderAll       : renderAll(),
    };
};
