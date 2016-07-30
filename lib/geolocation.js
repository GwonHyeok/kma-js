/**
 * Reverse GeoLocation (위도, 경도)를 가지고 주소로 변경
 * Google Maps API 사용
 *
 * Created by GwonHyeok on 2016. 7. 30..
 */

'use strict';
const util = require('util');
const request = require('request');

/**
 * 1. %s    latitude
 * 2. %s    longitude
 *
 * @type {string}
 */
const MAPS_API_URL = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=%s,%s&sensor=false';

const GeoLocation = function (latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
};

/**
 * 인스턴스화 할때 입력한 위,경도로 현재 좌표에 대한
 * 주소 정보를 콜백으로 전달한다
 *
 * @param callback
 */
GeoLocation.prototype.getAddress = function (callback) {
    const apiUrl = util.format(MAPS_API_URL, this.latitude, this.longitude);
    const options = {
        url: apiUrl,
        headers: {
            'Accept-Language': 'ko'
        }
    };

    request(options, function (error, response) {
        if (error) return callback(error);

        if (response.statusCode == 200) {
            try {
                const body = JSON.parse(response.body);
                const results = body.results;

                return callback(null, results);
            } catch (e) {
                return callback(e);
            }
        } else {
            return callback({message: response.statusMessage})
        }
    });
};

/**
 * 좌표를 주소로 변환한 결과 리스트를 가지고
 * 현재 좌표와 가장 가까운 주소 데이터를 가져온다
 *
 * country, locality, sublocality_level_1, sublocality_level_2
 * @param results
 */
GeoLocation.prototype.getRatedAddress = function (results) {
    return new Promise((resolve, reject) => {
        let error;
        let data = {
            country: null,
            administrative_area_level_1: null,
            locality: null,
            sublocality_level_1: null,
            sublocality_level_2: null,
            sublocality_level_3: null
        };

        if (results.length <= 0) {
            error = {
                title: '주소 데이터를 가져올 수 없습니다',
                message: '결과 데이터의 크기가 0 보다 작습니다'
            }
        }

        // 에러가 없으면 데이터를 파싱한다
        if (!error) {
            const address = results[0];
            const address_components = address.address_components;

            address_components.forEach(component => {
                const types = component.types;

                Object.keys(data).forEach(key => {
                    if (types.includes(key)) {
                        data[key] = component.long_name;
                    }
                });

            });
        }

        if (error) return reject(error);
        resolve(data);
    });
};

module.exports = GeoLocation;