
const countyISO = {
    "esp": "Spain",
    "ita": "Italy",
    "fra": "France",
    "deu": "Germany",
    "nld": "Nederland"
}

const countryFlag = {
    "Spain": "flags/esp.svg",
    "Italy": "flags/ita.svg",
    "France": "flags/fra.svg",
    "Germany": "flags/deu.svg",
    "Nederland":"flags/nld.svg"
}


function getFullName (code) {
    console.log("getFN")
    console.log(code)
    const name = countyISO[code];
    return name;
}

function getFlag (name) {
    const flag = countryFlag[name];
    return flag;
}

function getCountryInfo (code, op) {
    if (op === "flag") return getFlag(code);
    else return getFullName(code);
}

export default getCountryInfo;
