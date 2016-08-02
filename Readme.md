**Korea Meteorological Administration**
===================================

소개
------------
구글 GeoLocation API와 KMA의 날씨 정보(RSS)를 이용하여 날씨 정보를 받아오는 라이브러리 입니다.

KMA에서 날씨정보를 얻어오기 위해서는 bcode (지역코드)를 필요로 하지만
해당 라이브러리를 이용하면 좌표를 이용해서 해당 지역의 날씨 정보를 받아 올 수 있습니다.

해당 라이브러리의 작동 방식은 다음과 같습니다.

1. 유저가 좌표를 이용해서 날씨 정보를 요청.
2. Google Maps GeoLocation API 를 이용하여 좌표를 주소로 변환.
3. KMA에 있는 bcode <-> 좌표 매치 데이터를 이용하여 bcode 를 얻어옴.
4. bcode를 이용하여 KMA에 현재 날씨 정보를 받아옴.

라이브러리 사용 조건
-----------
* ES6
* Promise
* Node.js

빠른 시작
-----

설치 방법
```javascript
npm install kma-js
```

좌표로 날씨 정보 가져오기
```javascript
let kmaWeather = require('kma-js').Weather;
kmaWeather.townWeather('37.49543016888596', '127.03781811461468')
    .then(data => console.log(data));
```

`townWeather(위도, 경도)` 3일간의 날씨 데이터를 가져옵니다 (오늘, 내일, 내일모레)
 
 좌표로 bcode 가져오기
```javascript
let kmaUtils = require('kma-js').Kma;
kmaUtils.convertBcode('37.49543016888596', '127.03781811461468')
    .then(data => console.log(data));
```

`convertBcode(위도, 경도)` 현재 좌표를 가지고 kma에서 사용하는 bcode 를 가져옵니다

참고 자료
-----
* [Google GeoLocation API](https://developers.google.com/maps/documentation/geolocation/intro)
* [Korea Meteorological Administration](http://www.kma.go.kr)