/// <reference path="../typings/test.d.ts" />
var sourcemapsupport = require("source-map-support");
// Enable source-map support for backtraces. Causes TS files & linenumbers to show up in them.
sourcemapsupport.install({ handleUncaughtExceptions: false });
var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var format = require("../lib/format");
var timeZone = require("../lib/timezone");
var basics = require("../lib/basics");
/*
 * Dummy implementation of a DateTimeAccess class, for testing the format
 */
describe("format", function () {
    var dateTime;
    var utcTime;
    var localZone;
    beforeEach(function () {
        dateTime = new basics.TimeStruct();
    });
    describe("identity", function () {
        it("should return the raw contents", function () {
            dateTime.year = 18;
            var result = format.format(dateTime, utcTime, localZone, "'abcdefghijklmnopqrstuvwxyz'");
            expect(result).to.equal("abcdefghijklmnopqrstuvwxyz");
        });
    });
    describe("formatEra", function () {
        it("should return BC for years > 0", function () {
            dateTime.year = -1;
            var result = format.format(dateTime, utcTime, localZone, "G");
            expect(result).to.equal("BC");
        });
        it("should return AD for years < 0", function () {
            dateTime.year = 1;
            var result = format.format(dateTime, utcTime, localZone, "G");
            expect(result).to.equal("AD");
        });
        it("should return Before Christ for years > 0", function () {
            dateTime.year = -1;
            var result = format.format(dateTime, utcTime, localZone, "GGGG");
            expect(result).to.equal("Before Christ");
        });
        it("should return Anno Domini for years < 0", function () {
            dateTime.year = 1;
            var result = format.format(dateTime, utcTime, localZone, "GGGG");
            expect(result).to.equal("Anno Domini");
        });
        it("should return B for years > 0", function () {
            dateTime.year = -1;
            var result = format.format(dateTime, utcTime, localZone, "GGGGG");
            expect(result).to.equal("B");
        });
        it("should return A for years < 0", function () {
            dateTime.year = 1;
            var result = format.format(dateTime, utcTime, localZone, "GGGGG");
            expect(result).to.equal("A");
        });
        it("should throw if the token is too long", function () {
            dateTime.year = -1;
            assert.throws(function () { format.format(dateTime, utcTime, localZone, "GGGGGG"); });
        });
    });
    describe("formatYear", function () {
        it("should return at least one digit year for y", function () {
            dateTime.year = 123;
            var result = format.format(dateTime, utcTime, localZone, "y");
            expect(result).to.equal("123");
        });
        it("should return at least two digit year for yy", function () {
            dateTime.year = 3;
            var result = format.format(dateTime, utcTime, localZone, "yy");
            expect(result).to.equal("03");
        });
        it("should return exactly two digit year for yy", function () {
            dateTime.year = 1997;
            var result = format.format(dateTime, utcTime, localZone, "yy");
            expect(result).to.equal("97");
        });
        it("should pad to four digit year for yyyy", function () {
            dateTime.year = 123;
            var result = format.format(dateTime, utcTime, localZone, "yyyy");
            expect(result).to.equal("0123");
        });
        it("should return at least four digit year for yyyy", function () {
            dateTime.year = 12345;
            var result = format.format(dateTime, utcTime, localZone, "yyyy");
            expect(result).to.equal("12345");
        });
    });
    describe("formatQuarter", function () {
        it("should return the numerical value of the quarter of q", function () {
            dateTime.month = 1;
            var result = format.format(dateTime, utcTime, localZone, "q");
            expect(result).to.equal("01");
        });
        it("should return the numerical value of the quarter of qq", function () {
            dateTime.month = 3;
            var result = format.format(dateTime, utcTime, localZone, "qq");
            expect(result).to.equal("01");
        });
        it("should return the short value of the quarter of qqq", function () {
            dateTime.month = 4;
            var result = format.format(dateTime, utcTime, localZone, "qqq");
            expect(result).to.equal("Q2");
        });
        it("should return the long value of the quarter of qqqq", function () {
            dateTime.month = 12;
            var result = format.format(dateTime, utcTime, localZone, "qqqq");
            expect(result).to.equal("4th quarter");
        });
        it("should return only the number of the quarter of qqqq", function () {
            dateTime.month = 9;
            var result = format.format(dateTime, utcTime, localZone, "qqqqq");
            expect(result).to.equal("3");
        });
        it("should throw if the token is too long", function () {
            dateTime.month = 5;
            assert.throws(function () { format.format(dateTime, utcTime, localZone, "qqqqqq"); });
        });
    });
    describe("formatMonth", function () {
        it("should return just the number of the month for M", function () {
            dateTime.month = 9;
            var result = format.format(dateTime, utcTime, localZone, "M");
            expect(result).to.equal("9");
        });
        it("should return just the number of the month for M", function () {
            dateTime.month = 11;
            var result = format.format(dateTime, utcTime, localZone, "M");
            expect(result).to.equal("11");
        });
        it("should return just the number of the month for MM, padded to two characters", function () {
            dateTime.month = 3;
            var result = format.format(dateTime, utcTime, localZone, "MM");
            expect(result).to.equal("03");
        });
        it("should return the shortened name of the month with MMM", function () {
            dateTime.month = 8;
            var result = format.format(dateTime, utcTime, localZone, "MMM");
            expect(result).to.equal("Aug");
        });
        it("should return the full name of the month with MMMM", function () {
            dateTime.month = 2;
            var result = format.format(dateTime, utcTime, localZone, "MMMM");
            expect(result).to.equal("February");
        });
        it("should return the narrow name of the month with MMMMM", function () {
            dateTime.month = 11;
            var result = format.format(dateTime, utcTime, localZone, "MMMMM");
            expect(result).to.equal("N");
        });
        it("should throw if the token is too long", function () {
            dateTime.month = 1;
            assert.throws(function () { format.format(dateTime, utcTime, localZone, "MMMMMM"); });
        });
    });
    describe("formatWeek", function () {
        it("should format the week number with w", function () {
            dateTime.year = 2014;
            dateTime.month = 1;
            dateTime.day = 4;
            var result = format.format(dateTime, utcTime, localZone, "w");
            expect(result).to.equal("1");
        });
        it("should format the week number with w", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 17;
            var result = format.format(dateTime, utcTime, localZone, "w");
            expect(result).to.equal("33");
        });
        it("should format the week number with ww", function () {
            dateTime.year = 2014;
            dateTime.month = 1;
            dateTime.day = 4;
            var result = format.format(dateTime, utcTime, localZone, "ww");
            expect(result).to.equal("01");
        });
        it("should format the week number with ww", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 17;
            var result = format.format(dateTime, utcTime, localZone, "ww");
            expect(result).to.equal("33");
        });
        it("should format the month week number with W", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 17;
            var result = format.format(dateTime, utcTime, localZone, "W");
            expect(result).to.equal("2");
        });
    });
    describe("formatDay", function () {
        it("should return the number of the day with d", function () {
            dateTime.day = 8;
            var result = format.format(dateTime, utcTime, localZone, "d");
            expect(result).to.equal("8");
        });
        it("should return the number of the day with d", function () {
            dateTime.day = 25;
            var result = format.format(dateTime, utcTime, localZone, "d");
            expect(result).to.equal("25");
        });
        it("should return the number of the day with dd, padded to two characters", function () {
            dateTime.day = 6;
            var result = format.format(dateTime, utcTime, localZone, "dd");
            expect(result).to.equal("06");
        });
        it("should return the day of the year with D", function () {
            dateTime.year = 2014;
            dateTime.month = 2;
            dateTime.day = 1;
            var result = format.format(dateTime, utcTime, localZone, "D");
            expect(result).to.equal("32");
        });
        it("should return the day of the year with DD", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 17;
            var result = format.format(dateTime, utcTime, localZone, "DD");
            expect(result).to.equal("229");
        });
    });
    describe("formatWeekday", function () {
        it("should return the abbreviated name for E", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 16;
            var result = format.format(dateTime, utcTime, localZone, "E");
            expect(result).to.equal("Sat");
        });
        it("should return the abbreviated name for EE", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 21;
            var result = format.format(dateTime, utcTime, localZone, "EE");
            expect(result).to.equal("Thu");
        });
        it("should return the abbreviated name for EEE", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 18;
            var result = format.format(dateTime, utcTime, localZone, "EEE");
            expect(result).to.equal("Mon");
        });
        it("should return the full name for EEEE", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 20;
            var result = format.format(dateTime, utcTime, localZone, "EEEE");
            expect(result).to.equal("Wednesday");
        });
        it("should return the narrow name for EEEEE", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 15;
            var result = format.format(dateTime, utcTime, localZone, "EEEEE");
            expect(result).to.equal("F");
        });
        it("should return the short name for EEEEEE", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 17;
            var result = format.format(dateTime, utcTime, localZone, "EEEEEE");
            expect(result).to.equal("Su");
        });
        it("should return the weekday number for e", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 19;
            var result = format.format(dateTime, utcTime, localZone, "e");
            expect(result).to.equal("2");
        });
        it("should throw if the token is too long", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 19;
            assert.throws(function () { format.format(dateTime, utcTime, localZone, "EEEEEEE"); });
        });
    });
    describe("formatDayPeriod", function () {
        it("should return AM for the morning", function () {
            dateTime.hour = 11;
            var result = format.format(dateTime, utcTime, localZone, "a");
            expect(result).to.equal("AM");
        });
        it("should return PM for the afternoon", function () {
            dateTime.hour = 23;
            var result = format.format(dateTime, utcTime, localZone, "a");
            expect(result).to.equal("PM");
        });
    });
    describe("formatHour", function () {
        it("should return 1-12 hour period for format h", function () {
            dateTime.hour = 0;
            var result = format.format(dateTime, utcTime, localZone, "h");
            expect(result).to.equal("12");
        });
        it("should return 1-12 hour period for format h", function () {
            dateTime.hour = 22;
            var result = format.format(dateTime, utcTime, localZone, "h");
            expect(result).to.equal("10");
        });
        it("should return 1-12 hour period for format hh, padding to two characters", function () {
            dateTime.hour = 1;
            var result = format.format(dateTime, utcTime, localZone, "hh");
            expect(result).to.equal("01");
        });
        it("should return 1-12 hour period for format hh", function () {
            dateTime.hour = 20;
            var result = format.format(dateTime, utcTime, localZone, "hh");
            expect(result).to.equal("08");
        });
        it("should return 0-11 hour period for format K", function () {
            dateTime.hour = 0;
            var result = format.format(dateTime, utcTime, localZone, "K");
            expect(result).to.equal("0");
        });
        it("should return 0-11 hour period for format K", function () {
            dateTime.hour = 22;
            var result = format.format(dateTime, utcTime, localZone, "K");
            expect(result).to.equal("10");
        });
        it("should return 0-11 hour period for format KK, padding to two characters", function () {
            dateTime.hour = 1;
            var result = format.format(dateTime, utcTime, localZone, "KK");
            expect(result).to.equal("01");
        });
        it("should return 0-11 hour period for format KK", function () {
            dateTime.hour = 20;
            var result = format.format(dateTime, utcTime, localZone, "KK");
            expect(result).to.equal("08");
        });
        it("should return 1-24 hour period for format k", function () {
            dateTime.hour = 0;
            var result = format.format(dateTime, utcTime, localZone, "k");
            expect(result).to.equal("24");
        });
        it("should return 1-24 hour period for format k", function () {
            dateTime.hour = 22;
            var result = format.format(dateTime, utcTime, localZone, "k");
            expect(result).to.equal("22");
        });
        it("should return 1-24 hour period for format kk, padding to two characters", function () {
            dateTime.hour = 1;
            var result = format.format(dateTime, utcTime, localZone, "kk");
            expect(result).to.equal("01");
        });
        it("should return 1-24 hour period for format kk", function () {
            dateTime.hour = 20;
            var result = format.format(dateTime, utcTime, localZone, "kk");
            expect(result).to.equal("20");
        });
        it("should return 0-23 hour period for format H", function () {
            dateTime.hour = 0;
            var result = format.format(dateTime, utcTime, localZone, "H");
            expect(result).to.equal("0");
        });
        it("should return 0-23 hour period for format H", function () {
            dateTime.hour = 22;
            var result = format.format(dateTime, utcTime, localZone, "H");
            expect(result).to.equal("22");
        });
        it("should return 0-23 hour period for format HH, padding to two characters", function () {
            dateTime.hour = 1;
            var result = format.format(dateTime, utcTime, localZone, "HH");
            expect(result).to.equal("01");
        });
        it("should return 0-23 hour period for format HH", function () {
            dateTime.hour = 20;
            var result = format.format(dateTime, utcTime, localZone, "HH");
            expect(result).to.equal("20");
        });
    });
    describe("formatMinute", function () {
        it("should format minutes for format m", function () {
            dateTime.minute = 5;
            var result = format.format(dateTime, utcTime, localZone, "m");
            expect(result).to.equal("5");
        });
        it("should format minutes for format m", function () {
            dateTime.minute = 38;
            var result = format.format(dateTime, utcTime, localZone, "m");
            expect(result).to.equal("38");
        });
        it("should format minutes for format mm, padding to two characters", function () {
            dateTime.minute = 5;
            var result = format.format(dateTime, utcTime, localZone, "mm");
            expect(result).to.equal("05");
        });
        it("should format minutes for format mm", function () {
            dateTime.minute = 38;
            var result = format.format(dateTime, utcTime, localZone, "mm");
            expect(result).to.equal("38");
        });
    });
    describe("formatSecond", function () {
        it("should format seconds for format s", function () {
            dateTime.second = 5;
            var result = format.format(dateTime, utcTime, localZone, "s");
            expect(result).to.equal("5");
        });
        it("should format seconds for format s", function () {
            dateTime.second = 38;
            var result = format.format(dateTime, utcTime, localZone, "s");
            expect(result).to.equal("38");
        });
        it("should format seconds for format ss, padding to two characters", function () {
            dateTime.second = 5;
            var result = format.format(dateTime, utcTime, localZone, "ss");
            expect(result).to.equal("05");
        });
        it("should format seconds for format ss", function () {
            dateTime.second = 38;
            var result = format.format(dateTime, utcTime, localZone, "ss");
            expect(result).to.equal("38");
        });
        it("should get the fraction of a second for format S", function () {
            dateTime.milli = 388;
            var result = format.format(dateTime, utcTime, localZone, "S");
            expect(result).to.equal("3");
        });
        it("should get the fraction of a second for format SS", function () {
            dateTime.milli = 2;
            var result = format.format(dateTime, utcTime, localZone, "SS");
            expect(result).to.equal("00");
        });
        it("should get the fraction of a second for format SSS", function () {
            dateTime.milli = 891;
            var result = format.format(dateTime, utcTime, localZone, "SSS");
            expect(result).to.equal("891");
        });
        it("should get the fraction of a second for format SSSS", function () {
            dateTime.milli = 44;
            var result = format.format(dateTime, utcTime, localZone, "SSSS");
            expect(result).to.equal("0440");
        });
        it("should get the seconds of a day for format A", function () {
            dateTime.hour = 3;
            dateTime.minute = 14;
            dateTime.second = 15;
            var result = format.format(dateTime, utcTime, localZone, "A");
            expect(result).to.equal("11655");
        });
    });
    describe("formatTimeZone", function () {
        it("should not crash on NULL zone", function () {
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs());
            expect(format.format(dateTime, utcTime, null, "z")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "zzzz")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "zzzzz")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "O")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "OOOO")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "v")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "vvvv")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "V")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "VV")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "VVV")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "VVVV")).to.equal("");
            expect(format.format(dateTime, utcTime, null, "VVVVVV")).to.equal("");
        });
        it("should not add space for NULL zone", function () {
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = dateTime;
            expect(format.format(dateTime, utcTime, null, "MM/dd/yyyy z")).to.equal("07/15/2014");
        });
        it("should get the short specific name of the timezone for format z", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "z");
            expect(result).to.equal("CEST");
        });
        it("should get the short specific name of the timezone for format z", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            dateTime.month = 2;
            var result = format.format(dateTime, utcTime, localZone, "z");
            expect(result).to.equal("CET");
        });
        it("should get the long specific name of the timezone for format zzzz", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "zzzz");
            expect(result).to.equal("Europe/Amsterdam"); // Should be Central European Summer Time
        });
        it("should get the long specific name of the timezone for format zzzz", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "zzzz");
            expect(result).to.equal("Europe/Amsterdam"); // Should be Central European Time
        });
        it("should throw if the token is too long", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 19;
            assert.throws(function () { format.format(dateTime, utcTime, localZone, "zzzzz"); });
        });
        it("should get the short specific name of the timezone for format O", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "O");
            expect(result).to.equal("UTC+2");
        });
        it("should get the short specific name of the timezone for format O", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (60 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "O");
            expect(result).to.equal("UTC+1");
        });
        it("should get the short specific name of the timezone for format OOOO", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "OOOO");
            expect(result).to.equal("UTC+2:00");
        });
        it("should get the short specific name of the timezone for format OOOO", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (60 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "OOOO");
            expect(result).to.equal("UTC+1:00");
        });
        it("should get the short specific name of the timezone for format v", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "v");
            expect(result).to.equal("CET");
        });
        it("should get the short specific name of the timezone for format v", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 2;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (60 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "v");
            expect(result).to.equal("CET");
        });
        it("should get the long specific name of the timezone for format vvvv", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "vvvv");
            expect(result).to.equal("Europe/Amsterdam"); // Should be Central European Time
        });
        it("should get the long specific name of the timezone for format vvvv", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "vvvv");
            expect(result).to.equal("Europe/Amsterdam"); // Should be Central European Time
        });
        it("should get the long Timezone ID for format V", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "V");
            expect(result).to.equal("unk");
        });
        it("should get the long Timezone ID for format VV", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "VV");
            expect(result).to.equal("Europe/Amsterdam");
        });
        it("should get the long Timezone ID for format VVV", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "VVV");
            expect(result).to.equal("Unknown");
        });
        it("should get the long Timezone ID for format VVVV", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (120 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "VVVV");
            expect(result).to.equal("Unknown");
        });
        it("should throw if the token is too long", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 19;
            assert.throws(function () { format.format(dateTime, utcTime, localZone, "VVVVVV"); });
        });
        it("should get the basic ISO format for format X with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "X");
            expect(result).to.equal("+0230");
        });
        it("should get the basic ISO format for format X with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "X");
            expect(result).to.equal("-08");
        });
        it("should get the basic ISO format for format X with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "X");
            expect(result).to.equal("Z");
        });
        it("should get the basic ISO format for format XX with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XX");
            expect(result).to.equal("+0230");
        });
        it("should get the basic ISO format for format XX with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XX");
            expect(result).to.equal("-0800");
        });
        it("should get the basic ISO format for format XX with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XX");
            expect(result).to.equal("Z");
        });
        it("should get the basic ISO format for format XXX with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XXX");
            expect(result).to.equal("+02:30");
        });
        it("should get the basic ISO format for format XXX with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XXX");
            expect(result).to.equal("-08:00");
        });
        it("should get the basic ISO format for format XXX with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XXX");
            expect(result).to.equal("Z");
        });
        it("should get the basic ISO format for format XXXX with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XXXX");
            expect(result).to.equal("+0230");
        });
        it("should get the basic ISO format for format XXXX with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XXXX");
            expect(result).to.equal("-0800");
        });
        it("should get the basic ISO format for format XXXX with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XXXX");
            expect(result).to.equal("Z");
        });
        it("should get the basic ISO format for format XXXXX with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XXXXX");
            expect(result).to.equal("+02:30");
        });
        it("should get the basic ISO format for format XXXXX with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XXXXX");
            expect(result).to.equal("-08:00");
        });
        it("should get the basic ISO format for format XXXXX with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "XXXXX");
            expect(result).to.equal("Z");
        });
        it("should throw if the token is too long", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 19;
            assert.throws(function () { format.format(dateTime, utcTime, localZone, "XXXXXX"); });
        });
        it("should get the basic ISO format for format x with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "x");
            expect(result).to.equal("+0230");
        });
        it("should get the basic ISO format for format x with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "x");
            expect(result).to.equal("-08");
        });
        it("should get the basic ISO format for format x with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "x");
            expect(result).to.equal("+00");
        });
        it("should get the basic ISO format for format xx with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xx");
            expect(result).to.equal("+0230");
        });
        it("should get the basic ISO format for format xx with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xx");
            expect(result).to.equal("-0800");
        });
        it("should get the basic ISO format for format xx with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xx");
            expect(result).to.equal("+0000");
        });
        it("should get the basic ISO format for format xxx with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xxx");
            expect(result).to.equal("+02:30");
        });
        it("should get the basic ISO format for format xxx with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xxx");
            expect(result).to.equal("-08:00");
        });
        it("should get the basic ISO format for format xxx with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xxx");
            expect(result).to.equal("+00:00");
        });
        it("should get the basic ISO format for format xxxx with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xxxx");
            expect(result).to.equal("+0230");
        });
        it("should get the basic ISO format for format xxxx with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xxxx");
            expect(result).to.equal("-0800");
        });
        it("should get the basic ISO format for format xxxx with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xxxx");
            expect(result).to.equal("+0000");
        });
        it("should get the basic ISO format for format xxxxx with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xxxxx");
            expect(result).to.equal("+02:30");
        });
        it("should get the basic ISO format for format xxxxx with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xxxxx");
            expect(result).to.equal("-08:00");
        });
        it("should get the basic ISO format for format xxxxx with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "xxxxx");
            expect(result).to.equal("+00:00");
        });
        it("should throw if the token is too long", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 19;
            assert.throws(function () { format.format(dateTime, utcTime, localZone, "xxxxxx"); });
        });
        it("should get the basic ISO format for format Z with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "Z");
            expect(result).to.equal("+0230");
        });
        it("should get the basic ISO format for format Z with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "Z");
            expect(result).to.equal("-0800");
        });
        it("should get the basic ISO format for format Z with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "Z");
            expect(result).to.equal("+0000");
        });
        it("should get the basic ISO format for format ZZ with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZ");
            expect(result).to.equal("+0230");
        });
        it("should get the basic ISO format for format ZZ with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZ");
            expect(result).to.equal("-0800");
        });
        it("should get the basic ISO format for format ZZ with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZ");
            expect(result).to.equal("+0000");
        });
        it("should get the basic ISO format for format ZZZ with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZZ");
            expect(result).to.equal("+0230");
        });
        it("should get the basic ISO format for format ZZZ with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZZ");
            expect(result).to.equal("-0800");
        });
        it("should get the basic ISO format for format ZZZ with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZZ");
            expect(result).to.equal("+0000");
        });
        it("should get the basic ISO format for format ZZZZ with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZZZ");
            expect(result).to.equal("UTC+2:30");
        });
        it("should get the basic ISO format for format ZZZZ with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZZZ");
            expect(result).to.equal("UTC-8:00");
        });
        it("should get the basic ISO format for format ZZZZ with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZZZ");
            expect(result).to.equal("UTC+0:00");
        });
        it("should get the basic ISO format for format ZZZZZ with positive offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (150 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZZZZ");
            expect(result).to.equal("+02:30");
        });
        it("should get the basic ISO format for format ZZZZZ with negative offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (-480 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZZZZ");
            expect(result).to.equal("-08:00");
        });
        it("should get the basic ISO format for format ZZZZZ with 0 offset", function () {
            localZone = new timeZone.TimeZone("Europe/Amsterdam");
            dateTime.year = 2014;
            dateTime.month = 7;
            dateTime.day = 15;
            utcTime = basics.unixToTimeNoLeapSecs(dateTime.toUnixNoLeapSecs() - (0 * 60 * 1000));
            var result = format.format(dateTime, utcTime, localZone, "ZZZZZ");
            expect(result).to.equal("+00:00");
        });
        it("should throw if the token is too long", function () {
            dateTime.year = 2014;
            dateTime.month = 8;
            dateTime.day = 19;
            assert.throws(function () { format.format(dateTime, utcTime, localZone, "ZZZZZZ"); });
        });
    });
});

//# sourceMappingURL=data:application/json;base64,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QUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLENBQUMsQ0FBQyxDQUFDO0lBRUosQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0L3Rlc3QtZm9ybWF0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdGVzdC5kLnRzXCIgLz5cclxuXHJcbmltcG9ydCBzb3VyY2VtYXBzdXBwb3J0ID0gcmVxdWlyZShcInNvdXJjZS1tYXAtc3VwcG9ydFwiKTtcclxuLy8gRW5hYmxlIHNvdXJjZS1tYXAgc3VwcG9ydCBmb3IgYmFja3RyYWNlcy4gQ2F1c2VzIFRTIGZpbGVzICYgbGluZW51bWJlcnMgdG8gc2hvdyB1cCBpbiB0aGVtLlxyXG5zb3VyY2VtYXBzdXBwb3J0Lmluc3RhbGwoeyBoYW5kbGVVbmNhdWdodEV4Y2VwdGlvbnM6IGZhbHNlIH0pO1xyXG5cclxuaW1wb3J0IGFzc2VydCA9IHJlcXVpcmUoXCJhc3NlcnRcIik7XHJcbmltcG9ydCBjaGFpID0gcmVxdWlyZShcImNoYWlcIik7XHJcbmltcG9ydCBleHBlY3QgPSBjaGFpLmV4cGVjdDtcclxuXHJcbmltcG9ydCBmb3JtYXQgPSByZXF1aXJlKFwiLi4vbGliL2Zvcm1hdFwiKTtcclxuaW1wb3J0IHRpbWVab25lID0gcmVxdWlyZShcIi4uL2xpYi90aW1lem9uZVwiKTtcclxuaW1wb3J0IGJhc2ljcyA9IHJlcXVpcmUoXCIuLi9saWIvYmFzaWNzXCIpO1xyXG5cclxuLypcclxuICogRHVtbXkgaW1wbGVtZW50YXRpb24gb2YgYSBEYXRlVGltZUFjY2VzcyBjbGFzcywgZm9yIHRlc3RpbmcgdGhlIGZvcm1hdFxyXG4gKi9cclxuXHJcbmRlc2NyaWJlKFwiZm9ybWF0XCIsICgpOiB2b2lkID0+IHtcclxuXHR2YXIgZGF0ZVRpbWU6IGJhc2ljcy5UaW1lU3RydWN0O1xyXG5cdHZhciB1dGNUaW1lOiBiYXNpY3MuVGltZVN0cnVjdDtcclxuXHR2YXIgbG9jYWxab25lOiB0aW1lWm9uZS5UaW1lWm9uZTtcclxuXHJcblx0YmVmb3JlRWFjaCgoKTogdm9pZCA9PiB7XHJcblx0XHRkYXRlVGltZSA9IG5ldyBiYXNpY3MuVGltZVN0cnVjdCgpO1xyXG5cdH0pO1xyXG5cclxuXHRkZXNjcmliZShcImlkZW50aXR5XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiB0aGUgcmF3IGNvbnRlbnRzXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDE4O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIidhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eidcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIik7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0ZGVzY3JpYmUoXCJmb3JtYXRFcmFcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIEJDIGZvciB5ZWFycyA+IDBcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gLTE7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiR1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJCQ1wiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIEFEIGZvciB5ZWFycyA8IDBcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJHXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIkFEXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gQmVmb3JlIENocmlzdCBmb3IgeWVhcnMgPiAwXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IC0xO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIkdHR0dcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiQmVmb3JlIENocmlzdFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIEFubm8gRG9taW5pIGZvciB5ZWFycyA8IDBcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJHR0dHXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIkFubm8gRG9taW5pXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gQiBmb3IgeWVhcnMgPiAwXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IC0xO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIkdHR0dHXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIkJcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiBBIGZvciB5ZWFycyA8IDBcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJHR0dHR1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJBXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCB0aHJvdyBpZiB0aGUgdG9rZW4gaXMgdG9vIGxvbmdcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gLTE7XHJcblx0XHRcdGFzc2VydC50aHJvd3MoKCk6IHZvaWQgPT4geyBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiR0dHR0dHXCIpOyB9KTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRkZXNjcmliZShcImZvcm1hdFllYXJcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIGF0IGxlYXN0IG9uZSBkaWdpdCB5ZWFyIGZvciB5XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDEyMztcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ5XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjEyM1wiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIGF0IGxlYXN0IHR3byBkaWdpdCB5ZWFyIGZvciB5eVwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAzO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInl5XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjAzXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gZXhhY3RseSB0d28gZGlnaXQgeWVhciBmb3IgeXlcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMTk5NztcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ5eVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCI5N1wiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcGFkIHRvIGZvdXIgZGlnaXQgeWVhciBmb3IgeXl5eVwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAxMjM7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwieXl5eVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIwMTIzXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gYXQgbGVhc3QgZm91ciBkaWdpdCB5ZWFyIGZvciB5eXl5XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDEyMzQ1O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInl5eXlcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiMTIzNDVcIik7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0ZGVzY3JpYmUoXCJmb3JtYXRRdWFydGVyXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiB0aGUgbnVtZXJpY2FsIHZhbHVlIG9mIHRoZSBxdWFydGVyIG9mIHFcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDE7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwicVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIwMVwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIHRoZSBudW1lcmljYWwgdmFsdWUgb2YgdGhlIHF1YXJ0ZXIgb2YgcXFcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDM7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwicXFcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiMDFcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiB0aGUgc2hvcnQgdmFsdWUgb2YgdGhlIHF1YXJ0ZXIgb2YgcXFxXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA0O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInFxcVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJRMlwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIHRoZSBsb25nIHZhbHVlIG9mIHRoZSBxdWFydGVyIG9mIHFxcXFcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDEyO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInFxcXFcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiNHRoIHF1YXJ0ZXJcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiBvbmx5IHRoZSBudW1iZXIgb2YgdGhlIHF1YXJ0ZXIgb2YgcXFxcVwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gOTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJxcXFxcVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIzXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCB0aHJvdyBpZiB0aGUgdG9rZW4gaXMgdG9vIGxvbmdcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDU7XHJcblx0XHRcdGFzc2VydC50aHJvd3MoKCk6IHZvaWQgPT4geyBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwicXFxcXFxXCIpOyB9KTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRkZXNjcmliZShcImZvcm1hdE1vbnRoXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiBqdXN0IHRoZSBudW1iZXIgb2YgdGhlIG1vbnRoIGZvciBNXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA5O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIk1cIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiOVwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIGp1c3QgdGhlIG51bWJlciBvZiB0aGUgbW9udGggZm9yIE1cIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDExO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIk1cIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiMTFcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiBqdXN0IHRoZSBudW1iZXIgb2YgdGhlIG1vbnRoIGZvciBNTSwgcGFkZGVkIHRvIHR3byBjaGFyYWN0ZXJzXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSAzO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIk1NXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjAzXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gdGhlIHNob3J0ZW5lZCBuYW1lIG9mIHRoZSBtb250aCB3aXRoIE1NTVwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gODtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJNTU1cIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiQXVnXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gdGhlIGZ1bGwgbmFtZSBvZiB0aGUgbW9udGggd2l0aCBNTU1NXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSAyO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIk1NTU1cIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiRmVicnVhcnlcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiB0aGUgbmFycm93IG5hbWUgb2YgdGhlIG1vbnRoIHdpdGggTU1NTU1cIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDExO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIk1NTU1NXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIk5cIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHRocm93IGlmIHRoZSB0b2tlbiBpcyB0b28gbG9uZ1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gMTtcclxuXHRcdFx0YXNzZXJ0LnRocm93cygoKTogdm9pZCA9PiB7IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJNTU1NTU1cIik7IH0pO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdGRlc2NyaWJlKFwiZm9ybWF0V2Vla1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRpdChcInNob3VsZCBmb3JtYXQgdGhlIHdlZWsgbnVtYmVyIHdpdGggd1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDE7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDQ7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwid1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIxXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBmb3JtYXQgdGhlIHdlZWsgbnVtYmVyIHdpdGggd1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDg7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE3O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIndcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiMzNcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGZvcm1hdCB0aGUgd2VlayBudW1iZXIgd2l0aCB3d1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDE7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDQ7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwid3dcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiMDFcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGZvcm1hdCB0aGUgd2VlayBudW1iZXIgd2l0aCB3d1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDg7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE3O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInd3XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjMzXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBmb3JtYXQgdGhlIG1vbnRoIHdlZWsgbnVtYmVyIHdpdGggV1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDg7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE3O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIldcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiMlwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9KTtcclxuXHJcblx0ZGVzY3JpYmUoXCJmb3JtYXREYXlcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIHRoZSBudW1iZXIgb2YgdGhlIGRheSB3aXRoIGRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSA4O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcImRcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiOFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIHRoZSBudW1iZXIgb2YgdGhlIGRheSB3aXRoIGRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAyNTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJkXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjI1XCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gdGhlIG51bWJlciBvZiB0aGUgZGF5IHdpdGggZGQsIHBhZGRlZCB0byB0d28gY2hhcmFjdGVyc1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDY7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiZGRcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiMDZcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiB0aGUgZGF5IG9mIHRoZSB5ZWFyIHdpdGggRFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDI7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiRFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIzMlwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIHRoZSBkYXkgb2YgdGhlIHllYXIgd2l0aCBERFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDg7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE3O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIkREXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjIyOVwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9KTtcclxuXHJcblx0ZGVzY3JpYmUoXCJmb3JtYXRXZWVrZGF5XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiB0aGUgYWJicmV2aWF0ZWQgbmFtZSBmb3IgRVwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDg7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE2O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIkVcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiU2F0XCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gdGhlIGFiYnJldmlhdGVkIG5hbWUgZm9yIEVFXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gODtcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMjE7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiRUVcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiVGh1XCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gdGhlIGFiYnJldmlhdGVkIG5hbWUgZm9yIEVFRVwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDg7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE4O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIkVFRVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJNb25cIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiB0aGUgZnVsbCBuYW1lIGZvciBFRUVFXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gODtcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMjA7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiRUVFRVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJXZWRuZXNkYXlcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiB0aGUgbmFycm93IG5hbWUgZm9yIEVFRUVFXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gODtcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiRUVFRUVcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiRlwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIHRoZSBzaG9ydCBuYW1lIGZvciBFRUVFRUVcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA4O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNztcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJFRUVFRUVcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiU3VcIik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gdGhlIHdlZWtkYXkgbnVtYmVyIGZvciBlXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gODtcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiZVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIyXCIpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aXQoXCJzaG91bGQgdGhyb3cgaWYgdGhlIHRva2VuIGlzIHRvbyBsb25nXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gODtcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTk7XHJcblx0XHRcdGFzc2VydC50aHJvd3MoKCk6IHZvaWQgPT4geyBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiRUVFRUVFRVwiKTsgfSk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0ZGVzY3JpYmUoXCJmb3JtYXREYXlQZXJpb2RcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIEFNIGZvciB0aGUgbW9ybmluZ1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLmhvdXIgPSAxMTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJhXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIkFNXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gUE0gZm9yIHRoZSBhZnRlcm5vb25cIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5ob3VyID0gMjM7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiYVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJQTVwiKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRkZXNjcmliZShcImZvcm1hdEhvdXJcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIDEtMTIgaG91ciBwZXJpb2QgZm9yIGZvcm1hdCBoXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUuaG91ciA9IDA7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiaFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIxMlwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIDEtMTIgaG91ciBwZXJpb2QgZm9yIGZvcm1hdCBoXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUuaG91ciA9IDIyO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcImhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiMTBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiAxLTEyIGhvdXIgcGVyaW9kIGZvciBmb3JtYXQgaGgsIHBhZGRpbmcgdG8gdHdvIGNoYXJhY3RlcnNcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5ob3VyID0gMTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJoaFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIwMVwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIDEtMTIgaG91ciBwZXJpb2QgZm9yIGZvcm1hdCBoaFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLmhvdXIgPSAyMDtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJoaFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIwOFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIDAtMTEgaG91ciBwZXJpb2QgZm9yIGZvcm1hdCBLXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUuaG91ciA9IDA7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiS1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gMC0xMSBob3VyIHBlcmlvZCBmb3IgZm9ybWF0IEtcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5ob3VyID0gMjI7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiS1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIxMFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIDAtMTEgaG91ciBwZXJpb2QgZm9yIGZvcm1hdCBLSywgcGFkZGluZyB0byB0d28gY2hhcmFjdGVyc1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLmhvdXIgPSAxO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIktLXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjAxXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gMC0xMSBob3VyIHBlcmlvZCBmb3IgZm9ybWF0IEtLXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUuaG91ciA9IDIwO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIktLXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjA4XCIpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIDEtMjQgaG91ciBwZXJpb2QgZm9yIGZvcm1hdCBrXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUuaG91ciA9IDA7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwia1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIyNFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIDEtMjQgaG91ciBwZXJpb2QgZm9yIGZvcm1hdCBrXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUuaG91ciA9IDIyO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcImtcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiMjJcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHJldHVybiAxLTI0IGhvdXIgcGVyaW9kIGZvciBmb3JtYXQga2ssIHBhZGRpbmcgdG8gdHdvIGNoYXJhY3RlcnNcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5ob3VyID0gMTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJra1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIwMVwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIDEtMjQgaG91ciBwZXJpb2QgZm9yIGZvcm1hdCBra1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLmhvdXIgPSAyMDtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJra1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIyMFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIDAtMjMgaG91ciBwZXJpb2QgZm9yIGZvcm1hdCBIXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUuaG91ciA9IDA7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiSFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gMC0yMyBob3VyIHBlcmlvZCBmb3IgZm9ybWF0IEhcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5ob3VyID0gMjI7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiSFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIyMlwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgcmV0dXJuIDAtMjMgaG91ciBwZXJpb2QgZm9yIGZvcm1hdCBISCwgcGFkZGluZyB0byB0d28gY2hhcmFjdGVyc1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLmhvdXIgPSAxO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIkhIXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjAxXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCByZXR1cm4gMC0yMyBob3VyIHBlcmlvZCBmb3IgZm9ybWF0IEhIXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUuaG91ciA9IDIwO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIkhIXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjIwXCIpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdGRlc2NyaWJlKFwiZm9ybWF0TWludXRlXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdGl0KFwic2hvdWxkIGZvcm1hdCBtaW51dGVzIGZvciBmb3JtYXQgbVwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLm1pbnV0ZSA9IDU7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwibVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCI1XCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBmb3JtYXQgbWludXRlcyBmb3IgZm9ybWF0IG1cIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5taW51dGUgPSAzODtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJtXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjM4XCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBmb3JtYXQgbWludXRlcyBmb3IgZm9ybWF0IG1tLCBwYWRkaW5nIHRvIHR3byBjaGFyYWN0ZXJzXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUubWludXRlID0gNTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJtbVwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIwNVwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZm9ybWF0IG1pbnV0ZXMgZm9yIGZvcm1hdCBtbVwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLm1pbnV0ZSA9IDM4O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIm1tXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjM4XCIpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdGRlc2NyaWJlKFwiZm9ybWF0U2Vjb25kXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdGl0KFwic2hvdWxkIGZvcm1hdCBzZWNvbmRzIGZvciBmb3JtYXQgc1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnNlY29uZCA9IDU7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwic1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCI1XCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBmb3JtYXQgc2Vjb25kcyBmb3IgZm9ybWF0IHNcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5zZWNvbmQgPSAzODtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJzXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjM4XCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBmb3JtYXQgc2Vjb25kcyBmb3IgZm9ybWF0IHNzLCBwYWRkaW5nIHRvIHR3byBjaGFyYWN0ZXJzXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUuc2Vjb25kID0gNTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJzc1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIwNVwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZm9ybWF0IHNlY29uZHMgZm9yIGZvcm1hdCBzc1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnNlY29uZCA9IDM4O1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInNzXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjM4XCIpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBmcmFjdGlvbiBvZiBhIHNlY29uZCBmb3IgZm9ybWF0IFNcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS5taWxsaSA9IDM4ODtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJTXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjNcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgZnJhY3Rpb24gb2YgYSBzZWNvbmQgZm9yIGZvcm1hdCBTU1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLm1pbGxpID0gMjtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJTU1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIwMFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBmcmFjdGlvbiBvZiBhIHNlY29uZCBmb3IgZm9ybWF0IFNTU1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLm1pbGxpID0gODkxO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlNTU1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCI4OTFcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgZnJhY3Rpb24gb2YgYSBzZWNvbmQgZm9yIGZvcm1hdCBTU1NTXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUubWlsbGkgPSA0NDtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJTU1NTXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjA0NDBcIik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIHNlY29uZHMgb2YgYSBkYXkgZm9yIGZvcm1hdCBBXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUuaG91ciA9IDM7XHJcblx0XHRcdGRhdGVUaW1lLm1pbnV0ZSA9IDE0O1xyXG5cdFx0XHRkYXRlVGltZS5zZWNvbmQgPSAxNTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJBXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIjExNjU1XCIpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdGRlc2NyaWJlKFwiZm9ybWF0VGltZVpvbmVcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0aXQoXCJzaG91bGQgbm90IGNyYXNoIG9uIE5VTEwgem9uZVwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpKTtcclxuXHRcdFx0ZXhwZWN0KGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIG51bGwsIFwielwiKSkudG8uZXF1YWwoXCJcIik7XHJcblx0XHRcdGV4cGVjdChmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBudWxsLCBcInp6enpcIikpLnRvLmVxdWFsKFwiXCIpO1xyXG5cdFx0XHRleHBlY3QoZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbnVsbCwgXCJ6enp6elwiKSkudG8uZXF1YWwoXCJcIik7XHJcblx0XHRcdGV4cGVjdChmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBudWxsLCBcIk9cIikpLnRvLmVxdWFsKFwiXCIpO1xyXG5cdFx0XHRleHBlY3QoZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbnVsbCwgXCJPT09PXCIpKS50by5lcXVhbChcIlwiKTtcclxuXHRcdFx0ZXhwZWN0KGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIG51bGwsIFwidlwiKSkudG8uZXF1YWwoXCJcIik7XHJcblx0XHRcdGV4cGVjdChmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBudWxsLCBcInZ2dnZcIikpLnRvLmVxdWFsKFwiXCIpO1xyXG5cdFx0XHRleHBlY3QoZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbnVsbCwgXCJWXCIpKS50by5lcXVhbChcIlwiKTtcclxuXHRcdFx0ZXhwZWN0KGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIG51bGwsIFwiVlZcIikpLnRvLmVxdWFsKFwiXCIpO1xyXG5cdFx0XHRleHBlY3QoZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbnVsbCwgXCJWVlZcIikpLnRvLmVxdWFsKFwiXCIpO1xyXG5cdFx0XHRleHBlY3QoZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbnVsbCwgXCJWVlZWXCIpKS50by5lcXVhbChcIlwiKTtcclxuXHRcdFx0ZXhwZWN0KGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIG51bGwsIFwiVlZWVlZWXCIpKS50by5lcXVhbChcIlwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGl0KFwic2hvdWxkIG5vdCBhZGQgc3BhY2UgZm9yIE5VTEwgem9uZVwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gZGF0ZVRpbWU7XHJcblx0XHRcdGV4cGVjdChmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBudWxsLCBcIk1NL2RkL3l5eXkgelwiKSkudG8uZXF1YWwoXCIwNy8xNS8yMDE0XCIpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBzaG9ydCBzcGVjaWZpYyBuYW1lIG9mIHRoZSB0aW1lem9uZSBmb3IgZm9ybWF0IHpcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMTIwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwielwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJDRVNUXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIHNob3J0IHNwZWNpZmljIG5hbWUgb2YgdGhlIHRpbWV6b25lIGZvciBmb3JtYXQgelwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxMjAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSAyO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInpcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiQ0VUXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGxvbmcgc3BlY2lmaWMgbmFtZSBvZiB0aGUgdGltZXpvbmUgZm9yIGZvcm1hdCB6enp6XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDEyMCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInp6enpcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTsgLy8gU2hvdWxkIGJlIENlbnRyYWwgRXVyb3BlYW4gU3VtbWVyIFRpbWVcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBsb25nIHNwZWNpZmljIG5hbWUgb2YgdGhlIHRpbWV6b25lIGZvciBmb3JtYXQgenp6elwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxMjAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ6enp6XCIpO1xyXG5cdFx0XHRleHBlY3QoXHJcblx0XHRcdFx0cmVzdWx0KS50by5lcXVhbChcIkV1cm9wZS9BbXN0ZXJkYW1cIik7IC8vIFNob3VsZCBiZSBDZW50cmFsIEV1cm9wZWFuIFRpbWVcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgdGhyb3cgaWYgdGhlIHRva2VuIGlzIHRvbyBsb25nXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gODtcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTk7XHJcblx0XHRcdGFzc2VydC50aHJvd3MoKCk6IHZvaWQgPT4geyBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwienp6enpcIik7IH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBzaG9ydCBzcGVjaWZpYyBuYW1lIG9mIHRoZSB0aW1lem9uZSBmb3IgZm9ybWF0IE9cIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMTIwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiT1wiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJVVEMrMlwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBzaG9ydCBzcGVjaWZpYyBuYW1lIG9mIHRoZSB0aW1lem9uZSBmb3IgZm9ybWF0IE9cIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoNjAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJPXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIlVUQysxXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIHNob3J0IHNwZWNpZmljIG5hbWUgb2YgdGhlIHRpbWV6b25lIGZvciBmb3JtYXQgT09PT1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxMjAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJPT09PXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIlVUQysyOjAwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIHNob3J0IHNwZWNpZmljIG5hbWUgb2YgdGhlIHRpbWV6b25lIGZvciBmb3JtYXQgT09PT1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICg2MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIk9PT09cIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiVVRDKzE6MDBcIik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIHNob3J0IHNwZWNpZmljIG5hbWUgb2YgdGhlIHRpbWV6b25lIGZvciBmb3JtYXQgdlwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxMjAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ2XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIkNFVFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBzaG9ydCBzcGVjaWZpYyBuYW1lIG9mIHRoZSB0aW1lem9uZSBmb3IgZm9ybWF0IHZcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSAyO1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoNjAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ2XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIkNFVFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBsb25nIHNwZWNpZmljIG5hbWUgb2YgdGhlIHRpbWV6b25lIGZvciBmb3JtYXQgdnZ2dlwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxMjAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ2dnZ2XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIkV1cm9wZS9BbXN0ZXJkYW1cIik7IC8vIFNob3VsZCBiZSBDZW50cmFsIEV1cm9wZWFuIFRpbWVcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBsb25nIHNwZWNpZmljIG5hbWUgb2YgdGhlIHRpbWV6b25lIGZvciBmb3JtYXQgdnZ2dlwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxMjAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ2dnZ2XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIkV1cm9wZS9BbXN0ZXJkYW1cIik7IC8vIFNob3VsZCBiZSBDZW50cmFsIEV1cm9wZWFuIFRpbWVcclxuXHRcdH0pO1xyXG5cclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgbG9uZyBUaW1lem9uZSBJRCBmb3IgZm9ybWF0IFZcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMTIwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiVlwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJ1bmtcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgbG9uZyBUaW1lem9uZSBJRCBmb3IgZm9ybWF0IFZWXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDEyMCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlZWXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgbG9uZyBUaW1lem9uZSBJRCBmb3IgZm9ybWF0IFZWVlwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxMjAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJWVlZcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiVW5rbm93blwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBsb25nIFRpbWV6b25lIElEIGZvciBmb3JtYXQgVlZWVlwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxMjAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJWVlZWXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIlVua25vd25cIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIHRocm93IGlmIHRoZSB0b2tlbiBpcyB0b28gbG9uZ1wiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDg7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE5O1xyXG5cdFx0XHRhc3NlcnQudGhyb3dzKCgpOiB2b2lkID0+IHsgZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlZWVlZWVlwiKTsgfSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBYIHdpdGggcG9zaXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDE1MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiKzAyMzBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IFggd2l0aCBuZWdhdGl2ZSBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoLTQ4MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiLTA4XCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBYIHdpdGggMCBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiWlwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IFhYIHdpdGggcG9zaXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDE1MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlhYXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIiswMjMwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBYWCB3aXRoIG5lZ2F0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgtNDgwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiWFhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiLTA4MDBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IFhYIHdpdGggMCBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlhYXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIlpcIik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBYWFggd2l0aCBwb3NpdGl2ZSBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMTUwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiWFhYXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIiswMjozMFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgWFhYIHdpdGggbmVnYXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKC00ODAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJYWFhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiLTA4OjAwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBYWFggd2l0aCAwIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiWFhYXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIlpcIik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBYWFhYIHdpdGggcG9zaXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDE1MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlhYWFhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiKzAyMzBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IFhYWFggd2l0aCBuZWdhdGl2ZSBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoLTQ4MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlhYWFhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiLTA4MDBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IFhYWFggd2l0aCAwIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiWFhYWFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJaXCIpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgWFhYWFggd2l0aCBwb3NpdGl2ZSBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMTUwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiWFhYWFhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiKzAyOjMwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBYWFhYWCB3aXRoIG5lZ2F0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgtNDgwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiWFhYWFhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiLTA4OjAwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBYWFhYWCB3aXRoIDAgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJYWFhYWFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCJaXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCB0aHJvdyBpZiB0aGUgdG9rZW4gaXMgdG9vIGxvbmdcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA4O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxOTtcclxuXHRcdFx0YXNzZXJ0LnRocm93cygoKTogdm9pZCA9PiB7IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJYWFhYWFhcIik7IH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgeCB3aXRoIHBvc2l0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxNTAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ4XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIiswMjMwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCB4IHdpdGggbmVnYXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKC00ODAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ4XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIi0wOFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgeCB3aXRoIDAgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ4XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIiswMFwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IHh4IHdpdGggcG9zaXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDE1MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInh4XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIiswMjMwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCB4eCB3aXRoIG5lZ2F0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgtNDgwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwieHhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiLTA4MDBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IHh4IHdpdGggMCBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInh4XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIiswMDAwXCIpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgeHh4IHdpdGggcG9zaXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDE1MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInh4eFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIrMDI6MzBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IHh4eCB3aXRoIG5lZ2F0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgtNDgwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwieHh4XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIi0wODowMFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgeHh4IHdpdGggMCBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInh4eFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIrMDA6MDBcIik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCB4eHh4IHdpdGggcG9zaXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDE1MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInh4eHhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiKzAyMzBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IHh4eHggd2l0aCBuZWdhdGl2ZSBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoLTQ4MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInh4eHhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiLTA4MDBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IHh4eHggd2l0aCAwIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwieHh4eFwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIrMDAwMFwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IHh4eHh4IHdpdGggcG9zaXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDE1MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInh4eHh4XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIiswMjozMFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgeHh4eHggd2l0aCBuZWdhdGl2ZSBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoLTQ4MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcInh4eHh4XCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIi0wODowMFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgeHh4eHggd2l0aCAwIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwieHh4eHhcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiKzAwOjAwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCB0aHJvdyBpZiB0aGUgdG9rZW4gaXMgdG9vIGxvbmdcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA4O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxOTtcclxuXHRcdFx0YXNzZXJ0LnRocm93cygoKTogdm9pZCA9PiB7IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJ4eHh4eHhcIik7IH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgWiB3aXRoIHBvc2l0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxNTAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJaXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIiswMjMwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBaIHdpdGggbmVnYXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKC00ODAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJaXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIi0wODAwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBaIHdpdGggMCBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlpcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiKzAwMDBcIik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBaWiB3aXRoIHBvc2l0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxNTAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJaWlwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIrMDIzMFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgWlogd2l0aCBuZWdhdGl2ZSBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoLTQ4MCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlpaXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIi0wODAwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBaWiB3aXRoIDAgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKDAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJaWlwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIrMDAwMFwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IFpaWiB3aXRoIHBvc2l0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxNTAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJaWlpcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiKzAyMzBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IFpaWiB3aXRoIG5lZ2F0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgtNDgwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiWlpaXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIi0wODAwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBaWlogd2l0aCAwIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgwICogNjAgKiAxMDAwKSk7XHJcblx0XHRcdHZhciByZXN1bHQgPSBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiWlpaXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIiswMDAwXCIpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0aXQoXCJzaG91bGQgZ2V0IHRoZSBiYXNpYyBJU08gZm9ybWF0IGZvciBmb3JtYXQgWlpaWiB3aXRoIHBvc2l0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxNTAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJaWlpaXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIlVUQysyOjMwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBaWlpaIHdpdGggbmVnYXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKC00ODAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJaWlpaXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIlVUQy04OjAwXCIpO1xyXG5cdFx0fSk7XHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBaWlpaIHdpdGggMCBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlpaWlpcIik7XHJcblx0XHRcdGV4cGVjdChyZXN1bHQpLnRvLmVxdWFsKFwiVVRDKzA6MDBcIik7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpdChcInNob3VsZCBnZXQgdGhlIGJhc2ljIElTTyBmb3JtYXQgZm9yIGZvcm1hdCBaWlpaWiB3aXRoIHBvc2l0aXZlIG9mZnNldFwiLCAoKTogdm9pZCA9PiB7XHJcblx0XHRcdGxvY2FsWm9uZSA9IG5ldyB0aW1lWm9uZS5UaW1lWm9uZShcIkV1cm9wZS9BbXN0ZXJkYW1cIik7XHJcblx0XHRcdGRhdGVUaW1lLnllYXIgPSAyMDE0O1xyXG5cdFx0XHRkYXRlVGltZS5tb250aCA9IDc7XHJcblx0XHRcdGRhdGVUaW1lLmRheSA9IDE1O1xyXG5cdFx0XHR1dGNUaW1lID0gYmFzaWNzLnVuaXhUb1RpbWVOb0xlYXBTZWNzKGRhdGVUaW1lLnRvVW5peE5vTGVhcFNlY3MoKSAtICgxNTAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJaWlpaWlwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCIrMDI6MzBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IFpaWlpaIHdpdGggbmVnYXRpdmUgb2Zmc2V0XCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0bG9jYWxab25lID0gbmV3IHRpbWVab25lLlRpbWVab25lKFwiRXVyb3BlL0Ftc3RlcmRhbVwiKTtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gNztcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTU7XHJcblx0XHRcdHV0Y1RpbWUgPSBiYXNpY3MudW5peFRvVGltZU5vTGVhcFNlY3MoZGF0ZVRpbWUudG9Vbml4Tm9MZWFwU2VjcygpIC0gKC00ODAgKiA2MCAqIDEwMDApKTtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IGZvcm1hdC5mb3JtYXQoZGF0ZVRpbWUsIHV0Y1RpbWUsIGxvY2FsWm9uZSwgXCJaWlpaWlwiKTtcclxuXHRcdFx0ZXhwZWN0KHJlc3VsdCkudG8uZXF1YWwoXCItMDg6MDBcIik7XHJcblx0XHR9KTtcclxuXHRcdGl0KFwic2hvdWxkIGdldCB0aGUgYmFzaWMgSVNPIGZvcm1hdCBmb3IgZm9ybWF0IFpaWlpaIHdpdGggMCBvZmZzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG5cdFx0XHRsb2NhbFpvbmUgPSBuZXcgdGltZVpvbmUuVGltZVpvbmUoXCJFdXJvcGUvQW1zdGVyZGFtXCIpO1xyXG5cdFx0XHRkYXRlVGltZS55ZWFyID0gMjAxNDtcclxuXHRcdFx0ZGF0ZVRpbWUubW9udGggPSA3O1xyXG5cdFx0XHRkYXRlVGltZS5kYXkgPSAxNTtcclxuXHRcdFx0dXRjVGltZSA9IGJhc2ljcy51bml4VG9UaW1lTm9MZWFwU2VjcyhkYXRlVGltZS50b1VuaXhOb0xlYXBTZWNzKCkgLSAoMCAqIDYwICogMTAwMCkpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gZm9ybWF0LmZvcm1hdChkYXRlVGltZSwgdXRjVGltZSwgbG9jYWxab25lLCBcIlpaWlpaXCIpO1xyXG5cdFx0XHRleHBlY3QocmVzdWx0KS50by5lcXVhbChcIiswMDowMFwiKTtcclxuXHRcdH0pO1xyXG5cdFx0aXQoXCJzaG91bGQgdGhyb3cgaWYgdGhlIHRva2VuIGlzIHRvbyBsb25nXCIsICgpOiB2b2lkID0+IHtcclxuXHRcdFx0ZGF0ZVRpbWUueWVhciA9IDIwMTQ7XHJcblx0XHRcdGRhdGVUaW1lLm1vbnRoID0gODtcclxuXHRcdFx0ZGF0ZVRpbWUuZGF5ID0gMTk7XHJcblx0XHRcdGFzc2VydC50aHJvd3MoKCk6IHZvaWQgPT4geyBmb3JtYXQuZm9ybWF0KGRhdGVUaW1lLCB1dGNUaW1lLCBsb2NhbFpvbmUsIFwiWlpaWlpaXCIpOyB9KTtcclxuXHRcdH0pO1xyXG5cclxuXHR9KTtcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
