/**
 * Created by GwonHyeok on 2016. 7. 30..
 */

const GeoLocation = require('../lib/geolocation');

describe('GeoLocation', function () {
    describe('좌표로 주소 정보를 받아옴', function () {
        let address;

        it('오류 없이 좌표 정보로 주소를 받아와야 한다', function (done) {
            GeoLocation.getAddress('37.49543016888596', '127.03781811461468')
                .then(result => {
                    address = result;
                    done()
                })
                .catch(error=> done(error));
        });

        it('받아온 주소 데이터를 가지고 가장 가까운 위치의 주소 정보를 가져온다', (done) => {
            GeoLocation.getRatedAddress(address)
                .then(data =>done())
                .catch(error => done(error))
        });
    });
});