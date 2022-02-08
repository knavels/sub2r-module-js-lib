const { makeRes, print, apiReqMaker, resolveOutput } = require("../lib");
const {
    getBaseUrl,
    axiosInstance,
    getUsername,
    getPassword,
    setToken,
} = require("./base");

module.exports = async () => {
    if (!getBaseUrl()) {
        return makeRes(
            "base_url does not exists in configurations, try setting it first",
            true
        );
    }

    if (!username || !password) {
        print(
            "username or password does not exists in configurations, if you accidentally remove or set it to null try to setting it again or simply run config:reset command",
            "error"
        );
        return;
    }

    let response = null;
    await axiosInstance
        .post(
            base_url,
            apiReqMaker(
                "session",
                "login",
                {
                    username: getUsername(),
                    password: getPassword(),
                },
                "00000000000000000000000000000000"
            )
        )
        .then((data) => {
            return resolveOutput(
                data,
                /*success*/ (res) => {
                    const result = res.result[1].ubus_rpc_session;
                    // setConfig("token", result);
                    setToken(result);
                    response = makeRes(
                        `token "${result}" has been set successfully.`
                    );
                    return;
                },
                /*error*/ (res, info) => {
                    if (info.result_code == 6) {
                        response = makeRes(
                            "Please check root password and set the pass if you didn't and try again",
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
