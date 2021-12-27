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
            addItemButton.addEventListener('click', function() {
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
                newItem.innerHTML = inputText + '<strong class="remove-button" onclick="removeItem(event)">[x]</strong>';;
                list.append(newItem)

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

        function addClearButton(parent) {
            let list0 = parent.getElementsByClassName('list')[0];
            let clearButton = document.createElement('input');
            clearButton.id = 'clear';
            clearButton.type = 'button';
            clearButton.value = 'Clear All';
            clearButton.addEventListener('click', function() {
                clearList(this);
            });
            
            let br = document.createElement('br');
            list0.before(br);
            list0.before(clearButton);
        }

        // clears entire list
        function clearList(element) {
            let list = element.parentNode.getElementsByClassName('list')[0];
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
            // remove clear button
            let clearButton = document.getElementById('clear');
            clearButton.remove();
        }



        // **** Need to get this to work later ***

        let zipInput = document.getElementById('add-zip');            
        zipInput.addEventListener('click', function() {
            getWeather(this);
        });

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
                            console.log(`day number ${dayNumber}`);
                            let minTemp = data.daily[dayNumber].temp.min;
                            let maxTemp = data.daily[dayNumber].temp.max;
                            console.log(`${minTemp}F - ${maxTemp}F`);
    
                            // they provide a url for the icons, but icon id is in the data
                            let icon = `https://openweathermap.org/img/w/${data.daily[dayNumber].weather[0].icon}.png`;
                            let weatherDescription = data.daily[dayNumber].weather[0].main;
    
                            // needs to get called when you create
                            let day = dayContainers[dayNumber];
                            console.log(day);
                            day.getElementsByClassName('icon')[0].src = icon;
                            day.getElementsByClassName('temp')[0].innerHTML = `${Math.round(minTemp)} - ${Math.round(maxTemp)} &#176;F`;
                            day.getElementsByClassName('weather')[0].innerHTML = weatherDescription;
                        }
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
                    <input class = 'input'>
                    <input type="button" value="Add" class='add-item'>
                    <ul class='list'></ul>
                    
                </div>`;

            lastDay.parentNode.insertBefore(newDayContainer, lastDay.nextSibling);

            populateDates(numberDays);
            allowItems(numberDays);
            getWeather();

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
        
