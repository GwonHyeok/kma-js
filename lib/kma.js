/**
 * Created by GwonHyeok on 2016. 7. 30..
 */
'use strict';
const geoLocation = require('../lib/geolocation')
    , request = require('request');

class KMA {

    /**
     * 위, 경도 데이터를 가지고 kma 에서 사용하는 bcode 로 변환해서 받아온다
     *
     * @param latitude
     * @param longitude
     */
    convertBcode(latitude, longitude) {
        return new Promise((resolve, reject) => {
            geoLocation.getAddress(latitude, longitude)
                .then(addressList => {
                    return geoLocation.getRatedAddress(addressList)
                })
                .then(address => {
                    return this.convert(address)
                })
                .then(bcode => resolve(bcode))
                .catch(error => reject(error));
        });
    }

    /**
     *
     * @param address
     * @returns {Promise}
     */
    convert(address) {
        return new Promise((resolve, reject) => {
            let top, mid, leaf;

            // 주소 데이터를 kma 의 bcode 데이터와 비교할 수 있도록 변경
            top = address.administrative_area_level_1 || address.locality;
            mid = address.administrative_area_level_1 ? address.locality : address.sublocality_level_1;
            leaf = address.administrative_area_level_1 ? address.sublocality_level_2 : address.sublocality_level_2;

            this.getTopCode(top)
                .then(topCode => {
                    return this.getMidCode(topCode, mid);
                })
                .then(midCode => {
                    return this.getLeafCode(midCode, leaf);
                })
                .then(bCode => resolve(bCode))
                .catch(error => reject(error));
        });
    }

    getTopCode(top) {
        return this.bCodeKmaRequest(`http://www.kma.go.kr/DFSROOT/POINT/DATA/top.json.txt`, top);
    }

    getMidCode(topCode, mid) {
        return this.bCodeKmaRequest(`http://www.kma.go.kr/DFSROOT/POINT/DATA/mdl.${topCode}.json.txt`, mid);
    }

    getLeafCode(midCode, leaf) {
        return this.bCodeKmaRequest(`http://www.kma.go.kr/DFSROOT/POINT/DATA/leaf.${midCode}.json.txt`, leaf);
    }

    bCodeKmaRequest(url, codeValue) {
        return new Promise((resolve, reject) => {
            request(url, (err, response) => {
                if (err) return reject(err);
                if (response.statusCode == 200) {
                    try {
                        const body = JSON.parse(response.body);
                        body.forEach(bodyData => {
                            if (bodyData.value == codeValue) resolve(bodyData.code);
                        });

                        return reject({
                            title: 'bcode 데이터를 가져올 수 없습니다',
                            message: `찾으려고 하는 ${codeValue} 정보는 kma 지역 리스트에 존재 하지 않습니다.`,
                            link: url
                        })
                    } catch (e) {
                        return reject(e);
                    }
                } else {
                    reject()
                }
            });
        })
    }
}

module.exports = new KMA();