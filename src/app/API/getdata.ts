const API_BASE_URL = "https://api-planets.vercel.app";

const fetchPlanets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/planets`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchSizes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sizes`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchShapes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shapes`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchColors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/colors`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getFilteredPlanets = async (filters: any) => {
  try {
    console.log(filters, window.location.search);
    const searchParams = new URLSearchParams();
    if (filters.q.length > 0) searchParams.set("q", filters.q);
    if (filters.color.length > 0) {
      filters.color.forEach((color: string) => {
        searchParams.append("color", color);
      });
    }
    if (filters.shape.length > 0) {
      filters.shape.forEach((shape: string) => {
        searchParams.append("shape", shape);
      });
    }
    if (filters.size.length > 0) {
      filters.size.forEach((size: string) => {
        searchParams.append("size", size);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/planets?${searchParams.toString()}`
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
