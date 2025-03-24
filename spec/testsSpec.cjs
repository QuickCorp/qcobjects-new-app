#!/usr/bin/env node

const QCObjects = require('qcobjects');

const { Class, ClassFactory, New, Logger } = QCObjects;
const logger = new Logger();

describe("QCObjects Main Test", function () {

  it("Class Declaration Test Spec", function () {
    const Main = Class("Main", Object, {});
    expect(Main).toEqual(ClassFactory("Main"));
    logger.debug("Class Declaration Test Spec... OK");
  });

  it("Main intance Test Spec", function () {
    const Main = Class("Main", Object, {});
    const __main__ = New(Main, {});
    expect(typeof __main__.__instanceID).toEqual("number");
    expect(__main__ instanceof Main).toBe(true);
    logger.debug("Main intance Test Spec... OK");
  });

  it("Existence of Component Class", function () {
    expect(Component).toEqual(ClassFactory("Component"));
    logger.debug("Existence of Component Class... OK");
  });

  it("Existence of Effect Class", function () {
    expect(Effect).toBeDefined();
    expect(Effect).toEqual(ClassFactory("Effect"));
    logger.debug("Existence of Effect Class... OK");
  });

  it("global as QCObjects global", function () {
    expect(typeof global.__definition).toEqual("object");
    logger.debug("global as QCObjects global... OK");
  });

  it("Existence of QCObjects SDK", function () {
    expect(Object.hasOwnProperty.call(global, "_sdk_")).toEqual(true);
    logger.debug("Existence of QCObjects SDK... OK");
  });

  it('has Class defined', function () {
    expect(Class).toBeDefined();
  });

  it('has ClassFactory defined', function () {
    expect(ClassFactory).toBeDefined();
  });

  it('has New defined', function () {
    expect(New).toBeDefined();
  });
});
