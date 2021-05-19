"use strict";

const assert = require("chai").assert;
const PoiService = require("./poi-service");
const fixtures = require("./fixtures.json");
const _ = require('lodash');

suite("Candidate API tests", function () {
    let pois = fixtures.pois;
    let newPoi = fixtures.newPoi;

    const poiService = new PoiService("http://localhost:3000");

    setup(async function () {
        await poiService.deleteAllPois();
    });

    teardown(async function () {
        await poiService.deleteAllPois();
    });

    test("create a poi", async function () {
        const returnedPoi = await poiService.createPoi(newPoi);
        assert(_.some([returnedPoi], newPoi), "returnedPoi must be a superset of newPoi");
        assert.isDefined(returnedPoi._id);
    });

    test("delete a poi", async function () {
        let c = await poiService.createPoi(newPoi);
        assert(c._id != null);
        await poiService.deleteOnePoi(c._id);
        c = await poiService.getPoi(c._id);
        assert(c == null);
    });

    test("get poi", async function () {
        const c1 = await poiService.createPoi(newPoi);
        const c2 = await poiService.getPoi(c1._id);
        assert.deepEqual(c1, c2);
    });

    test("get invalid poi", async function () {
        const c1 = await poiService.getPoi("1234");
        assert.isNull(c1);
        const c2 = await poiService.getPoi("012345678901234567890123");
        assert.isNull(c2);
    });

    test("get all pois", async function () {
        for (let p of pois) {
            await poiService.createPoi(p);
        }

        const allPois = await poiService.getPois();
        assert.equal(allPois.length, pois.length);
    });

    test("get pois detail", async function () {
        for (let p of pois) {
            await poiService.createPoi(p);
        }

        const allPois = await poiService.getPois();
        for (var i = 0; i < pois.length; i++) {
            assert(_.some([allPois[i]], pois[i]), "returnedCandidate must be a superset of newCandidate");
        }
    });

    test("get all pois empty", async function () {
        const allPois = await poiService.getPois();
        assert.equal(allPois.length, 0);
    });
});