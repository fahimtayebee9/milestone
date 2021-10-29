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
        }
    }

    const renderSearchResult = (data) => {
        Element.galleryDiv.innerHTML = "";
        data.forEach( item => {
            Element.galleryDiv.appendChild(item);
        });
    }

    // SEARCH ACTION
    const seachAction = () => {
        const data = document.querySelectorAll('.data-list');
        
        let result = Array.from(data).filter( (element) => {
            return filterData(element);
        });
        
        renderSearchResult(result);
    }

    const filterData = (element) => {
        var searchInput = Element.searchInput.value;
        let data = null ;
        Array.from(element.children[1].children).forEach( item => {
            if(item.className.includes('card-name')){
                if(item.innerHTML.toString().toLowerCase().includes(searchInput.toLowerCase())){
                    data = element;
                }
            }
        });

        if(data != null){
            return data;
        }
        else if(Element.searchInput.value == "" || Element.searchInput.value == null){
            fetchFromApi();
        }
    }

    // RENDER SINGLE USER
    const renderData = (data) => {
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

        eventListeners();
    };

    const openEditModal = (event) => {
        let modalClass = event.target.closest('.card').classList[2];
        let modalDiv = Array.from(document.querySelectorAll('.modal-container')).filter(function(element) {
            return element.id == modalClass; 
        })[0];
        modalDiv.style.display = "block";
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
            markUp += `<div class="modal-container did_${count}" style="display: none;" id="uid_${item.name.first}" data-id="did_${count}">
                            <div class="modal" role="dialog">
                                <button type="button" id="btn_uid_${item.name.first}" class="modal-close-btn"><strong>X</strong></button>
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
                            <div class="modal-btn-container">
                                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                                <button type="button" id="modal-next" class="modal-next btn">Next</button>
                            </div>
                        </div>`;
            setValue(Element.galleryModals, markUp);
            count++;
        });

        modalEvents();

    }

    const setValue = (elementObj, value) => {
        elementObj.innerHTML = value;
    }

    //MODAL EVENTS
    const modalEvents = () => {
        document.querySelectorAll('.modal-close-btn').forEach( btn => {
            btn.addEventListener('click' , e => {
                e.target.closest('.modal-container').style.display = "none";
            });
        });

        document.querySelectorAll('.modal-prev').forEach( btn => {
            btn.addEventListener('click' , e => {
                e.preventDefault();
                let current_emp_sl = e.target.closest('.modal-container').getAttribute('data-id').toString().split('_')[1];
                if(current_emp_sl > 0 && current_emp_sl < 12){
                    document.querySelector('.did_'+ current_emp_sl).style.display = "none";
                    let modalDiv = document.querySelector('.did_'+ (--current_emp_sl));
                    modalDiv.style.display = "block";
                    
                }
            });
        });

        document.querySelectorAll('.modal-next').forEach( btn => {
            btn.addEventListener('click' , e => {
                e.preventDefault();
                let current_emp_sl = e.target.closest('.modal-container').getAttribute('data-id').toString().split('_')[1];
                if(current_emp_sl >= 0 && current_emp_sl < 11){
                    document.querySelector('.did_'+ current_emp_sl).style.display = "none";
                    let modalDiv = document.querySelector('.did_'+ (++current_emp_sl));
                    modalDiv.style.display = "block";
                }
            });
        });
    } 

    // EVENT LISTENERS
    const eventListeners = () => {
        Element.searchSubmit.addEventListener('click' , seachAction);

        document.querySelectorAll('.data-list').forEach( modal => {
            modal.addEventListener('click' , e => {
                e.target.closest('.card').addEventListener('click', event => {
                    event.preventDefault();
                    openEditModal(event);
                });
            })
        });
        
        document.querySelector('#search-input').addEventListener('input', ()=>{ 
            if(document.querySelector('#search-input').value == ""){
                fetchFromApi();
            }
        });
    }

    // RENDER ALL
    const renderAll = () => {
        // Fetch Movies
        fetchFromApi();
        
    };

    return {
        renderAll       : renderAll(),
    };
})();

export default App;
