/** @type {number} */
const ranking = 2;

switch (ranking) {
    case 1:
        console.log("金メダル");
        break;
        // @ts-ignore
    case 2:
        console.log("銀メダル");
        // eslint-disable-next-line no-fallthrough
    case 3:
        console.log("銅メダル");
        break;
    default:
        console.log("メダルなし");
}
