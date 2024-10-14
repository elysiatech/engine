export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Debug"] = 100] = "Debug";
    LogLevel[LogLevel["Info"] = 200] = "Info";
    LogLevel[LogLevel["Warn"] = 300] = "Warn";
    LogLevel[LogLevel["Error"] = 400] = "Error";
    LogLevel[LogLevel["Critical"] = 500] = "Critical";
    LogLevel[LogLevel["Production"] = 999] = "Production";
    LogLevel[LogLevel["Silent"] = 9999] = "Silent";
})(LogLevel || (LogLevel = {}));
