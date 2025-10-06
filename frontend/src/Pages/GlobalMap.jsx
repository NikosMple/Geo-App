import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import * as d3 from "d3";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

export default function GlobalMap() {
  const svgRef = useRef();
  const gRef = useRef(null);
  const pathsRef = useRef(null);
  const selectedPathRef = useRef(null);
  const zoomBehaviorRef = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filterContinent, setFilterContinent] = useState("all");

  const {
    data: countryData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,capital,population,region,subregion,area,flags,languages,currencies"
      );
      const dataMap = {};
      response.data.forEach((country) => {
        const commonName = country.name.common;
        const officialName = country.name.official;

        // Store data with both common and official names
        const countryInfo = {
          capital: country.capital?.[0] || "N/A",
          population: country.population?.toLocaleString() || "N/A",
          continent: country.region || "Unknown",
          subregion: country.subregion || "N/A",
          area: country.area ? `${country.area.toLocaleString()} km²` : "N/A",
          flag: country.flags?.svg || country.flags?.png || "",
          languages: country.languages
            ? Object.values(country.languages).join(", ")
            : "N/A",
          currencies: country.currencies
            ? Object.values(country.currencies)
                .map((c) => c.name)
                .join(", ")
            : "N/A",
        };

        dataMap[commonName] = countryInfo;
        // Also map official name for countries like "United States of America"
        if (officialName !== commonName) {
          dataMap[officialName] = countryInfo;
        }

        // Add specific mappings for known mismatches
        if (commonName === "United States") {
          dataMap["United States of America"] = countryInfo;
          dataMap["USA"] = countryInfo;
        }
        if (commonName === "Tanzania") {
          dataMap["United Republic of Tanzania"] = countryInfo;
        }
        if (commonName === "Democratic Republic of the Congo") {
          dataMap["Dem. Rep. Congo"] = countryInfo;
        }
        if (commonName === "Republic of the Congo") {
          dataMap["Congo"] = countryInfo;
        }
        if (commonName === "South Sudan") {
          dataMap["S. Sudan"] = countryInfo;
        }
        if (commonName === "Central African Republic") {
          dataMap["Central African Rep."] = countryInfo;
        }
        if (commonName === "Ivory Coast") {
          dataMap["Côte d'Ivoire"] = countryInfo;
        }
      });
      return dataMap;
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });

  const colorScale = useMemo(
    () =>
      d3
        .scaleSequential()
        .domain([0, 200])
        .interpolator(d3.interpolateRgb("#10b981", "#4f46e5")),
    []
  );

  const handleCountryClick = useCallback(
    (countryName, countryElement) => {
      if (countryData[countryName]) {
        if (
          selectedPathRef.current &&
          selectedPathRef.current !== countryElement
        ) {
          d3.select(selectedPathRef.current)
            .classed("selected", false)
            .attr("stroke", "#0c0c1e")
            .attr("stroke-width", 0.5);
        }

        d3.select(countryElement).classed("selected", true);
        selectedPathRef.current = countryElement;

        setSelectedCountry({
          name: countryName,
          data: countryData[countryName],
        });
      }
    },
    [countryData]
  );

  const resetZoom = useCallback(() => {
    if (zoomBehaviorRef.current && svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(countryData).length === 0) return;

    const width = 960;
    const height = 600;

    if (!pathsRef.current) {
      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

      const g = svg.append("g");
      gRef.current = g;

      const projection = d3
        .geoNaturalEarth1()
        .scale(width / 5.5)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath().projection(projection);

      const zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      svg.call(zoom);
      zoomBehaviorRef.current = zoom;

      fetch(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
      )
        .then((response) => response.json())
        .then((geojson) => {
          g.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "country-path")
            .attr("stroke", "#0c0c1e")
            .attr("stroke-width", 0.5)
            .style("cursor", (d) => {
              const countryName = d.properties.name;
              return countryData[countryName] ? "pointer" : "default";
            })
            .on("mouseover", function (event, d) {
              const countryName = d.properties.name;
              if (
                countryData[countryName] &&
                !d3.select(this).classed("selected")
              ) {
                d3.select(this)
                  .attr("stroke", "#10b981")
                  .attr("stroke-width", 2);
              }
            })
            .on("mouseout", function (event, d) {
              if (!d3.select(this).classed("selected")) {
                d3.select(this)
                  .attr("stroke", "#0c0c1e")
                  .attr("stroke-width", 0.5);
              }
            })
            .on("click", function (event, d) {
              const countryName = d.properties.name;
              handleCountryClick(countryName, this);
            })
            .append("title")
            .text((d) => {
              const name = d.properties.name;
              const data = countryData[name];
              return data
                ? `${name}\nCapital: ${data.capital}\nPopulation: ${data.population}\nContinent: ${data.continent}`
                : name;
            });

          pathsRef.current = g.selectAll("path");
          updateMapColors();
        })
        .catch((err) => console.error("Failed to load map:", err));
    }
  }, [countryData, handleCountryClick]);

  const updateMapColors = useCallback(() => {
    if (!pathsRef.current) return;

    pathsRef.current
      .attr("fill", function (d, i) {
        const countryName = d.properties.name;
        const hasData = countryData[countryName];

        if (
          filterContinent !== "all" &&
          hasData?.continent !== filterContinent
        ) {
          return "#1a1a2e";
        }

        return hasData ? colorScale(i) : "#16213e";
      })
      .attr("opacity", (d) => {
        const countryName = d.properties.name;
        const hasData = countryData[countryName];
        if (
          filterContinent !== "all" &&
          hasData?.continent !== filterContinent
        ) {
          return 0.3;
        }
        return hasData ? 1 : 0.5;
      });
  }, [countryData, filterContinent, colorScale]);

  useEffect(() => {
    updateMapColors();
  }, [updateMapColors]);

  const stats = useMemo(() => {
    const countries = Object.values(countryData);
    if (countries.length === 0)
      return { totalCountries: 0, continents: 0, mostCountries: null };

    const continentCounts = {};
    countries.forEach((c) => {
      continentCounts[c.continent] = (continentCounts[c.continent] || 0) + 1;
    });

    return {
      totalCountries: countries.length,
      continents: Object.keys(continentCounts).length,
      mostCountries: Object.entries(continentCounts).sort(
        (a, b) => b[1] - a[1]
      )[0],
    };
  }, [countryData]);

  const continents = useMemo(() => {
    const continentSet = new Set(
      Object.values(countryData).map((c) => c.continent)
    );
    return ["all", ...Array.from(continentSet).sort()];
  }, [countryData]);

  return (
    <div className="h-screen overflow-hidden app-background mounted p-4 md:p-8">
      <div className="bg-decoration">
        <div className="floating-globe"></div>
        <div className="grid-pattern"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 h-full flex flex-col">
        <div className="mb-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 text-white bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3.5 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20 no-underline"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">
              ←
            </span>
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            World Country Explorer
          </h1>
          <p className="text-emerald-300/80 text-lg font-medium">
            Click countries • Scroll to zoom • Drag to pan
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 mb-4 border border-white/10">
          <div className="flex justify-between items-center mb-3">
            <p className="text-emerald-300 text-sm font-semibold">
              Filter by Continent:
            </p>
            <button
              onClick={resetZoom}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 text-orange-200 hover:bg-white/10 border border-white/10 transition-all"
            >
              Reset Zoom
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setFilterContinent(continent)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterContinent === continent
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                }`}
              >
                {continent === "all" ? "All Continents" : continent}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
          <div className="xl:col-span-3 bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/10 flex flex-col min-h-0">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
                <div className="text-white text-xl">Loading world map...</div>
              </div>
            )}
            {isError && (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="text-red-400 text-center max-w-md">
                  <p className="text-xl font-bold mb-2">Unable to load map</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            )}
            <svg
              ref={svgRef}
              className="w-full h-auto"
              style={{ display: isLoading || isError ? "none" : "block" }}
            >
              <style>{`
                .country-path.selected {
                  stroke: #fbbf24 !important;
                  stroke-width: 2px !important;
                }
              `}</style>
            </svg>
          </div>

          {selectedCountry && !isLoading && !isError && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/10 animate-slide-up overflow-y-auto">
              <div className="flex items-start gap-4 mb-6">
                {selectedCountry.data.flag && (
                  <img
                    src={selectedCountry.data.flag}
                    alt={`${selectedCountry.name} flag`}
                    className="w-16 h-12 object-cover rounded-lg shadow-lg"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedCountry.name}
                  </h2>
                  <p className="text-white/60 text-sm">
                    {selectedCountry.data.subregion}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">
                    Capital City
                  </p>
                  <p className="text-xl font-bold text-white">
                    {selectedCountry.data.capital}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">
                    Population
                  </p>
                  <p className="text-xl font-bold text-emerald-400">
                    {selectedCountry.data.population}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">
                    Continent
                  </p>
                  <p className="text-lg font-bold text-purple-400">
                    {selectedCountry.data.continent}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">Area</p>
                  <p className="text-lg font-bold text-blue-400">
                    {selectedCountry.data.area}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">
                    Languages
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {selectedCountry.data.languages}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">
                    Currency
                  </p>
                  <p className="text-sm font-semibold text-yellow-400">
                    {selectedCountry.data.currencies}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!selectedCountry && !isLoading && !isError && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🌍</div>
                <p className="text-white/60">
                  Click on a country to see details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
