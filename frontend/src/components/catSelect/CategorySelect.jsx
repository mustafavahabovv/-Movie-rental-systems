import React, { useState } from "react";
import Select from "react-select";

const CategorySelect = ({ categories, selectedCategories, setSelectedCategories }) => {
  const handleChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []);
  };

  return (
    <Select
      isMulti
      options={categories?.map((category) => ({ value: category, label: category }))}
      value={selectedCategories}
      onChange={handleChange}
      getOptionLabel={(e) => e.label}
      getOptionValue={(e) => e.value}
      closeMenuOnSelect={false}
      placeholder="Choose categories"
     
    />
  );
};

export default CategorySelect;
