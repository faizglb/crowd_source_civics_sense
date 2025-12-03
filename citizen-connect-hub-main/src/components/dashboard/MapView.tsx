import { useEffect, useState } from "react";
import { Complaint, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS } from "@/lib/types";

interface MapViewProps {
  complaints: Complaint[];
}

export default function MapView({ complaints }: MapViewProps) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: any;
    TileLayer: any;
    Marker: any;
    Popup: any;
  } | null>(null);
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    // Dynamically import react-leaflet and leaflet to avoid SSR/bundling issues
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([rl, L]) => {
      // Fix default marker icons
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
      
      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
        Popup: rl.Popup,
      });
      setLeaflet(L.default);
    });
  }, []);

  if (!MapComponents || !leaflet) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;
  
  const complaintsWithLocation = complaints.filter(c => c.location_lat && c.location_lng);
  const defaultCenter: [number, number] = complaintsWithLocation.length > 0
    ? [Number(complaintsWithLocation[0].location_lat), Number(complaintsWithLocation[0].location_lng)]
    : [28.6139, 77.2090];

  // Create custom icons
  const createIcon = (color: string) => new leaflet.Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const statusIcons: Record<string, any> = {
    pending: createIcon("#ef4444"),
    assigned: createIcon("#f59e0b"),
    in_progress: createIcon("#eab308"),
    resolved: createIcon("#22c55e"),
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {complaintsWithLocation.map((complaint) => (
        <Marker
          key={complaint.id}
          position={[Number(complaint.location_lat), Number(complaint.location_lng)]}
          icon={statusIcons[complaint.status] || statusIcons.pending}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded">
                  {STATUS_LABELS[complaint.status]}
                </span>
                <span className="px-2 py-0.5 border text-xs rounded">
                  {PRIORITY_LABELS[complaint.priority]}
                </span>
              </div>
              <p className="font-semibold text-sm mb-1">
                {CATEGORY_LABELS[complaint.category]}
              </p>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {complaint.description}
              </p>
              <p className="text-xs text-gray-500">
                ID: {complaint.complaint_id}
              </p>
              {complaint.address && (
                <p className="text-xs text-gray-500 mt-1">
                  📍 {complaint.address}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
