const formatData = (dataValue) => {
    if (dataValue instanceof Date) {
        // Se for uma data do Excel (objeto Date)
        dataValue.setDate(dataValue.getDate() + 1);
        const year = dataValue.getFullYear();
        const month = String(dataValue.getMonth() + 1).padStart(2, '0'); // getMonth() é zero-indexado
        const day = String(dataValue.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } else if (typeof dataValue === 'string') {
        // Se for uma string
        const parts = dataValue.split("/");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month}-${day}`;
        }
    }
    return null;
};
const parseCurrency = (floatString) => {
    if (typeof floatString !== "string") {
        floatString = String(floatString);
    }
    // Remover "R$" e separadores de milhar, e substituir a vírgula decimal por ponto
    const value = floatString.replace("R$", "").replace(",", ".").trim();
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
};

module.exports = {formatData, parseCurrency}