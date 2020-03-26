module.exports = {
    generateAccessCode: () => {
        let code = '';
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < 4; i++) {
            code += letters[Math.floor(Math.random() * 26)];
        }

        return code;
    },
    matchGameId: (a, b) => parseInt(a, 10) === parseInt(b, 10)
};
