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

const GeoLocation = function () {
};

/**
 * 위,경도로 현재 좌표에 대한
 * 주소 정보를 콜백으로 전달한다
 *
 * @param latitude
 * @param longitude
 */
GeoLocation.prototype.getAddress = function (latitude, longitude) {
    return new Promise((resolve, reject) => {
        const apiUrl = util.format(MAPS_API_URL, latitude, longitude);
        const options = {
            url: apiUrl,
            headers: {
                'Accept-Language': 'ko'
            }
        };

        request(options, function (error, response) {
            if (error) return reject(error);

            if (response.statusCode == 200) {
                try {
                    const body = JSON.parse(response.body);
                    const results = body.results;

                    return resolve(results);
                } catch (e) {
                    return reject(e);
                }
            } else {
                return reject({message: response.statusMessage})
            }
        });
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
        let error, address;
        let data = {
            country: null,
            administrative_area_level_1: null,
            locality: null,
            sublocality_level_1: null,
            sublocality_level_2: null,
            sublocality_level_3: null
        };

        for (let i = 0; i < results.length; i++) {
            const types = results[i].types;
            if (types.includes('political') && types.includes('sublocality_level_2')) {
                address = results[i];
                break;
            }
        }

        if (!address) {
            error = {
                title: '주소 데이터를 가져올 수 없습니다',
                message: '주소 데이터가 검색된 좌표 데이터에 존재 하지 않습니다.'
            }
        }

        // 에러가 없으면 데이터를 파싱한다
        if (!error) {
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

module.exports = new GeoLocation();