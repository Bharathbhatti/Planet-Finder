"use client";

import { useEffect, useState } from "react";
import { Input, Select, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  loadInitialData,
  setFilters,
  applyFilters,
} from "../store/planetSlice";
import { useRouter } from "next/navigation";
import spaceimage from "../../../public/space.jpg";
import Image from "next/image";
import { motion } from "framer-motion";

const { Option } = Select;

interface Planet {
  name: string;
  color: string;
  shape: string;
  size: string;
}

const PlanetSearch = () => {
  const dispatcher = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSearchText, setCurrentSearchText] = useState("");
  const { planets, colors, shapes, sizes, filters } = useSelector(
    (state: RootState) => state.planets
  );

  useEffect(() => {
    const load = async () => {
      setFilterFromQueryParams();
      dispatcher(loadInitialData());
      setIsLoaded(true);
    };
    if (!isLoaded) load();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setLocationByFilterProps();
      setCurrentSearchText(filters.q);
      dispatcher(applyFilters(filters));
    }
  }, [filters]);

  const setLocationByFilterProps = () => {
    const queryParams = new URLSearchParams();
    if (filters.q.length > 0) queryParams.set("q", filters.q);
    if (filters.color.length > 0) {
      filters.color.forEach((color) => {
        queryParams.append("color", color);
      });
    }
    if (filters.shape.length > 0) {
      filters.shape.forEach((shape) => {
        queryParams.append("shape", shape);
      });
    }
    if (filters.size.length > 0) {
      filters.size.forEach((size) => {
        queryParams.append("size", size);
      });
    }
    router.replace("?" + queryParams.toString(), {
      scroll: false,
      shallow: true,
    } as Parameters<typeof router.replace>[1]);
  };

  const setFilterFromQueryParams = () => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      dispatcher(
        setFilters({
          q: queryParams.get("q") || "",
          color: queryParams.getAll("color") || [],
          shape: queryParams.getAll("shape") || [],
          size: queryParams.getAll("size") || [],
        })
      );
    } else {
      console.log("no window");
    }
  };

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string[] | string
  ) => {
    dispatcher(setFilters({ ...filters, [key]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchText(e.target.value);
  };

  const ifPlanetMatches = (planet: Planet) => {
    return (
      (!filters.color.length || filters.color.includes(planet.color)) &&
      (!filters.shape.length || filters.shape.includes(planet.shape)) &&
      (!filters.size.length || filters.size.includes(planet.size))
    );
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <Image
        src={spaceimage}
        alt="space"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-full h-full object-cover z-0 shadow-lg blur-md"
      />
      <div className="relative z-10 p-8 sm:p-8 md:p-6 max-w-4xl mx-auto space-y-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-opacity-50 rounded-lg shadow-lg min-h-screen">
        <motion.h1
          className="text-6xl font-extrabold text-center mb-8 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          🌎 Planet Finder
        </motion.h1>

        {/* Search Bar */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Input.Search
            placeholder="Search planets..."
            value={currentSearchText}
            onChange={(e) => handleSearchChange(e)}
            onPressEnter={(e) => handleFilterChange("q", e.currentTarget.value)}
            onSearch={(value) => handleFilterChange("q", value)}
            className="w-full p-3 text-lg rounded-lg shadow-lg border border-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-none text-black"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div>
            <h3 className="text-lg font-semibold mb-2">Filter by Color</h3>
            <Select
              mode="multiple"
              placeholder="Select color"
              className="w-full rounded-lg shadow-lg"
              onChange={(value) => handleFilterChange("color", value)}
              value={filters.color}
            >
              {colors.map((color) => (
                <Option key={color.id} value={color.id}>
                  {color.name}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Filter by Shape</h3>
            <Select
              mode="multiple"
              placeholder="Select shape"
              className="w-full rounded-lg shadow-lg"
              onChange={(value) => handleFilterChange("shape", value)}
              value={filters.shape}
            >
              {shapes.map((shape) => (
                <Option key={shape.id} value={shape.id}>
                  {shape.name}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Filter by Size</h3>
            <Select
              mode="multiple"
              placeholder="Select size"
              className="w-full rounded-lg shadow-lg"
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
        </motion.div>

        {/* Planet Cards */}
        <motion.div
          className="grid grid-cols-1 gap-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5 }}
        >
          {planets.filter(ifPlanetMatches).map((planet) => (
            <motion.div key={planet.name} whileHover={{ scale: 1.05 }}>
              <Card className="bg-white bg-opacity-10 text-white rounded-xl shadow-lg backdrop-blur-md p-4">
                <h2 className="text-2xl font-bold text-black">{planet.name}</h2>
                <p className="mt-2 text-black sm:text-base">
                  {planet.name} has{" "}
                  {colors.find((c) => c.id === planet.color)?.name} color and{" "}
                  {shapes.find((s) => s.id === planet.shape)?.name} shape!
                </p>
                <p className="text-black sm:text-base">
                  The size of {planet.name} is{" "}
                  {sizes.find((sz) => sz.id === planet.size)?.name}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PlanetSearch;
