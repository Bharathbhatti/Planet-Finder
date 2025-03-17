'use client';

import { useState } from 'react';
import { Input, Select, Card } from 'antd';

const { Option } = Select;

const colors = ['Red', 'Blue', 'Green'] as const;
const shapes = ['Circle','Oval'] as const;
const sizes = ['Small', 'Medium', 'Large'] as const;

interface Planet {
  name: string;
  description: string;
  color: (typeof colors)[number];
  shape: (typeof shapes)[number];
  size: (typeof sizes)[number];
}

const planets: Planet[] = [
  { name: 'Mars', description: 'The Red Planet', color: 'Red', shape: 'Circle', size: 'Medium' },
  { name: 'Earth', description: 'Our Home Planet', color: 'Blue', shape: 'Circle', size: 'Medium' },
  { name: 'Jupiter', description: 'The Gas Giant', color: 'Green', shape: 'Oval', size: 'Large' }
];

interface Filters {
  color: Planet['color'][];
  shape: Planet['shape'][];
  size: Planet['size'][];
}

const PlanetSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({ color: [], shape: [], size: [] });

  const handleFilterChange = (key: keyof Filters, value: string[]) => {
    setFilters(prev => ({ ...prev, [key]: value as Filters[typeof key] }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <Input.Search
        placeholder="Search planets..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onSearch={() => {}}
        onPressEnter={() => {}}
      />
      <div className="grid grid-cols-3 gap-4">
        <Select
          mode="multiple"
          placeholder="Filter by color"
          className="w-full"
          onChange={value => handleFilterChange('color', value)}
        >
          {colors.map(color => (
            <Option key={color} value={color}>{color}</Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          placeholder="Filter by shape"
          className="w-full"
          onChange={value => handleFilterChange('shape', value)}
        >
          {shapes.map(shape => (
            <Option key={shape} value={shape}>{shape}</Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          placeholder="Filter by size"
          className="w-full"
          onChange={value => handleFilterChange('size', value)}
        >
          {sizes.map(size => (
            <Option key={size} value={size}>{size}</Option>
          ))}
        </Select>
      </div>
      <div className="space-y-4">
        {planets
          .filter(planet => planet.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .filter(planet => !filters.color.length || filters.color.includes(planet.color))
          .filter(planet => !filters.shape.length || filters.shape.includes(planet.shape))
          .filter(planet => !filters.size.length || filters.size.includes(planet.size))
          .map(planet => (
            <Card key={planet.name} title={planet.name} className="shadow-md">
              <p>{planet.description}</p>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default PlanetSearch;