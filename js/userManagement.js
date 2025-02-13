export function saveUserData(firstName, lastName, userEmail, userPassword) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let isexist = false;
    users.forEach(function (user) {
        if (user.userEmail === userEmail) isexist = true;
    });
    if (!isexist) {
        users.push({
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            userEmail,
            userPassword,
        });
        localStorage.setItem("users", JSON.stringify(users));
    }
    return isexist;
}

export function inputsComparing(userEmail, userPassword) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let isValid = false;
    users.forEach(function (user) {
        if (user.userEmail === userEmail && user.userPassword === userPassword)
            isValid = true;
    });
    return isValid;
}