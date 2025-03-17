const API_BASE_URL = "https://api-planets.vercel.app";

const fetchPlanets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/planets`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchSizes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sizes`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchShapes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shapes`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchColors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/colors`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getFilteredPlanets = async (filters: any) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/planets?${filters?.q ? `q=${filters.q}` : ""}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export {
  fetchPlanets,
  fetchSizes,
  fetchShapes,
  fetchColors,
  getFilteredPlanets,
};
