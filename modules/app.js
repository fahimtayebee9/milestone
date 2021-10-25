// import UrlManager from "./url.js";
import Element from "./element.js";

const App = (() =>{
    
    // FETCH DATA FROM URL
    const fetchFromApi = async () => {
        const response = await fetch('https://randomuser.me/api/?results=12');
        if(response.status == 200){
            var data = await response.json();
            console.log(data)
            renderResult(data);
            return data;
        }
    }

    // RENDER FROM RESPONSE
    const renderResult = (data) => {
        if(data != null){
            renderData(data.results);
            renderUserModal(data.results);
            return data;
        }
    }

    // SEARCH ACTION
    // const seachAction = async () => {
    //     var searchInput = Element.searchField.value;
    //     renderPreloader();
    //     const data = await fetchMovies(urlManager.createSearchUrl( [ 'page', 'sort_by', 'query' ] , [ 1, 'popularity.desc' , searchInput ]) );
    //     if(data.total_results >= 1){
    //         renderMovies(data.results);
    //     }
    // }

    // RENDER SINGLE USER
    const renderData = async (data) => {
        let markUp = '';
        let count = 0;

        data.forEach( item => {
            markUp += `<div class="card data-list uid_${item.name.first}">
                            <div class="card-img-container">
                                <img class="card-img" src="${item.picture.medium}" alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="name" class="card-name cap">${item.name.title + ' ' + item.name.first}</h3>
                                <p class="card-text">${item.email}</p>
                                <p class="card-text cap">${item.location.city}, ${item.location.country}</p>
                            </div>
                        </div>`;
            setValue(Element.galleryDiv, markUp);
            count++;
        });

        document.querySelectorAll('.data-list').forEach( modal => {
            modal.addEventListener('click' , e => {
                e.target.closest('.card').addEventListener('click', event => {
                    event.preventDefault();
                    openEditModal(event);
                });
            })
        });
    };

    const closeModal = (event) => {
        Element.modal.classList.remove('open-modal');
    }

    const openEditModal = (event) => {
        let modalClass = event.target.closest('.card').classList[2];
        let modalDiv = Array.from(document.querySelectorAll('.modal-container')).filter(function(element) {
            return element.id == modalClass; 
        })[0];
        console.log(modalDiv)
    }

    const getDate = (dob_date) => {
        const options       = { year: 'numeric', month: 'long', day: 'numeric' };
        const date          = new Date(dob_date).toLocaleDateString('en-Us',options);
        return date;
    }

    const renderUserModal = (data) => {
        let markUp = ``;
        let count  = 0;
        data.forEach( item => {
            markUp += `<div class="modal-container" id="uid_${item.name.first}">
                            <div class="modal" role="dialog">
                                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                                <div class="modal-info-container">
                                    <img class="modal-img" src="${item.picture.medium}" alt="profile picture">
                                    <h3 id="name" class="modal-name cap">${item.name.title + ' ' + item.name.first + ' ' + item.name.last}</h3>
                                    <p class="modal-text">${item.email}</p>
                                    <p class="modal-text cap">${item.location.city}, ${item.location.country}</p>
                                    <hr>
                                    <p class="modal-text">${item.phone}</p>
                                    <p class="modal-text">${item.location.street.number} ${item.location.street.name}, ${item.location.state}, ${item.location.postcode}</p>
                                    <p class="modal-text">Birthday: ${getDate(item.dob.date)}</p>
                                </div>
                            </div>
                        </div>`;
            setValue(Element.galleryModals, markUp);
            count++;
            document.querySelectorAll('.modal-close-btn').forEach( btn => {
                btn.addEventListener('click' , event => {
                    let closeDiv = event.target.closest('modal');
                    console.log(closeDiv);
                })
            });
        });
    }

    const setValue = (elementObj, value) => {
        elementObj.innerHTML = value;
    }

    // EVENT LISTENERS
    const eventListeners = () => {
        // Element.btnSearch.addEventListener('click',seachAction);
        
        // Element.menuList.forEach( function(item){
        //     item.addEventListener('click',renderMenuResult);
        // });
        
        // Element.movieBox.forEach( function(item){
        //     item.addEventListener('click', renderDetails);
        // });
    }

    // RENDER ALL
    const renderAll = () => {
        // Fetch Movies
        fetchFromApi();
        
        eventListeners();
    };

    return {
        renderAll       : renderAll(),
    };
})();

export default App;
