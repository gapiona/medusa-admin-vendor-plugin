import { KeyboardEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@medusajs/ui";

const VendorSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = (e.target as HTMLInputElement).value;
      if (query) {
        setSearchParams({ q: query });
      } else {
        setSearchParams({});
      }
    }
  };

  return (
    <div className="w-[250px]">
      <Input
        placeholder="Search"
        onKeyDown={handleKeyDown}
        id="search-input"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default VendorSearch;
