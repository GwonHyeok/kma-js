/**
 * Created by GwonHyeok on 2016. 8. 1..
 */
const feedParser = require('feedparser-promised')
    , moment = require('moment')
    , kma = require('../lib/kma');

class Weather {

    townWeather(latitude, longitude) {
        return new Promise((resolve, reject) => {
            kma.convertBcode(latitude, longitude)
                .then(bcode => {
                    const url = `http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=${bcode}`;
                    return feedParser.parse(url)
                })
                .then(feedData => {
                    let data;

                    if (feedData.length == 0) return reject({
                        title: `날씨 정보를 가져올 수 없습니다`,
                        message: `${bcode}에 해당하는 날씨 정보를 가져올 수 없습니다`,
                        link: url
                    });

                    const weather = feedData[0];
                    const date = moment(weather['meta']['rss:pubdate']['#'], 'YYYY년 MM월 DD일 (ddd)요일 HH:mm', 'ko');

                    // 날씨 데이터
                    data = {
                        title: weather.title,
                        category: weather.categories[0],
                        author: weather.author,
                        lastUpdated: moment(date).format(),
                        info: []
                    };


                    const weatherInfo = weather['rss:description']['body']['data'];
                    weatherInfo.forEach(info => {
                        const hour = info['hour']['#'];
                        const day = info['day']['#'];
                        const temp = info['temp']['#'];
                        const tmx = info['tmx']['#'];
                        const tmn = info['tmn']['#'];
                        const sky = info['sky']['#'];
                        const pty = info['pty']['#'];
                        const wfkor = info['wfkor']['#'];
                        const wfen = info['wfen']['#'];
                        const pop = info['pop']['#'];
                        const r12 = info['r12']['#'];
                        const s12 = info['s12']['#'];
                        const ws = info['ws']['#'];
                        const wd = info['wd']['#'];
                        const wdkor = info['wdkor']['#'];
                        const wden = info['wden']['#'];
                        const reh = info['reh']['#'];
                        const r06 = info['r06']['#'];
                        const s06 = info['s06']['#'];

                        let newInfo = {
                            time: moment(date)
                                .add(day, 'days')
                                .hours(hour)
                                .format(),
                            temperature: {
                                current: Number(temp),
                                high: tmx == -999 ? null : tmx,
                                min: tmn == -999 ? null : tmn
                            },
                            sky: {
                                code: Number(sky),
                                value: this.parseSkyCode(sky)
                            },
                            rain: {
                                code: Number(pty),
                                value: this.parseRainyProbabilityCode(pty),

                                probability: Number(pop),
                                expect: {
                                    6: {
                                        rainfall: Number(r06),
                                        snowfall: Number(s06)
                                    },
                                    12: {
                                        rainfall: Number(r12),
                                        snowfall: Number(s12)
                                    }
                                }
                            },
                            weather: {
                                value: {ko: wfkor, en: wfen}
                            },
                            wind: {
                                speed: Number(Number(ws).toFixed(2)),
                                direction: {
                                    code: Number(wd),
                                    value: {
                                        ko: wdkor,
                                        en: wden
                                    }
                                }
                            },
                            humidity: Number(reh)
                        };

                        data.info.push(newInfo);
                    });

                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    parseSkyCode(skyCode) {
        switch (skyCode | 0) {
            case 1:
                return '맑음';
            case 2:
                return '구름조금';
            case 3:
                return '구름많음';
            case 4:
                return '흐림';
            default:
                return null;
        }
    }

    parseRainyProbabilityCode(pty) {
        switch (pty | 0) {
            case 0:
                return '없음';
            case 1:
                return '비';
            case 2:
                return '비/눈';
            case 3:
                return '눈/비';
            case 4:
                return '눈';
            default:
                return null;
        }
    }
}

module.exports = new Weather();