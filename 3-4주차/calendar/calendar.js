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
                if (+date.innerText == today.getDate()) {
                    date.classList.add('today');
                    break;
                }
            }
        }
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


            // 검색&일정 부분
            const eventElement = document.querySelector('body');
            const thisYear = date.getFullYear();
            const thisMonth = date.getMonth();
            let searchBox = document.createElement('div');
            searchBox.classList.add('event-area');
            searchBox.innerHTML = `
                <div class="search-area">
                    <input type="number" placeholder="${thisYear}">
                    <input type="number" placeholder="${thisMonth+1}">
                    <button class="search-btn">검색</button>
                </div>
                <div class="todoList-area"></div>
            `;
            eventElement.append(searchBox);



            ////20230201 여기까지 함 날짜 선택하면 색 바뀌고 인풋에 놓기
            const datesContainer = document.querySelector(".dates");
            datesContainer.addEventListener('click', function(dateElement) {
                if (dateElement.target.classList.contains('date')) {
                    const allDates = document.querySelectorAll('.date');
                    allDates.forEach(date => {
                        date.style.backgroundColor = '';
                    });

                    event.target.style.backgroundColor = 'lightblue';
                }

            })

            render();
        });
    }
    return {
        init: init
    };
})();

calendarModule.init();