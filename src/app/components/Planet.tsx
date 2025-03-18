"use client";

import { useEffect, useState } from "react";
import { Input, Select, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { loadInitialData, setFilters, applyFilters } from "../store/planetSlice";
import { useRouter, useSearchParams } from "next/navigation";

const { Option } = Select;

interface Planet {
  name: string;
  color: string;
  shape: string;
  size: string;
}

const PlanetSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSearchText, setCurrentSearchText] = useState("");

  const { planets, colors, shapes, sizes, filters } = useSelector((state: RootState) => state.planets);

  useEffect(() => {
    dispatch(loadInitialData());
  }, [dispatch]);

  useEffect(() => {
    setLocationByFilterProps();
    setCurrentSearchText(filters.q);
    dispatch(applyFilters(filters));
  }, [filters]);

  useEffect(() => {
    setFilterFromQueryParams();
  }, [searchParams]);

  const setLocationByFilterProps = () => {
    const queryParams = new URLSearchParams();
    if (filters.q.length > 0) queryParams.set("q", filters.q);
    if (filters.color.length > 0) queryParams.set("colors", filters.color.join(","));
    if (filters.shape.length > 0) queryParams.set("shapes", filters.shape.join(","));
    if (filters.size.length > 0) queryParams.set("sizes", filters.size.join(","));
    
    router.replace("?" + queryParams.toString(), { scroll: false, shallow: true } as any);
  };

  const setFilterFromQueryParams = () => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      dispatch(
        setFilters({
          q: queryParams.get("q") || "",
          color: queryParams.get("colors")?.split(",") || [],
          shape: queryParams.get("shapes")?.split(",") || [],
          size: queryParams.get("sizes")?.split(",") || [],
        })
      );
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string[] | string) => {
    dispatch(setFilters({ ...filters, [key]: value as any }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchText(e.target.value);
  };

  const ifPlanetMatches = (planet:Planet) => {
    return (
      (!filters.color.length || filters.color.includes(planet.color)) &&
      (!filters.shape.length || filters.shape.includes(planet.shape)) &&
      (!filters.size.length || filters.size.includes(planet.size))
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <Input.Search
        placeholder="Search planets..."
        value={currentSearchText}
        onChange={(e) => handleSearchChange(e)}
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
          {colors.map((color) => (
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
          {shapes.map((shape) => (
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
          {sizes.map((size) => (
            <Option key={size.id} value={size.id}>
              {size.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="space-y-4">
        {planets.filter(ifPlanetMatches).map((planet) => (
          <Card key={planet.name}>
            <h2>{planet.name}</h2>
            <p>Color: {colors.find((c) => c.id === planet.color)?.name}</p>
            <p>Shape: {shapes.find((s) => s.id === planet.shape)?.name}</p>
            <p>Size: {sizes.find((sz) => sz.id === planet.size)?.name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanetSearch;
