const extractPrices = (data) => {
    return data.map(item => item.price);
}

const sumPrices = (prices) => {
    return prices.reduce((total, price) => total + price, 0);
}

export {extractPrices, sumPrices}