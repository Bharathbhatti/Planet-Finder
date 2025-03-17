"use client";

import { useEffect, useState } from "react";
import { Input, Select, Card } from "antd";
import {
  fetchColors,
  fetchPlanets,
  fetchShapes,
  fetchSizes,
} from "../API/getdata";

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
  color: Color["id"];
  shape: Shape["id"];
  size: Size["id"];
}

const PlanetSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    color: "",
    shape: "",
    size: "",
  });
  const [planets, setPlanets] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [shapes, setShapes] = useState([]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value as Filters[typeof key] }));
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

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <Input.Search
        placeholder="Search planets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={() => {}}
        onPressEnter={() => {}}
      />
      <div className="grid grid-cols-3 gap-4">
        <Select
          mode="multiple"
          placeholder="Filter by color"
          className="w-full"
          // onChange={(value) => handleFilterChange("color", value)}
        >
          {colors.map((color: Color) => (
            <Option key={color.id} value={color.name}>
              {color.name}
            </Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          placeholder="Filter by shape"
          className="w-full"
          // onChange={(value) => handleFilterChange("shape", value)}
        >
          {shapes.map((shape: Shape) => (
            <Option key={shape.id} value={shape.name}>
              {shape.name}
            </Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          placeholder="Filter by size"
          className="w-full"
          onChange={(value) => handleFilterChange("size", value)}
        >
          {sizes.map((size: Size) => (
            <Option key={size.id} value={size.name}>
              {size.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="space-y-4">
        {planets.map((planet: Planet) => (
          <Card key={planet.name}>
            <h2>{planet.name}</h2>
            <p>Color: {planet.color}</p>
            <p>Shape: {planet.shape}</p>
            <p>Size: {planet.size}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanetSearch;
