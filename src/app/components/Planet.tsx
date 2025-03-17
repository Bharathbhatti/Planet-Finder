"use client";

import { useEffect, useState } from "react";
import { Input, Select, Card } from "antd";
import {
  fetchColors,
  fetchPlanets,
  fetchShapes,
  fetchSizes,
  getFilteredPlanets,
} from "../API/getdata";
import { useRouter, useSearchParams } from "next/navigation";

const { Option } = Select;

interface Planet {
  name: string;
  color: string;
  shape: string;
  size: string;
}

interface Color {
  id: string;
  name: string;
}

interface Shape {
  id: string;
  name: string;
}

interface Size {
  id: string;
  name: string;
}
interface Filters {
  q: string;
  color: Color["id"][];
  shape: Shape["id"][];
  size: Size["id"][];
}

const PlanetSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    q: "",
    color: [],
    shape: [],
    size: [],
  });
  const [planets, setPlanets] = useState([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const setLocationByFilterProps = () => {
    const queryParams = new URLSearchParams();
    if (filters.q.length > 0) {
      queryParams.set("q", filters.q);
    }
    if (filters.color.length > 0) {
      queryParams.set("colors", filters.color.join(","));
    }
    if (filters.shape.length > 0) {
      queryParams.set("shapes", filters.shape.join(","));
    }
    if (filters.size.length > 0) {
      queryParams.set("sizes", filters.size.join(","));
    }
    router.replace("?" + queryParams.toString(), {
      scroll: false,
      shallow: true,
    } as any);
  };

  const handleFilterChange = (key: keyof Filters, value: string[] | string) => {
    setFilters((prev) => ({ ...prev, [key]: value as Filters[typeof key] }));
    // console.log(filters);
  };

  useEffect(() => {
    const data = async () => {
      const planets = await fetchPlanets();
      setPlanets(planets);
      const sizes = await fetchSizes();
      setSizes(sizes);
      const shapes = await fetchShapes();
      setShapes(shapes);
      const colors = await fetchColors();
      setColors(colors);
    };
    data();
    console.log(planets);
  }, []);

  useEffect(() => {
    setLocationByFilterProps();
    const updatePlanets = async () => {
      const updatedPlanets = await getFilteredPlanets(filters);
      setPlanets(updatedPlanets);
    };
    updatePlanets();
  }, [filters]);

  useEffect(() => {
    setFilterFromQueryParams();
  }, [searchParams]);

  const setFilterFromQueryParams = () => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const queryColors = queryParams.get("colors");
      const queryShapes = queryParams.get("shapes");
      const querySizes = queryParams.get("sizes");
      const tempFilter = {
        q: searchTerm,
        color: queryColors ? queryColors.split(",") : [],
        shape: queryShapes ? queryShapes.split(",") : [],
        size: querySizes ? querySizes.split(",") : [],
      };
      setFilters(tempFilter);
    }
  };

  const ifPlanetMatches = (planet: Planet) => {
    if (filters.color.length > 0 && !filters.color.includes(planet.color)) {
      return false;
    }
    if (filters.shape.length > 0 && !filters.shape.includes(planet.shape)) {
      return false;
    }
    if (filters.size.length > 0 && !filters.size.includes(planet.size)) {
      return false;
    }
    return true;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <Input.Search
        placeholder="Search planets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={() => {}}
        onPressEnter={(e) => handleFilterChange("q", e.currentTarget.value)}
      />
      <div className="grid grid-cols-3 gap-4">
        <Select
          mode="multiple"
          placeholder="Filter by color"
          className="w-full"
          onChange={(value) => handleFilterChange("color", value)}
          value={filters.color}
        >
          {colors.map((color: Color) => (
            <Option key={color.id} value={color.id}>
              {color.name}
            </Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          placeholder="Filter by shape"
          className="w-full"
          onChange={(value) => handleFilterChange("shape", value)}
          value={filters.shape}
        >
          {shapes.map((shape: Shape) => (
            <Option key={shape.id} value={shape.id}>
              {shape.name}
            </Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          placeholder="Filter by size"
          className="w-full"
          onChange={(value) => handleFilterChange("size", value)}
          value={filters.size}
        >
          {sizes.map((size: Size) => (
            <Option key={size.id} value={size.id}>
              {size.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="space-y-4">
        {planets.map((planet: Planet) =>
          ifPlanetMatches(planet) ? (
            <Card key={planet.name}>
              <h2>{planet.name}</h2>
              <p>
                Color:{" "}
                {colors.find((color) => color.id === planet.color)?.name ?? ""}
              </p>
              <p>
                Shape:{" "}
                {shapes.find((shape) => shape.id === planet.shape)?.name ?? ""}
              </p>
              <p>
                Size:{" "}
                {sizes.find((size) => size.id === planet.size)?.name ?? ""}
              </p>
            </Card>
          ) : null
        )}
      </div>
    </div>
  );
};

export default PlanetSearch;
