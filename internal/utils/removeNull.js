export default function removeNull(arr) {
    return arr.filter(function (el) {
        return el !== undefined;
    });
}
