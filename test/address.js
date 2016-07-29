/**
 * Created by GwonHyeok on 2016. 7. 30..
 */

const GeoLocation = require('../lib/geolocation');

describe('GeoLocation', function () {
    describe('좌표로 주소 정보를 받아옴', function () {

        it('오류 없이 좌표 정보로 주소를 받아와야 한다', function (done) {
            const location = new GeoLocation('37.49543016888596', '127.03781811461468');
            location.getAddress(function (error, result) {
                done(error);
            });
        })

    })
});