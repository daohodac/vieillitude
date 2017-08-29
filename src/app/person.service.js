"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var mock_persons_1 = require("./mock-persons");
var PersonService = (function () {
    function PersonService() {
    }
    PersonService.prototype.getPersons = function () {
        return mock_persons_1.PERSONS;
    };
    return PersonService;
}());
PersonService = __decorate([
    core_1.Injectable()
], PersonService);
exports.PersonService = PersonService;
//# sourceMappingURL=person.service.js.map