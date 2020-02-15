const convertTimestampToStrDate = timestamp => {
    const d = new Date(timestamp);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

module.exports = {
    convertTimestampToStrDate
};
