var button = document.querySelector('.button')
var inputValue = document.querySelector('.inputValue')
var name = document.querySelector('.name');
var desc = document.querySelector('.desc');
var temp = document.querySelector('.temp');

button.addEventListener('click', function(){
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputValue.value+'&appid=251145448f9253cdd071ca904b1dd199')
    .then(Response => Response.json())
    .then(data => {
        var nameValue = data['name'];
        var tempValue = data['main']['temp'];
        var descValue = data['weather'][0]['description'];

        name.innerHtml =nameValue;
        temp.innerHTML = tempValue;
        desc.innerHTML = descValue;

    })



.catch(err => alert("Not Applicable."))
})