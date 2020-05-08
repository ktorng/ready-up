module.exports = {
    generateAccessCode: () => {
        let code = '';
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < 4; i++) {
            code += letters[Math.floor(Math.random() * 26)];
        }

        return code;
    },
    matchId: (a, b) => parseInt(a, 10) === parseInt(b, 10),
    containsId: (arr, id) => arr.some((el) => parseInt(el, 10) === parseInt(id, 10))
};
