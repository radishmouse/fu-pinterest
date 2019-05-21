
const keysAsString = (o) => {
  const keys = Object.keys(o);
  keys.sort(); // alphabetical, in-place sort.
  return keys.join('');
};

const hasSameKeys = (o1, o2) =>
      Object.keys(o1).length === Object.keys(o2).length &&
      keysAsString(o1) === keysAsString(o2)
;

const hasSameValues = (o1, o2) => {
  let areSameValues = true;
  for (let k of Object.keys(o1)) {
    if (o1[k] !== o2[k]) {
      areSameValues = false;
    }
  }
  return areSameValues;
};

module.exports = (o1, o2) => hasSameKeys(o1, o2) && hasSameValues(o1, o2);
