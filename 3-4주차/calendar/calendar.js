const calendarModule = (function() {

    let date = new Date();

    function render() {
        // 현재 년&월 출력
        const thisYear = date.getFullYear();
        const thisMonth = date.getMonth();

        document.querySelector('.year-month').textContent = `${thisYear}년 ${thisMonth + 1}월`

        // 지난달과 이번달의 마지막 날, 날짜와 요일
        const prevLast = new Date(thisYear, thisMonth, 0);
        const thisLast = new Date(thisYear, thisMonth + 1, 0);

        const pLDate = prevLast.getDate();
        const pLDay = prevLast.getDay();

        const tLDate = thisLast.getDate();
        const tLDay = thisLast.getDay();
        
        // 지난달, 이번달, 다음달 배열 생성
        const prevDates = [];
        const thisDates = [...Array(tLDate + 1).keys()].slice(1);
        const nextDates = [];

        if (pLDay != 6) {
            for (let i = 0; i < pLDay + 1; i++) {
                prevDates.unshift(pLDate - i);
            }
        }
        for (let i = 1; i < 7 - tLDay; i++) {
            nextDates.push(i);
        }
        
        const dates = prevDates.concat(thisDates, nextDates);

        // 화면에 날짜 표시
        const thisFirstIndex = dates.indexOf(1);
        const thisLastIndex = dates.lastIndexOf(tLDate);

        dates.forEach((date, i) => {
            const condition = i >= thisFirstIndex && i < thisLastIndex + 1 ? 'date' : 'other';
            dates[i] = `<div class=${condition}><span>${date}</span></div>`;
        });
        
        document.querySelector('.dates').innerHTML = dates.join('');

        // 오늘 날짜 표시
        const today = new Date();
        if (thisMonth == today.getMonth() && thisYear == today.getFullYear()){
            for (let date of document.querySelectorAll('.date')) {
                if (+date.childNodes[0].textContent == today.getDate()) {
                    date.classList.add('today');
                    break;
                }
            }
        }

        // 클릭한 날짜 표시
        const dateElements = document.querySelectorAll(".date span");
        const thisListDate = document.querySelector('.this-date');
            
        dateElements.forEach(dateElement => {
            dateElement.addEventListener('click', function(event) {
                dateElements.forEach(element => {
                    element.style.background = '';
                });

                event.target.style.background = "white"

                // 일정 날짜 출력
                if (document.querySelector('.viewTdDate')) {
                    thisListDate.lastElementChild.remove();
                }

                let viewTdDate = document.createElement('span');
                viewTdDate.classList.add('viewTdDate');
                viewTdDate.innerHTML = `${date.getFullYear()}.${date.getMonth()+1}.${event.target.textContent}`
                thisListDate.append(viewTdDate);

                // 일정 리스트 출력
                const todoListUl = document.querySelectorAll('#todoListUl li');
                todoListUl.forEach(list => {
                    list.classList.remove('hidden');
                    if (list.className != viewTdDate.textContent) {
                        list.classList.add('hidden');
                    }
                })
            });
        })
    }

    function init() {
        document.addEventListener('DOMContentLoaded', function() {
            // 달력 부분 html 추가
            const calendarElement = document.querySelector('#calendar');
    
            let calendarBox = document.createElement('div');
            calendarBox.innerHTML = `
                <div class="year-month"></div>
                <div class="days">
                    <div class="day">SUN</div>
                    <div class="day">MON</div>
                    <div class="day">TUE</div>
                    <div class="day">WED</div>
                    <div class="day">THU</div>
                    <div class="day">FRI</div>
                    <div class="day">SAT</div>
                </div>
                <div class="dates"></div>
            `;
            calendarElement.append(calendarBox);
    
            // 검색&일정 부분
            const eventElement = document.querySelector('body');
            const thisYear = date.getFullYear();
            const thisMonth = date.getMonth();
            const thisDate = date.getDate();

            let searchBox = document.createElement('div');
            searchBox.classList.add('event-area');
            searchBox.innerHTML = `
                <div class="search-area">
                    <input type="number" value="${thisYear}" id="inputYear" default="${thisYear}" min="1" max="3000">
                    <input type="number" value="${thisMonth+1}" id="inpurMonth" default="${thisMonth+1}" min="1" max="12">
                    <button class="search-btn">검색</button>
                </div>
                <div class="todoList-area">
                    <div class="this-date"><span>TODO</span><span class="viewTdDate">${thisYear}.${thisMonth+1}.${thisDate}</span></div>
                    <div class="todolist">
                        <div class="add-area">
                            <input type="text" placeholder="TODOLIST 추가하기" id="inputSchedule" maxlength="100">
                            <button id="addList-btn">추가</button>
                        </div>
                        <div class="view-list">
                            <ul id="todoListUl"></ul>
                        </div>
                    </div>
                </div>
            `;
            eventElement.append(searchBox);
            
            // 이전달 이동
            document.getElementById("prev-month").addEventListener("click", () => {
                date.setMonth(date.getMonth() - 1);
                render();
            });
    
            // 다음달 이동
            document.getElementById("next-month").addEventListener("click", () => {
                date.setMonth(date.getMonth() + 1);
                render();
            });
    
            // 오늘로 이동
            document.getElementById("today-btn").addEventListener("click", () => {
                date = new Date();
                render();
            });


            // 년, 월로 검색
            const searchBtn = document.querySelector(".search-btn");
            const inputYear = document.getElementById("inputYear");
            const inputMonth = document.getElementById("inpurMonth");

            searchBtn.addEventListener("click", () => {
                if (inputYear.value == 0 || inputYear.value == null || inputYear.value < 1 || inputYear.value > 10000){
                    date.setMonth(inputMonth.value - 1);
                } else if(inputMonth.value == 0 || inputMonth.value == null || inputMonth.value < 1 || inputMonth > 12) {
                    date.setFullYear(inputYear.value);
                } else {
                    date.setFullYear(inputYear.value);
                    date.setMonth(inputMonth.value - 1);
                }
                render();
            })


            // 일정 추가하기
            const addBtn = document.getElementById("addList-btn");
            const inputSchedule = document.getElementById("inputSchedule");
            const scheduleBox = document.querySelector('.view-list ul');
           

            addBtn.addEventListener("click", () => {
                let selectedDate = document.querySelector('.viewTdDate');
                if (inputSchedule.value) {
                    let todoContent = document.createElement('li');
                    todoContent.classList.add(selectedDate.textContent);
                    todoContent.innerHTML = inputSchedule.value;
                    scheduleBox.append(todoContent);
                }

                inputSchedule.value = ""
                render();
            })

            render();
        });
    }
    return {
        init: init
    };
})();

calendarModule.init();