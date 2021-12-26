
        //comment out later
        window.localStorage.clear();
        let zip = 94939;
        getWeather();
        let dayNumber = 0;

        let today = new Date();
        let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let monthsOfYear = ['January','February','March','April','May','June','July','August','September','October','Novemeber','December'];

        for (let dayOnCalendar = 0; dayOnCalendar < 3/*Needs to be dynamic*/; dayOnCalendar++) {
            populateDates(dayOnCalendar);
        }
        
        function populateDates(dayOnCalendar) {
            let container = document.getElementsByClassName('container')[0];

            // find the last day so we can add after it - would have been easier to go from the end of the container
            let dayContainers = container.getElementsByClassName('dayContainer');
            let numberDays = dayContainers.length;
            let currentDay = dayContainers[dayOnCalendar];
            console.log('*****')
            console.log(currentDay)

            let title = currentDay.getElementsByClassName('day-title')[0];
            let subtitle = currentDay.getElementsByClassName('day-subtitle')[0];

            today.setDate(today.getDate() + dayOnCalendar)
            title.innerHTML = `${daysOfWeek[today.getDay()]}`;
            subtitle.innerHTML = `${monthsOfYear[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
            return;
        }

        let add1 = document.getElementById('add0');
        add1.addEventListener('click', function() {
            addNewItem(this);
        });

        let counter = localStorage.length;

        function addNewItem(element) {

            let input = element.parentNode.getElementsByTagName('input')[0];
            let inputText = input.value; 
            if (inputText) {
                let list = element.parentNode.getElementsByTagName('ul')[0];

                if (list.getElementsByTagName('li').length == 0) {
                    addClearButton();
                }

                // add new item
                let newItem = document.createElement('li');
                newItem.className = 'item';
                newItem.innerHTML = inputText + '<strong class="remove-button" onclick="removeItem(event)">[x]</strong>';;
                list.append(newItem)



                localStorage.setItem(counter, inputText);
                console.log(`Added "${inputText}" to local storage`);
                counter++;

                input.value = '';

                activateSaveButton();

            } else {
            window.alert('Please enter a to-do item in order to add it to your list');
        }
        }

        // remove individual item in list
        function removeItem(event) {
            event.currentTarget.closest('li').remove();
        }

        function addClearButton() {
            let list0 = document.getElementById('list0');
            let clearButton = document.createElement('input');
            clearButton.id = 'clear';
            clearButton.type = 'button';
            clearButton.value = 'Clear All';
            clearButton.addEventListener('click', clearList);
            
            let br = document.createElement('br');

            list0.before(br);
            list0.before(clearButton);

            console.log('Adding clear button');
        }

        // clears entire list
        function clearList() {
            // clear list
            let list = document.getElementById('list0');

            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }

            // remove clear button
            let clearButton = document.getElementById('clear');
            clearButton.remove();
        }

        function addNewItemFromLocalStorage(itemFromLocal) {

            let list = document.getElementById('list0');
            let newItem = document.createElement('li');

            newItem.className = 'item';
            newItem.innerHTML = itemFromLocal;
            list1.append(newItem);

        }

        function addListFromLocalStorage() {
            console.log(localStorage.length);
            for (let i = 0; i < localStorage.length; i++){
                let localItem = localStorage.getItem(localStorage.key(i));
                addNewItemFromLocalStorage(localItem);

                console.log(`Added "${i}: ${localItem}" from local storage`);
            }
        }

        addListFromLocalStorage();

        
        function addNewDay() {

            //***Fill in code from practice here**
            return;
        }

        // let stop = 0;
        // for([key,value] in window.localStorage) {
        //     console.log(`${key}: ${window.localStorage.getItem(key)} aka ${value}`);

        //     stop++;
        //     if (stop > 10) {
        //         break;
        //     }
        // }
        
        
        // also session storage to store your session
        // info stored in chrome dev tools under application
        
        //set item in local storage
        // localStorage.setItem('name', 'John');

        // get item in local storage

        // let myName = localStorage.getItem('name');
        // console.log(myName);


        // **** Need to get this to work later ***

        let zipInput = document.getElementById('add-zip');            
        zipInput.addEventListener('click', getWeather);

        // async function getUsers(url) {
        //     let response = await fetch(url);
        //     let data = await response.json()
        //     return data;
        //     }  

        function getWeather() {

            try {

                // Get coordinates from this API
                let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&appid=c2541fa183a6d1bc7a654334c0eadb43`;

                let lat;
                let lon;

                $.getJSON(url, function(data) {

                    lat = data.coord.lat;
                    lon = data.coord.lon;
                    console.log(` Latitude ${lat}`);
                    console.log(` Longitude ${lon}`);

                })

                // Update to async/await later
                setTimeout( function() {  
                    // Use those  coordinates to get the forecast. Forecast API only accepts coordinates
                        // documentation: https://openweathermap.org/api/one-call-api
                    let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minute,hourly,alerts&units=imperial&appid=c2541fa183a6d1bc7a654334c0eadb43`;
                    console.log(`URL: ${urlForecast}`);


                    $.getJSON(urlForecast, function(data) {

                        let minTemp = data.daily[dayNumber].temp.min;
                        let maxTemp = data.daily[dayNumber].temp.max;
                        console.log(`${minTemp}F - ${maxTemp}F`);

                        // they provide a url for the icons, but icon id is in the data
                        let icon = `http://openweathermap.org/img/w/${data.daily[dayNumber].weather[0].icon}.png`;
                        let weatherDescription = data.daily[dayNumber].weather[0].main;

                        // needs to get called when you create
                        let day0 = document.getElementById('day0');
                        day0.getElementsByClassName('icon')[0].src = icon;
                        day0.getElementsByClassName('temp')[0].innerHTML = `${minTemp} - ${maxTemp}F&#176;`;
                        day0.getElementsByClassName('weather')[0].innerHTML = weatherDescription;
                    })}
                , 600);
                // Use those coordinates to get a forecast
            } catch(error) {
                    console.log('Did not work');
                }


        }           
        
        // add new day
        let addNewButton = document.getElementById('add-new');
        addNewButton.onclick = addNewDay;
        
        function addNewDay() {
            let container = document.getElementsByClassName('container')[0];
            console.log(container);

            // find the last day so we can add after it - would have been easier to go from the end of the container
            let dayContainers = container.getElementsByClassName('dayContainer');
            let numberDays = dayContainers.length;
            let lastDay = dayContainers[numberDays-1];
            console.log(lastDay)

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
                    <input class = 'input'>
                    <input type="button" value="Add">
                    <ul class='list'></ul>
                    
                </div>`;

            lastDay.parentNode.insertBefore(newDayContainer, lastDay.nextSibling);

            // populateDates(lastDay + 1);

            let dayOnCalendar = 3;
            let container1 = document.getElementsByClassName('container')[0];
            // find the last day so we can add after it - would have been easier to go from the end of the container
            let dayContainers1 = container1.getElementsByClassName('dayContainer');
            let numberDays1 = dayContainers1.length;
            let currentDay1 = dayContainers1[dayOnCalendar];

            let title = currentDay1.getElementsByClassName('day-title')[0];
            let subtitle = currentDay1.getElementsByClassName('day-subtitle')[0];

            today.setDate(today.getDate() + dayOnCalendar)
            title.innerHTML = `${daysOfWeek[today.getDay()]}`;
            subtitle.innerHTML = `${monthsOfYear[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
            console.log('title style' + title.style);
            return;

        }
    
        function saveItems() {
            window.localStorage.clear();

            // add zip to local storage
            localStorage.setItem('zip', zip);

            // add items
            let itemsInLists = {};
            let days = document.getElementsByClassName('dayContainer');
            console.log(days);
            for (day of days) {
                // store the day
                console.log(day);
                let date = day.getElementsByClassName('day-subtitle')[0].innerHTML;
                itemsInLists[date] = [];

                // get each individual item
                let items = day.getElementsByClassName('item');
                for (item of items) {
                    itemsInLists[date].push(item);
                }
            }
            console.log(itemsInLists);
            localStorage.setItem('items', itemsInLists);

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

        function activateSaveButton() {
            let saveButton = document.getElementById('save-button');
            saveButton.onclick = saveItems;
            saveButton.disabled = false;
            saveButton.style.backgroundColor = 'rgb(255, 0, 0)';
            saveButton.style.color = 'rgb(255, 255, 255)';
        }

        // Notify if not saved
        // let saveListButton = document.getElementById('save-button');
        // console.log(saveListButton.disabled)
        // window.addEventListener('beforeunload', function (e) {
        //     if (!saveListButton.disabled) {
        //         e.preventDefault();
        //         e.returnValue = '';
        //     }
        // });
