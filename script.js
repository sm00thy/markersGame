let map, infoWindow, marker, modal, modalCloseBtn, avatar1, avatar2, avatar3, icon;

window.onload = () => {
    webSocket();
    modal = document.querySelector('.modal');
    modal.style.display = "block";
};
modalCloseBtn = document.querySelector('.closeBtn');
modalCloseBtn.addEventListener('click', function() {
    modal.style.display = "none";
});
//set avatar
avatar1 = document.querySelector('#av1')
avatar1.addEventListener('click', setAvatar(avatar1.src))
avatar2 = document.querySelector('#av2')
avatar2.addEventListener('click', setAvatar(avatar2.src))
avatar3 = document.querySelector('#av3')
avatar3.addEventListener('click', setAvatar(avatar3.src))


function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        center: {lat: 50.065, lng: 19.948},
        zoom: 12,
        disableDefaultUI: true,
        fullscreenControl: true,
        zoomControl: true,
        scaleControl: true,
        draggable: true
});

//get current position and set to marker
infoWindow = new google.maps.InfoWindow;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        marker = new google.maps.Marker({
                    position: pos,
                    map: map,    
                    icon: icon
                });
            
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

//if user doesn't allow to use geolocation open infoWindow
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Nie mozesz przystapić do gry, bez włączonej lokalizacji.' :
        'Twoja przeglądarka nie obsługuje usług geolokalizacji.');
        infoWindow.open(map);
    }
       
//navigation
let lat, lng, markerPos;
document.onkeydown = function moveMarker(e) {
    //up arrow
    if(e.keyCode === 38){
        markerPos = marker.getPosition();
        lat = markerPos.lat();
        lng = markerPos.lng();
        lat += 0.001;
        pos = {
            lat: lat,
            lng: lng
          };
        marker.setPosition(pos);
        map.setCenter(pos);
    }
    // down arrow
    else if (e.keyCode === 40) {
        markerPos = marker.getPosition();
        lat = markerPos.lat();
        lng = markerPos.lng();
        lat -= 0.001;
        pos = {
            lat: lat,
            lng: lng
          };
        marker.setPosition(pos);
        map.setCenter(pos);
    }
    // left arrow
    else if (e.keyCode === 37) {
        markerPos = marker.getPosition();
        lat = markerPos.lat();
        lng = markerPos.lng();
        lng -= 0.001;
        pos = {
            lat: lat,
            lng: lng
          };
        marker.setPosition(pos);
        map.setCenter(pos);
    }
    // right arrow
    else if (e.keyCode === 39) {
        markerPos = marker.getPosition();
        lat = markerPos.lat();
        lng = markerPos.lng();
        lng += 0.001;
        pos = {
            lat: lat,
            lng: lng
          };
        marker.setPosition(pos);
        map.setCenter(pos);
    }
}

function setAvatar(avatar) {
    icon = avatar;
}

// connect with web socket
function webSocket() {
    const url = 'wss://echo.websocket.org';
    socket = new WebSocket(url);
    socket.onopen = (e) => {
        writeToChat("Connected!");
    }
    socket.onmessage = (e) => {
            onMessage(e);
        }
    socket.onerror = (e) => {
            writeToChat(e.data);
        }
    
 //   socket.send(JSON.stringify(pos));
    
}

let opponent;
//incoming message
function onMessage(e) {
    writeToChat('<span style="color: black;font-style:italic;">' + e.data + '</span>')
//   let incomingPosition = JSON.parse(e.data);
//   opponent = new google.maps.Marker({
//       position: {lat: incomingPosition.lat, lng: incomingPosition.lng},
//       map: map,
//       label: 'no 2'
//     })
    
//    console.log(incomingPosition)
}

//send message
function doSend(message) {
    document.querySelector('#inputMsg').value = "";
    socket.send(message);
    writeToChat(message);
}

let messageArea = document.querySelector('.messageWindow');

//Display messages on chat
function writeToChat(message) {
    let msg = document.createElement("p");
    msg.style.wordWrap = "break-word";
    msg.innerHTML = message;
    messageArea.appendChild(msg);
}