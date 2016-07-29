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

module.exports = GeoLocation;