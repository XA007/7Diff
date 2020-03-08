import {ElementRef} from "@angular/core";
import { MouseClickDirective } from "./mouse-click.directive";

describe("MouseClickDirective", () => {
  it("should create an instance", () => {

    const el: ElementRef = new ElementRef("");
    const directive: MouseClickDirective = new MouseClickDirective(el);
    expect(directive).toBeTruthy();
  });
});
