const error_code_description_map = {
    0: "OK",
    1: "INVALID_COMMAND",
    2: "INVALID_ARGUMENT",
    3: "METHOD_NOT_FOUND",
    4: "NOT_FOUND",
    5: "NO_DATA",
    6: "PERMISSION_DENIED",
    7: "TIMEOUT",
    8: "NOT_SUPPORTED",
    9: "UNKNOWN_ERROR",
    10: "CONNECTION_FAILED",
};

const renderJSONResult = (success, message, isConsole) => {
    const result = { success, message };
    if (isConsole) console.log(JSON.stringify(result));
    return result;
};

/**
 *
 * @param {any} text
 * @param {string} mode -> info, error
 * @param {string} isConsole -> true/false
 * @returns
 */
const print = (text, mode, isConsole = true) => {
    if (!mode) {
        throw new Error("please provide mode: info, warn, error");
    }
    switch (mode) {
        case "info":
            return renderJSONResult(true, text, isConsole);
        case "error":
            return renderJSONResult(false, text, isConsole);
    }
};

const makeRes = (text, error = false) => {
    let mode = error ? "error" : "info";
    return print(text, mode, false);
};

const apiReqMaker = (func, category, params, token) => {
    return {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "call",
        params: [token, func, category, params],
    };
};

/**
 * this will analyse the data and will do success on it or error on it
 * @param {object} data
 * @param {function} success    -> (res) => {} | res = data.data
 * @param {function} error      -> (res, info) => {} | res = data.data, info = {result_code, code_description}
 */
const resolveOutput = (data, success, error) => {
    if (data.data.result) {
        if (data.data.result.length > 0) {
            const result_code = data.data.result[0];
            const code_description = error_code_description_map[result_code];

            if (result_code == 0) {
                success(data.data);
            } else {
                error(data.data, { result_code, code_description });
            }
        }
    } else {
        const err = data.data.error.message;
        if (err) {
            makeRes(err, "error");
        } else {
            makeRes("unknown issue", "error");
        }
    }
};

module.exports = {
    print,
    makeRes,
    apiReqMaker,
    resolveOutput,
};
