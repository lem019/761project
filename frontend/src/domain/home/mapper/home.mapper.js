export const getSportId = (sports,selectIndex) => {
  const sportId = sports && sports[selectIndex] ? sports[selectIndex]._id : null;
  return sportId;
}