import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Graticule } from "react-simple-maps";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Icon from "@/components/ui/Icon";

const GEO_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

export default function GlobalMap() {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hover, setHover] = useState({ name: null, x: 0, y: 0, visible: false });
  const [filterContinent, setFilterContinent] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projection, setProjection] = useState("geoNaturalEarth1");

  const { data: countryData = {}, isLoading, isError } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,capital,population,region,subregion,area,flags,languages,currencies"
      );
      const dataMap = {};
      response.data.forEach((country) => {
        const commonName = country.name.common;
        const officialName = country.name.official;
        const countryInfo = {
          capital: country.capital?.[0] || "N/A",
          population: country.population?.toLocaleString() || "N/A",
          continent: country.region || "Unknown",
          subregion: country.subregion || "N/A",
          area: country.area ? `${country.area.toLocaleString()} km²` : "N/A",
          flag: country.flags?.svg || country.flags?.png || "",
          languages: country.languages ? Object.values(country.languages).join(", ") : "N/A",
          currencies: country.currencies ? Object.values(country.currencies).map((c) => c.name).join(", ") : "N/A",
        };

        dataMap[commonName] = countryInfo;
        if (officialName !== commonName) dataMap[officialName] = countryInfo;
        if (commonName === "United States") {
          dataMap["United States of America"] = countryInfo;
          dataMap["USA"] = countryInfo;
        }
        if (commonName === "Tanzania") dataMap["United Republic of Tanzania"] = countryInfo;
        if (commonName === "Democratic Republic of the Congo") dataMap["Dem. Rep. Congo"] = countryInfo;
        if (commonName === "Republic of the Congo") dataMap["Congo"] = countryInfo;
        if (commonName === "South Sudan") dataMap["S. Sudan"] = countryInfo;
        if (commonName === "Central African Republic") dataMap["Central African Rep."] = countryInfo;
        if (commonName === "Ivory Coast") {
          dataMap["Côte d'Ivoire"] = countryInfo;
          dataMap["Cote d'Ivoire"] = countryInfo;
        }
      });
      return dataMap;
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });

  const continents = useMemo(() => {
    const set = new Set(Object.values(countryData).map((c) => c.continent));
    return ["all", ...Array.from(set).sort()];
  }, [countryData]);

  // Uniform base color for all countries; highlight only the selected one
  const baseFill = "#16213e";
  const selectedFill = "#10b981";

  // FIX 3: Add escape key listener to deselect country
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && selectedCountry) {
        setSelectedCountry(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedCountry]);

  // FIX 3: Modified to toggle selection when clicking the same country
  const handleCountryClick = useCallback(
    (name) => {
      if (!countryData[name]) return;
      // If clicking the same country, deselect it
      if (selectedCountry?.name === name) {
        setSelectedCountry(null);
      } else {
        setSelectedCountry({ name, data: countryData[name] });
      }
    },
    [countryData, selectedCountry]
  );

  const handleSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (!q) return;
    // Best-effort match against countryData keys (consistent with our dataset)
    const keys = Object.keys(countryData);
    const match = keys.find((k) => k.toLowerCase() === q.toLowerCase()) || keys.find((k) => k.toLowerCase().includes(q.toLowerCase()));
    if (match) {
      setSelectedCountry({ name: match, data: countryData[match] });
    }
  }, [searchQuery, countryData]);

  const zoomIn = () => setPosition((p) => ({ ...p, zoom: Math.min(8, p.zoom * 1.5) }));
  const zoomOut = () => setPosition((p) => ({ ...p, zoom: Math.max(1, p.zoom / 1.5) }));
  const resetZoom = () => setPosition({ coordinates: [0, 20], zoom: 1 });

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
            <Icon name="arrow-left" className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            World Country Explorer
          </h1>
          <p className="text-emerald-300/80 text-lg font-medium">Click countries • Scroll to zoom • Drag to pan • Press ESC to deselect</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 mb-4 border border-white/10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3">
            <p className="text-emerald-300 text-sm font-semibold">Filter by Continent:</p>
            <div className="flex items-center gap-2">
              {/* FIX 2: Added proper styling to make options visible */}
              <select
                value={projection}
                onChange={(e) => setProjection(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-800 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-sm cursor-pointer"
                style={{
                  colorScheme: "dark"
                }}
                aria-label="Projection"
                title="Projection"
              >
                <option value="geoEqualEarth" className="bg-slate-800 text-white">Equal Earth</option>
                <option value="geoNaturalEarth1" className="bg-slate-800 text-white">Natural Earth</option>
                <option value="geoMercator" className="bg-slate-800 text-white">Mercator</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search country..."
                className="px-3 py-2 rounded-lg bg-white/5 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-sm"
              />
              <button onClick={handleSearch} className="px-3 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all">
                Go
              </button>
              <button onClick={resetZoom} className="px-3 py-2 rounded-lg text-xs font-medium bg-white/5 text-orange-200 hover:bg-white/10 border border-white/10 transition-all">
                Reset Zoom
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setFilterContinent(continent)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterContinent === continent
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                }`}
              >
                {continent === "all" ? "🌍 All" : continent}
              </button>
            ))}
          </div>
        </div>

        {/* FIX 1: Adjusted grid to use proper height and map container */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
          <div ref={containerRef} className="xl:col-span-3 bg-white/5 backdrop-blur-lg rounded-xl p-2 sm:p-4 shadow-2xl border border-white/10 flex flex-col relative overflow-hidden">
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
                  <button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Refresh Page
                  </button>
                </div>
              </div>
            )}

            {/* FIX 1: Map container now uses absolute positioning to fill entire parent */}
            {!isLoading && !isError && (
              <div className="absolute inset-0 p-2 sm:p-4">
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                  <button onClick={zoomIn} className="w-9 h-9 rounded-lg bg-white/10 text-white border border-white/10 hover:bg-white/20">+</button>
                  <button onClick={zoomOut} className="w-9 h-9 rounded-lg bg-white/10 text-white border border-white/10 hover:bg-white/20">−</button>
                </div>
                <ComposableMap projection={projection} projectionConfig={{ scale: 160 }} className="w-full h-full">
                  <ZoomableGroup
                    center={position.coordinates}
                    zoom={position.zoom}
                    onMoveEnd={(pos) => setPosition({ coordinates: pos.coordinates, zoom: pos.zoom })}
                  >
                    <Graticule stroke="#ffffff10" />
                    <Geographies geography={GEO_URL}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const name = geo.properties.name;
                          const data = countryData[name];
                          const matchesFilter = filterContinent === "all" || data?.continent === filterContinent;
                          const isSelected = selectedCountry?.name === name;
                          const fill = isSelected ? selectedFill : baseFill;
                          const opacity = matchesFilter ? 1 : 0.3;
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onMouseEnter={(evt) => {
                                const rect = containerRef.current?.getBoundingClientRect();
                                setHover({
                                  name,
                                  x: (evt.clientX - (rect?.left || 0)) + 12,
                                  y: (evt.clientY - (rect?.top || 0)) + 12,
                                  visible: true,
                                });
                              }}
                              onMouseMove={(evt) => {
                                const rect = containerRef.current?.getBoundingClientRect();
                                setHover((h) => ({ ...h, x: (evt.clientX - (rect?.left || 0)) + 12, y: (evt.clientY - (rect?.top || 0)) + 12 }));
                              }}
                              onMouseLeave={() => setHover({ name: null, x: 0, y: 0, visible: false })}
                              onClick={() => handleCountryClick(name)}
                              style={{
                                default: { fill, outline: "none", stroke: "#0c0c1e", strokeWidth: 0.5, opacity },
                                hover: { fill, outline: "none", stroke: "#10b981", strokeWidth: 1.5, opacity },
                                pressed: { fill, outline: "none", stroke: "#fbbf24", strokeWidth: 2, opacity },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>

                {hover.visible && (
                  <div
                    className="absolute z-20 px-3 py-2 rounded-md bg-black/60 border border-white/10 text-white text-xs pointer-events-none"
                    style={{ left: hover.x, top: hover.y }}
                  >
                    <div className="font-semibold">{hover.name}</div>
                    {countryData[hover.name] && (
                      <div className="opacity-90">
                        <div>Capital: {countryData[hover.name].capital}</div>
                        <div>Population: {countryData[hover.name].population}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedCountry && !isLoading && !isError && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/10 animate-slide-up overflow-y-auto">
              <div className="flex items-start gap-4 mb-6">
                {selectedCountry.data.flag && (
                  <img src={selectedCountry.data.flag} alt={`${selectedCountry.name} flag`} className="w-16 h-12 object-cover rounded-lg shadow-lg" />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedCountry.name}</h2>
                  <p className="text-white/60 text-sm">{selectedCountry.data.subregion}</p>
                </div>
                {/* FIX 3: Added close button for better UX */}
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="text-white/60 hover:text-white transition-colors"
                  title="Close (or press ESC)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">Capital City</p>
                  <p className="text-xl font-bold text-white">{selectedCountry.data.capital}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">Population</p>
                  <p className="text-xl font-bold text-emerald-400">{selectedCountry.data.population}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">Continent</p>
                  <p className="text-lg font-bold text-purple-400">{selectedCountry.data.continent}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">Area</p>
                  <p className="text-lg font-bold text-blue-400">{selectedCountry.data.area}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">Languages</p>
                  <p className="text-sm font-semibold text-white">{selectedCountry.data.languages}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">Currency</p>
                  <p className="text-sm font-semibold text-yellow-400">{selectedCountry.data.currencies}</p>
                </div>
              </div>
            </div>
          )}

          {!selectedCountry && !isLoading && !isError && (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-white/80"><Icon name="globe" className="w-12 h-12 inline-block" /></div>
                <p className="text-white/60">Click on a country to see details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}