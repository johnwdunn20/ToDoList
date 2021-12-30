        let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let monthsOfYear = ['January','February','March','April','May','June','July','August','September','October','Novemeber','December'];
        
        function populateDates(dayOnCalendar) {
            let container = document.getElementsByClassName('container')[0];

            // find the last day so we can add after it - would have been easier to go from the end of the container
            let dayContainers = container.getElementsByClassName('dayContainer');
            let numberDays = dayContainers.length;
            let currentDay = dayContainers[dayOnCalendar];

            let title = currentDay.getElementsByClassName('day-title')[0];
            let subtitle = currentDay.getElementsByClassName('day-subtitle')[0];

            let today = new Date();
            today.setDate(today.getDate() + dayOnCalendar);
            title.innerHTML = `${daysOfWeek[today.getDay()]}`;
            subtitle.innerHTML = `${monthsOfYear[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
            return;
        }
        function allowItems(dayOnCalendar) {
            let addItemButton = document.getElementsByClassName('add-item')[dayOnCalendar];
            let textInput = document.getElementsByClassName('input')[dayOnCalendar];
            addItemButton.addEventListener('click', function() {
                addNewItem(this);
            });
            textInput.addEventListener("keyup", function(event) {
                if(event.key !== "Enter") return;
                event.preventDefault();
                addNewItem(this);
                
            });
        }

        function addNewItem(element) {

            let input = element.parentNode.getElementsByTagName('input')[0];
            let inputText = input.value; 
            if (inputText) {
                let list = element.parentNode.getElementsByTagName('ul')[0];

                if (list.getElementsByTagName('li').length == 0) {
                    addClearButton(element.parentNode);
                }

                // add new item
                let newItem = document.createElement('li');
                newItem.className = 'item';
                newItem.innerHTML = `<span class="item-text"> ${inputText} </span>
                <div class="item-div">
                    <strong class="check-item" onclick="checkItem(event)">[&#10003;]</strong>
                    <strong class="remove-button" onclick="removeItem(event)">[x]</strong>
                </div>`;
                list.append(newItem);

                input.value = '';

                activateSaveButton();

            } else {
            window.alert('Please enter a to-do item in order to add it to your list');
        }
        }

        function checkItem(event) {
            let itemText = event.currentTarget.closest('li').firstChild;
            if (itemText.className != 'item-text-strikethrough') {
                itemText.className = 'item-text-strikethrough';

                event.currentTarget.innerHTML = '[&#9100]';
                event.currentTarget.className = 'uncheck-item';
                return;
                
            }
            itemText.className = 'item-text';
            event.currentTarget.innerHTML = '[&#10003;]';
            event.currentTarget.className = 'check-item';
        }

        // remove individual item in list
        function removeItem(event) {
            if (event.currentTarget.closest('ul').getElementsByTagName('li').length == 1) {
                event.currentTarget.closest('.add-button-container').querySelector('#clear').remove();
            }
            event.currentTarget.closest('li').remove();
        }

        function addClearButton(parent) {
            let list0 = parent.getElementsByClassName('list')[0];
            let clearButton = document.createElement('input');
            clearButton.id = 'clear';
            clearButton.type = 'button';
            clearButton.value = 'Clear All';
            clearButton.addEventListener('click', function() {
                clearList(this);
            });
            list0.before(clearButton);
        }

        // clears entire list
        function clearList(element) {
            let list = element.parentNode.getElementsByClassName('list')[0];
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
            // remove clear button
            element.remove();
        }



        // **** Need to get this to work later ***

        let zipSubmit = document.getElementById('add-zip');            
        zipSubmit.addEventListener('click', function() {
            getWeather(this);
        });
        let zipInput = document.getElementById('weather-input');
        zipInput.addEventListener("keyup", function(event) {
            if(event.key !== "Enter") return;
            event.preventDefault();
            getWeather(this);
            
        }, false);

        function getWeather(element) {
            let zip;
            if (element) {
                let inputElement = element.parentNode.getElementsByTagName('input')[0];
                zip = inputElement.value;
                if (zip.length != 5) {
                    alert('Please enter a 5 digit numeric zip code');
                    return;
                }
                if (isNaN(zip)) {
                    alert('Please enter a 5 digit numeric zip code');
                    return;        
                }
                localStorage.setItem('zip', zip);
                inputElement.value = '';
            } else zip = localStorage.getItem('zip');

            try {
                let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&appid=c2541fa183a6d1bc7a654334c0eadb43`;

                let lat;
                let lon;

                $.getJSON(url, function(data) {

                    lat = data.coord.lat;
                    lon = data.coord.lon;
                    let pageTitle = document.getElementById('page-title');
                    pageTitle.innerHTML = `To-do's in ${data.name}`;
                })

                // Update to async/await later
                setTimeout( function() {  
                    // Use those  coordinates to get the forecast. Forecast API only accepts coordinates
                        // documentation: https://openweathermap.org/api/one-call-api
                    let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minute,hourly,alerts&units=imperial&appid=c2541fa183a6d1bc7a654334c0eadb43`;
                    console.log(`URL: ${urlForecast}`);


                    $.getJSON(urlForecast, function(data) {

                        let dayContainers = document.getElementsByClassName('dayContainer');
                        let numberDays = dayContainers.length - 1;

                        for (let dayNumber = 0; dayNumber <= numberDays; dayNumber++) {
                            let minTemp = data.daily[dayNumber].temp.min;
                            let maxTemp = data.daily[dayNumber].temp.max;
    
                            // they provide a url for the icons, but icon id is in the data
                            let icon = `https://openweathermap.org/img/w/${data.daily[dayNumber].weather[0].icon}.png`;
                            let weatherDescription = data.daily[dayNumber].weather[0].main;
    
                            // needs to get called when you create
                            let day = dayContainers[dayNumber];
                            day.getElementsByClassName('icon')[0].src = icon;
                            day.getElementsByClassName('temp')[0].innerHTML = `${Math.round(minTemp)} - ${Math.round(maxTemp)} &#176;F`;
                            day.getElementsByClassName('weather')[0].innerHTML = weatherDescription;
                        }
                    })}
                , 800);
                // Use those coordinates to get a forecast
            } catch(error) {
                    // Could I display something like this to the user?
                    console.log('API did not work - need to refresh page');
                }


        }           
        
        // add new day
        let addNewButton = document.getElementById('add-new');
        addNewButton.onclick = addNewDay;
        
        function addNewDay() {
            let container = document.getElementsByClassName('container')[0];

            // find the last day so we can add after it - would have been easier to go from the end of the container
            let dayContainers = container.getElementsByClassName('dayContainer');
            let numberDays = dayContainers.length;
            let lastDay = dayContainers[numberDays-1];

            // add new dayContainer
            let newDayContainer = document.createElement('div');
            newDayContainer.className = 'dayContainer';
            
            newDayContainer.innerHTML = `
                <h1 class='day-container-header'>
                    <span class = 'day-title'>
                </h1>
                <p class = 'day-subtitle'><p>
                <div class="weather-container">
                    <img class="icon">
                    <p class="weather"></p>
                    <p class="temp"></p>
                </div>
                <div class="add-button-container">
                    <input class = 'input' placeholder="Enter your plans">
                    <input type="button" value="Add" class='add-item'>
                    <br>
                    <br>   
                    <ul class='list'></ul>
                    
                </div>`;

            lastDay.parentNode.insertBefore(newDayContainer, lastDay.nextSibling);

            populateDates(numberDays);
            allowItems(numberDays);
            getWeather();

        }
    
        function saveItems() {
            let zip = window.localStorage.getItem('zip');
            window.localStorage.clear();
            window.localStorage.setItem('zip',zip);

            // add items
            let itemsInLists = {};
            let days = document.getElementsByClassName('dayContainer');
            for (day of days) {
                // store the day
                let date = day.getElementsByClassName('day-subtitle')[0].innerHTML;
                itemsInLists[date] = [];

                // get each individual item
                let allItemTexts = day.getElementsByClassName('item-text');
                for (itemText of allItemTexts) {
                    itemsInLists[date].push(itemText.innerHTML);
                }
            }
            localStorage.setItem('itemsInLists', JSON.stringify(itemsInLists));

            // reset save button by clearing and creating a new one
            document.getElementById('save-button').remove();
            let saveButtonForm = document.getElementById('save-button-form');
            let newSaveButton = document.createElement('input');
            newSaveButton.id = 'save-button';
            newSaveButton.disabled = true;
            newSaveButton.type = 'button'
            newSaveButton.value = 'Save List';
            newSaveButton.title = 'Allows you to navigate away from the page and see your list when you return';
            newSaveButton.onclick = 'saveItems';
            saveButtonForm.append(newSaveButton);
        }

        // add data back in
        document.addEventListener('DOMContentLoaded', function(event) {
            let itemsInLists = JSON.parse(window.localStorage.getItem('itemsInLists'));
            console.log('DOMContentLoad');

            let today = new Date();
            let todayFormatted = `${monthsOfYear[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
            // console.log(todayFormatted);

            for (let day in itemsInLists) {
                
                let items = itemsInLists[day];
                console.log(items);
                // if (day != today) continue;
                for (item of items) {
                    console.log(item);
                }
                
            }
        });





        function activateSaveButton() {
            let saveButton = document.getElementById('save-button');
            saveButton.onclick = saveItems;
            saveButton.disabled = false;
            saveButton.style.backgroundColor = 'rgb(255, 0, 0)';
            saveButton.style.color = 'rgb(255, 255, 255)';
        }

        // initial calls for first day
        populateDates(0);
        allowItems(0);
        getWeather();


        // **** Saving in Local Storage*** 
        // Notify if not saved
        // let saveListButton = document.getElementById('save-button');
        // console.log(saveListButton.disabled)
        // window.addEventListener('beforeunload', function (e) {
        //     if (!saveListButton.disabled) {
        //         e.preventDefault();
        //         e.returnValue = '';
        //     }
        // });

        // function addNewItemFromLocalStorage(itemFromLocal) {

        //     let list = document.getElementById('list0');
        //     let newItem = document.createElement('li');

        //     newItem.className = 'item';
        //     newItem.innerHTML = itemFromLocal;
        //     list1.append(newItem);

        // }

        // function addListFromLocalStorage() {
        //     console.log(localStorage.length);
        //     for (let i = 0; i < localStorage.length; i++){
        //         let localItem = localStorage.getItem(localStorage.key(i));
        //         addNewItemFromLocalStorage(localItem);

        //         console.log(`Added "${i}: ${localItem}" from local storage`);
        //     }
        // }

        // addListFromLocalStorage();
        
