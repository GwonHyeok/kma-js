/**
 * Created by GwonHyeok on 2016. 8. 1..
 */

const kmaWeather = require('../index').Weather;
const positionMap = [
    {value: '서울', position: [37.49543016888596, 127.03781811461468]},
    {value: '부산', position: [35.151458, 129.083464]},
    {value: '대구', position: [35.836322, 128.592447]},
    {value: '인천', position: [37.449751, 126.723093]},
    {value: '광주', position: [35.141875, 126.858217]},
    {value: '대전', position: [36.334646, 127.439953]},
    {value: '울산', position: [35.533476, 129.288320]},
    {value: '경기도', position: [37.387790, 127.342400]},
    {value: '강원도', position: [37.722295, 128.571392]},
    {value: '충청북도', position: [36.479450, 127.703084]},
    {value: '충청남도', position: [36.414420, 126.792824]},
    {value: '전라북도', position: [35.744678, 127.245797]},
    {value: '전라남도', position: [34.819673, 126.972712]},
    {value: '경상북도', position: [36.453033, 128.891955]},
    {value: '경상남도', position: [35.587527, 128.571737]},
    {value: '제주특별자치도', position: [33.368654, 126.590823]},
];

describe('날씨 라이브러리 테스트', () => {
    describe('좌표를 가지고 날씨를 가져온다', () => {
        for (var i = 0; i < positionMap.length; i++) {
            const data = positionMap[i];
            it(`${data.value} 지역의 날씨 정보를 정상적으로 가져와야한다`, (done) => {
                kmaWeather.townWeather(data.position[0], data.position[1])
                    .then(weather => done())
            });
        }
    });
});