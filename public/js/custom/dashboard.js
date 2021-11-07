
$(document).ready(function() {
    $('#carousel-admin').slick({
        dots: true,
        arrows: false
    });
})

/**
 * Query selector
 * @param {string} element
 * @returns {Object}
 */
 const querySelect = (element) => document.querySelector(element);

/**
 * Query selector all
 * @param {String} element
 * @returns {Object}
 */
 const queryAll = (element) => document.querySelectorAll(element);

const menu_content = (toggleElm, buttonElm, bodyElm, linkElm) => {
    const toggle = querySelect(toggleElm);
    const close = querySelect(buttonElm);
    const menu = querySelect(bodyElm);
    const link = queryAll(linkElm);
    if (toggle && close && menu && link) {
        toggle.addEventListener('click', () => {
            console.log('click')
            menu.classList.add('show')
        })
        close.addEventListener('click', () => {
            menu.classList.remove('show')
        })
        link.forEach((elm) => {
            elm.onclick = () => {
                menu.classList.remove('show');
                
            }
        })

    }
}

menu_content('.nav__menu-toggle', '#close_menu', '.nav__menu', '#link')

function generateClock() {
    const date = new Date();

    let time = {
        hour	: date.getHours(),
        minute  : date.getMinutes(),
        second  : date.getSeconds(),
        type 	: 'am'
    }
        if (time.hour == 12) {
            time.change = 'pm';
        } else if (time.hour > 12) {
            time.hour -= 12;
            time.type = 'pm'
        }
        
        if (time.hour < 10) {
            time.hour = '0' + time.hour;
        }
        
        if (time.minute < 10) {
            time.minute = '0' + time.minute;
        }

        if (time.second < 10) {
            time.second = '0' + time.second;
        }

        return time.hour + ':' + time.minute + ':' + time.second + ' ' + time.type;	
    }

    const clock = () => {
        const content = document.querySelector('#time');
        if (content) {
            let time = generateClock();
            content.innerText = time;

            setInterval(() => {
                let time = generateClock();
                content.innerText = time;
            }, 1000);
        }
    }

clock();

const windowModal = (btnModals, btnToggle, btnMini, btnMaxi) => {
    const btnOpenModal = queryAll(btnModals);
    const toggle = queryAll(btnToggle);
    const mini = queryAll(btnMini);
    const maxi = queryAll(btnMaxi);
    if (btnOpenModal && toggle && mini && maxi) {
        btnOpenModal.forEach((elm) => {
            elm.onclick = () => {
                const window = elm.getAttribute('data-window');
                document.getElementById(window).classList.add('show');
            }
        })
        mini.forEach((elm) => {
            elm.onclick = () => {
                const window = (elm.closest('.window').classList.toggle('minimize'))
                if (elm.closest('.window').classList.contains('maximize')) {
                    elm.closest('.window').classList.remove('maximize')
                }
            }
        })
        maxi.forEach((elm) => {
            elm.onclick = () => {
                const window = (elm.closest('.window').classList.toggle('maximize'))
            }
        })
        toggle.forEach((elm) => {
            elm.onclick = () => {
                const window = (elm.closest('.window').classList.remove('show'));
                if (elm.closest('.window').classList.contains('minimize')) {
                    const window = (elm.closest('.window').classList.remove('minimize'));
                }
            }
        })

        window.onclick = (e) => {
            if (e.target.className === 'window') {
                e.target.classList.remove('show');
            }
        }
    }
};

windowModal('#window_open', '.window_close', '.window_minimize', '.window_maximize')

$(function() {
    /**
     * Drag
     */
    $('.window').draggable({
        refreshPositions: true,
        distance: 30,
        cursorAt: {left: 5, top: 5},
    });
});

$(function() {
    $('#datepicker').datepicker({
        dateFormat: 'dd-mm-yy'
    })
})

$(document).ready(function() {
    $('#disable').click(function() {
        $('#form_one').addClass('active');
        if ($('#form_two').hasClass('active')) {
            $('#form_two').removeClass('active');
        }
    })

    $('#enable').click(function() {
        $('#form_two').addClass('active');
        if ($('#form_one').hasClass('active')) {
            $('#form_one').removeClass('active');
        }
    })
})
