"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var person_1 = require("./person");
var YEARS = [
    2002, 2003, 2004, 2005, 2006, 2007
];
var PersonComponent = (function () {
    function PersonComponent() {
        this.years = YEARS;
    }
    return PersonComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", person_1.Person)
], PersonComponent.prototype, "person", void 0);
PersonComponent = __decorate([
    core_1.Component({
        selector: 'person',
        template: "\n    <div *ngIf=\"person\">\n\t\t\t<span class=\"badge\">{{person.familly}}</span> {{person.name}}\n      <span *ngFor=\"let y of years\">{{y}}</span>\n    </div>\n  "
    })
], PersonComponent);
exports.PersonComponent = PersonComponent;
//# sourceMappingURL=person.component.js.map