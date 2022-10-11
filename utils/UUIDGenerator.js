"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuidV5 = require('uuid/v5');
var crypto = require('crypto');
var UUIDGenerator = /** @class */ (function () {
    function UUIDGenerator() {
        //uuid v5 https://spacemanagement.com URL
        this.namespaceUUID = "bbcc6f41-7256-54e4-a171-ee0475d3f37b";
    }
    UUIDGenerator.prototype.generateUUID = function (str) {
        var sha1Str = this.generateSHA1(str);
        return uuidV5(sha1Str, this.namespaceUUID);
    };
    UUIDGenerator.prototype.generateSHA1 = function (strToHash) {
        return crypto.createHash('sha1').update(strToHash).digest('hex');
    };
    return UUIDGenerator;
}());
exports.UUIDGenerator = UUIDGenerator;
