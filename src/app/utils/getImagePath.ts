const getImagePath = (
  // publicURL: string,
  ID: string,
) => {
  return `/${encodeURIComponent(ID)}.png`;  
};

export default getImagePath;
