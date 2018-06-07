module.exports = {
    linearfunc(values) {
        let slope = (values[1] - values[0]) / (values[3] - values[2]);
        let delta = values[0] - slope * values[2];
        return {
            slope: slope,
            delta: delta
        }
    },
    roundVal(number, size) {
        let digits = +"1".padEnd(size, "0");
        return Math.round(number * digits) / digits;
    }
}
