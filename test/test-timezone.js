/// <reference path="../typings/test.d.ts" />
var sourcemapsupport = require("source-map-support");

// Enable source-map support for backtraces. Causes TS files & linenumbers to show up in them.
sourcemapsupport.install({ handleUncaughtExceptions: false });

var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;

var datetimeFuncs = require("../lib/index");

var DateFunctions = datetimeFuncs.DateFunctions;
var DateTime = datetimeFuncs.DateTime;

var TimeZone = datetimeFuncs.TimeZone;

// Fake time source
var TestTimeSource = (function () {
    function TestTimeSource() {
        this.currentTime = new Date("2014-01-03T04:05:06.007Z");
    }
    TestTimeSource.prototype.now = function () {
        return this.currentTime;
    };
    return TestTimeSource;
})();

// Insert fake time source so that now() is stable
var testTimeSource = new TestTimeSource();
DateTime.timeSource = testTimeSource;

describe("timezone loose", function () {
    describe("local()", function () {
        it("should create a local time zone", function () {
            var t = datetimeFuncs.local();
            var localOffset = (testTimeSource.now()).getTimezoneOffset();
            expect(t.offsetForZoneDate(testTimeSource.now(), 0 /* Get */)).to.equal(-1 * localOffset);
            expect(t.offsetForUtcDate(testTimeSource.now(), 1 /* GetUTC */)).to.equal(-1 * localOffset);
        });
        it("should cache the time zone objects", function () {
            var t = datetimeFuncs.local();
            var u = datetimeFuncs.local();
            expect(t).to.equal(u);
        });
    });

    describe("utc()", function () {
        it("should create a UTC zone", function () {
            var t = datetimeFuncs.utc();
            expect(t.offsetForZone(2014, 2, 3, 4, 5, 6, 7)).to.equal(0);
            expect(t.offsetForUtc(2014, 2, 3, 4, 5, 6, 7)).to.equal(0);
        });
        it("should cache the time zone objects", function () {
            var t = datetimeFuncs.utc();
            var u = datetimeFuncs.utc();
            expect(t).to.equal(u);
        });
    });

    describe("zone(number)", function () {
        it("should create a time zone for a whole number", function () {
            var t = datetimeFuncs.zone(60);
            expect(t.offsetForZone(2014, 7, 1, 2, 3, 4, 5)).to.equal(60);
            expect(t.offsetForUtc(2014, 7, 1, 2, 3, 4, 5)).to.equal(60);
        });
    });

    describe("zone(string)", function () {
        it("should create a time zone for a positive ISO offset", function () {
            var t = datetimeFuncs.zone("+01:30");
            expect(t.offsetForUtc(2014, 1, 1, 1, 2, 3, 4)).to.equal(90);
        });
    });
});

describe("TimeZone", function () {
    describe("local()", function () {
        it("should create a local time zone", function () {
            var t = TimeZone.local();
            var localOffset = (testTimeSource.now()).getTimezoneOffset();
            expect(t.offsetForZoneDate(testTimeSource.now(), 0 /* Get */)).to.equal(-1 * localOffset);
            expect(t.offsetForUtcDate(testTimeSource.now(), 1 /* GetUTC */)).to.equal(-1 * localOffset);
        });
        it("should cache the time zone objects", function () {
            var t = TimeZone.local();
            var u = TimeZone.local();
            expect(t).to.equal(u);
        });
    });

    describe("utc()", function () {
        it("should create a UTC zone", function () {
            var t = TimeZone.utc();
            expect(t.offsetForZone(2014, 2, 3, 4, 5, 6, 7)).to.equal(0);
            expect(t.offsetForUtc(2014, 2, 3, 4, 5, 6, 7)).to.equal(0);
        });
        it("should cache the time zone objects", function () {
            var t = TimeZone.utc();
            var u = TimeZone.utc();
            expect(t).to.equal(u);
        });
    });

    describe("zone(number)", function () {
        it("should create a time zone for a whole number", function () {
            var t = TimeZone.zone(60);
            expect(t.offsetForZone(2014, 7, 1, 2, 3, 4, 5)).to.equal(60);
            expect(t.offsetForUtc(2014, 7, 1, 2, 3, 4, 5)).to.equal(60);
        });
        it("should create a time zone for a negative number", function () {
            var t = TimeZone.zone(-60);
            expect(t.offsetForZone(2014, 7, 1, 2, 3, 4, 5)).to.equal(-60);
            expect(t.offsetForUtc(2014, 7, 1, 2, 3, 4, 5)).to.equal(-60);
        });
        it("should not handle DST", function () {
            var t = TimeZone.zone(-60);
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(-60);
            expect(t.offsetForZone(2014, 7, 1, 1, 2, 3, 4)).to.equal(-60);
        });
        it("should cache the time zone objects", function () {
            var t = TimeZone.zone(-60);
            var u = TimeZone.zone(-60);
            expect(t).to.equal(u);
        });
        assert.throws(function () {
            TimeZone.zone(-24 * 60);
        }, "zone(number) should throw on out of range offset");
        assert.throws(function () {
            TimeZone.zone(24 * 60);
        }, "zone(number) should throw on out of range offset");
    });

    describe("zone(string)", function () {
        it("should return NULL for an empty string", function () {
            var t = TimeZone.zone("");
            expect(t).to.be.null;
        });
        it("should create a time zone for a positive ISO offset", function () {
            var t = TimeZone.zone("+01:30");
            expect(t.offsetForUtc(2014, 1, 1, 1, 2, 3, 4)).to.equal(90);
        });
        it("should create a time zone for a negative ISO offset", function () {
            var t = TimeZone.zone("-01:30");
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(-90);
        });
        it("should create a time zone for an ISO offset without a colon", function () {
            var t = TimeZone.zone("+0130");
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(90);
        });
        it("should create a time zone for an ISO offset without minutes", function () {
            var t = TimeZone.zone("+01");
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(60);
        });
        it("should create a time zone for Zulu", function () {
            var t = TimeZone.zone("Z");
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(0);
        });
        it("should return a time zone for an IANA time zone string", function () {
            var t = TimeZone.zone("Africa/Asmara");
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(180);
        });
        it("should apply DST by default", function () {
            var t = TimeZone.zone("Europe/Amsterdam");
            expect(t.offsetForZone(2014, 7, 1, 1, 2, 3, 4)).to.equal(120);
        });
        it("should not apply DST if asked", function () {
            var t = TimeZone.zone("Europe/Amsterdam", false);
            expect(t.offsetForZone(2014, 7, 1, 1, 2, 3, 4)).to.equal(60);
        });
        it("should return a time zone for local time", function () {
            var t = TimeZone.zone("localtime");
            expect(t.equals(TimeZone.local())).to.equal(true);
        });
        it("should cache the time zone objects", function () {
            var t = TimeZone.zone("-01:30");
            var u = TimeZone.zone("-01:30");
            expect(t).to.equal(u);
        });
        it("should cache the time zone objects with/without DST separately", function () {
            var t = TimeZone.zone("Europe/Amsterdam", true);
            var u = TimeZone.zone("Europe/Amsterdam", false);
            expect(t).not.to.equal(u);
        });
        it("should cache the time zone objects even when different formats given", function () {
            var t = TimeZone.zone("Z");
            var u = TimeZone.zone("+00:00");
            expect(t).to.equal(u);
        });
        assert.throws(function () {
            TimeZone.zone("+24:00");
        }, "zone(string) should throw on out of range input");
        assert.throws(function () {
            TimeZone.zone("-24:00");
        }, "zone(string) should throw on out of range input");
    });

    describe("offsetForUtc()", function () {
        it("should work for local time", function () {
            var t = TimeZone.local();

            // check DST changes
            var d1 = new Date(2014, 1, 1, 1, 2, 3, 4);
            var d2 = new Date(2014, 7, 1, 1, 2, 3, 4);
            expect(t.offsetForUtc(2014, 1, 1, 1, 2, 3, 4)).to.equal(-1 * d1.getTimezoneOffset());
            expect(t.offsetForUtc(2014, 7, 1, 1, 2, 3, 4)).to.equal(-1 * d2.getTimezoneOffset());
        });
        it("should work for IANA zone", function () {
            var t = TimeZone.zone("America/Edmonton");

            // check DST changes
            expect(t.offsetForUtc(2014, 1, 1, 1, 2, 3, 4)).to.equal(-7 * 60);
            expect(t.offsetForUtc(2014, 7, 1, 1, 2, 3, 4)).to.equal(-6 * 60);
        });
        it("should work for around DST", function () {
            var t = TimeZone.zone("Europe/Amsterdam");
            expect(t.offsetForUtc(2014, 10, 26, 1, 59, 59, 0)).to.equal(60);
        });
        it("should work for IANA zone without DST", function () {
            var t = TimeZone.zone("Europe/Amsterdam", false);
            expect(t.offsetForUtc(2014, 8, 26, 1, 59, 59, 0)).to.equal(60);
        });
        it("should work for fixed offset", function () {
            var t = TimeZone.zone("+0130");

            // check DST changes
            expect(t.offsetForUtc(2014, 1, 1, 1, 2, 3, 4)).to.equal(90);
            expect(t.offsetForUtc(2014, 7, 1, 1, 2, 3, 4)).to.equal(90);
        });
        it("should work if time not given", function () {
            var t = TimeZone.zone("+0130");
            expect(t.offsetForUtc(2014, 1, 1)).to.equal(90);
        });
    });

    describe("offsetForUtcDate()", function () {
        it("should with Get", function () {
            var t = TimeZone.zone("Europe/Amsterdam");
            var d = new Date(2014, 2, 26, 3, 0, 1, 0);
            expect(t.offsetForUtcDate(d, 0 /* Get */)).to.equal(t.offsetForUtc(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
        });
        it("should with GetUtc", function () {
            var t = TimeZone.zone("Europe/Amsterdam");
            var d = new Date(2014, 2, 26, 3, 0, 1, 0);
            expect(t.offsetForUtcDate(d, 1 /* GetUTC */)).to.equal(t.offsetForUtc(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()));
        });
    });

    describe("offsetForZone()", function () {
        it("should work for local time", function () {
            var t = TimeZone.local();

            // check DST changes
            var d1 = new Date(2014, 1, 1, 1, 2, 3, 4);
            var d2 = new Date(2014, 7, 1, 1, 2, 3, 4);
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(-1 * d1.getTimezoneOffset());
            expect(t.offsetForZone(2014, 7, 1, 1, 2, 3, 4)).to.equal(-1 * d2.getTimezoneOffset());
        });
        it("should work for IANA zone", function () {
            var t = TimeZone.zone("America/Edmonton");

            // check DST changes
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(-7 * 60);
            expect(t.offsetForZone(2014, 7, 1, 1, 2, 3, 4)).to.equal(-6 * 60);
        });
        it("should work for IANA zone wihtout DST", function () {
            var t = TimeZone.zone("America/Edmonton", false);

            // check DST changes
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(-7 * 60);
            expect(t.offsetForZone(2014, 7, 1, 1, 2, 3, 4)).to.equal(-7 * 60);
        });

        it("should work for non-existing DST forward time", function () {
            var t = TimeZone.zone("America/Edmonton");

            // check DST changes
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(-7 * 60);
            expect(t.offsetForZone(2014, 7, 1, 1, 2, 3, 4)).to.equal(-6 * 60);
            t = TimeZone.zone("Europe/Amsterdam");

            // non-existing europe/amsterdam date due to DST, should be processed as if rounded up to existing time
            expect(t.offsetForZone(2014, 3, 30, 2, 0, 0, 0)).to.equal(2 * 60);
        });
        it("should work for fixed offset", function () {
            var t = TimeZone.zone("+0130");

            // check DST changes
            expect(t.offsetForZone(2014, 1, 1, 1, 2, 3, 4)).to.equal(90);
            expect(t.offsetForZone(2014, 7, 1, 1, 2, 3, 4)).to.equal(90);
        });
        it("should work if time not given", function () {
            var t = TimeZone.zone("+0130");
            expect(t.offsetForZone(2014, 1, 1)).to.equal(90);
        });
    });

    describe("offsetForZoneDate()", function () {
        it("should with Get", function () {
            var t = TimeZone.zone("Europe/Amsterdam");
            var d = new Date(2014, 2, 26, 3, 0, 1, 0);
            expect(t.offsetForZoneDate(d, 0 /* Get */)).to.equal(t.offsetForZone(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
        });
        it("should with GetUtc", function () {
            var t = TimeZone.zone("Europe/Amsterdam");
            var d = new Date(2014, 2, 26, 3, 0, 1, 0);
            expect(t.offsetForZoneDate(d, 1 /* GetUTC */)).to.equal(t.offsetForZone(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds()));
        });
    });

    describe("equals()", function () {
        it("should handle local zone", function () {
            expect(TimeZone.local().equals(TimeZone.local())).to.equal(true);
            expect(TimeZone.local().equals(TimeZone.zone("localtime"))).to.equal(true);
            expect(TimeZone.local().equals(TimeZone.zone("localtime", false))).to.equal(true);
            expect(TimeZone.local().equals(TimeZone.utc())).to.equal(false);
            expect(TimeZone.local().equals(TimeZone.zone(6))).to.equal(false);
        });
        it("should handle offset zone", function () {
            expect(TimeZone.zone(3).equals(TimeZone.zone(3))).to.equal(true);
            expect(TimeZone.zone(3).equals(TimeZone.utc())).to.equal(false);
            expect(TimeZone.zone(3).equals(TimeZone.local())).to.equal(false);
            expect(TimeZone.zone(3).equals(TimeZone.zone(-1))).to.equal(false);
            expect(TimeZone.zone("+03:00", false).equals(TimeZone.zone("+03:00", true))).to.equal(true);
            expect(TimeZone.zone("+03:00", false).equals(TimeZone.zone(180))).to.equal(true);
        });
        it("should handle proper zone", function () {
            expect(TimeZone.zone("Europe/Amsterdam").equals(TimeZone.zone("Europe/Amsterdam"))).to.equal(true);
            expect(TimeZone.zone("Europe/Amsterdam", false).equals(TimeZone.zone("Europe/Amsterdam", false))).to.equal(true);
            expect(TimeZone.zone("Europe/Amsterdam", true).equals(TimeZone.zone("Europe/Amsterdam", false))).to.equal(false);
            expect(TimeZone.zone("Europe/Amsterdam").equals(TimeZone.utc())).to.equal(false);
            expect(TimeZone.zone("Europe/Amsterdam").equals(TimeZone.local())).to.equal(false);
            expect(TimeZone.zone("Europe/Amsterdam").equals(TimeZone.zone(-1))).to.equal(false);
        });
        it("should handle UTC in different forms", function () {
            expect(TimeZone.utc().equals(TimeZone.zone("GMT"))).to.equal(true);
            expect(TimeZone.utc().equals(TimeZone.zone("UTC"))).to.equal(true);
            expect(TimeZone.utc().equals(TimeZone.zone(0))).to.equal(true);
        });
    });

    describe("identical()", function () {
        it("should handle local zone", function () {
            expect(TimeZone.local().identical(TimeZone.local())).to.equal(true);
            expect(TimeZone.local().identical(TimeZone.zone("localtime"))).to.equal(true);
            expect(TimeZone.local().identical(TimeZone.zone("localtime", false))).to.equal(true);
            expect(TimeZone.local().identical(TimeZone.utc())).to.equal(false);
            expect(TimeZone.local().identical(TimeZone.zone(6))).to.equal(false);
        });
        it("should handle offset zone", function () {
            expect(TimeZone.zone(3).identical(TimeZone.zone(3))).to.equal(true);
            expect(TimeZone.zone(3).identical(TimeZone.utc())).to.equal(false);
            expect(TimeZone.zone(3).identical(TimeZone.local())).to.equal(false);
            expect(TimeZone.zone(3).identical(TimeZone.zone(-1))).to.equal(false);
            expect(TimeZone.zone("+03:00", false).identical(TimeZone.zone("+03:00", true))).to.equal(true);
            expect(TimeZone.zone("+03:00", false).identical(TimeZone.zone(180))).to.equal(true);
        });
        it("should handle proper zone", function () {
            expect(TimeZone.zone("Europe/Amsterdam").identical(TimeZone.zone("Europe/Amsterdam"))).to.equal(true);
            expect(TimeZone.zone("Europe/Amsterdam", false).identical(TimeZone.zone("Europe/Amsterdam", false))).to.equal(true);
            expect(TimeZone.zone("Europe/Amsterdam", true).identical(TimeZone.zone("Europe/Amsterdam", false))).to.equal(false);
            expect(TimeZone.zone("Europe/Amsterdam").identical(TimeZone.utc())).to.equal(false);
            expect(TimeZone.zone("Europe/Amsterdam").identical(TimeZone.local())).to.equal(false);
            expect(TimeZone.zone("Europe/Amsterdam").identical(TimeZone.zone(-1))).to.equal(false);
        });
        it("should handle UTC in different forms", function () {
            expect(TimeZone.zone("UTC").identical(TimeZone.zone("GMT"))).to.equal(false);
            expect(TimeZone.utc().identical(TimeZone.zone(0))).to.equal(false);
        });
    });

    describe("inspect()", function () {
        it("should work", function () {
            expect(TimeZone.zone("Europe/Amsterdam").inspect()).to.equal("[TimeZone: Europe/Amsterdam]");
        });
    });

    describe("stringToOffset()", function () {
        it("should work for Z", function () {
            expect(TimeZone.stringToOffset("Z")).to.equal(0);
            expect(TimeZone.stringToOffset("+00:00")).to.equal(0);
            expect(TimeZone.stringToOffset("-01:30")).to.equal(-90);
            expect(TimeZone.stringToOffset("-01")).to.equal(-60);
        });
    });

    describe("dst()", function () {
        it("should work", function () {
            expect(TimeZone.zone("Europe/Amsterdam", true).dst()).to.equal(true);
            expect(TimeZone.zone("Europe/Amsterdam", false).dst()).to.equal(false);
        });
    });

    describe("hasDst()", function () {
        it("should work for local timezone", function () {
            expect(TimeZone.local().hasDst()).to.equal(false);
        });
        it("should work for offset timezone", function () {
            expect(TimeZone.zone(3).hasDst()).to.equal(false);
        });
        it("should work for named zone without DST", function () {
            expect(TimeZone.zone("UTC").hasDst()).to.equal(false);
        });
        it("should work for named zone with DST", function () {
            expect(TimeZone.zone("Europe/Amsterdam").hasDst()).to.equal(true);
        });
    });

    describe("abbreviationForUtc()", function () {
        it("should work for local timezone", function () {
            expect(TimeZone.local().abbreviationForUtc(2014, 1, 1)).to.equal("local");
        });
        it("should work for offset timezone", function () {
            expect(TimeZone.zone(3).abbreviationForUtc(2014, 1, 1)).to.equal(TimeZone.zone(3).toString());
        });
        it("should work for named zone without DST", function () {
            expect(TimeZone.zone("UTC").abbreviationForUtc(2014, 1, 1)).to.equal("UTC");
        });
        it("should work for named zone with DST", function () {
            // note that the underlying functionality is fully tested in test-tz-database
            expect(TimeZone.zone("Europe/Amsterdam").abbreviationForUtc(2014, 7, 1)).to.equal("CEST");
        });
    });

    describe("toString()", function () {
        it("should append 'no dst' for iana zone with false DST flag", function () {
            expect(TimeZone.zone("Europe/Amsterdam", false).toString()).to.equal("Europe/Amsterdam without DST");
        });
        it("should not append 'no dst' for iana zone with true DST flag", function () {
            expect(TimeZone.zone("Europe/Amsterdam", true).toString()).to.equal("Europe/Amsterdam");
        });
        it("should not append 'no dst' for iana zone that never has DST", function () {
            expect(TimeZone.zone("Etc/GMT", false).toString()).to.equal("Etc/GMT");
        });
        it("should not append 'no dst' for fixed offset", function () {
            expect(TimeZone.zone("+01:00", false).toString()).to.equal("+01:00");
        });
    });
});
//# sourceMappingURL=test-timezone.js.map
