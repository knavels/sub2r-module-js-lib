const { makeRes, apiReqMaker, resolveOutput } = require("../lib");
const { getBaseUrl, axiosInstance, getToken } = require("./base");

module.exports = async (command, success) => {
    let response = null;

    if (!getBaseUrl()) {
        return makeRes(
            "base_url does not exists in configurations, try setting it first",
            true
        );
    }

    if (!getToken()) {
        return makeRes(
            "token does not exists in configurations, try refreshing token or login",
            true
        );
    }

    if (!command) {
        return makeRes("command is required", true);
    }

    await axiosInstance
        .post(getBaseUrl(), apiReqMaker("sub2r", command, {}))
        .then((data) => {
            resolveOutput(
                data,
                /*success*/ (res) => {
                    const result = res.result[1];
                    response = success(result);
                    return;
                },
                /*error*/ (res, info) => {
                    if (info.result_code == 6) {
                        response = makeRes(
                            "token in valid please refresh the token or check the credentials",
                            true
                        );
                        return;
                    }
                    response = makeRes(info.code_description, true);
                    return;
                }
            );
        })
        .catch((err) => {
            response = makeRes(err.message, true);
            return;
        });

    return response;
};
