function reportMemory(label) {
    console.log(`${label}: ${Math.round(process.memoryUsage().rss / 10000)} KB`)
}

module.exports = {
    reportMemory,
}
