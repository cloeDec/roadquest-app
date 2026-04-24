/**
 * Configuration des types de POI
 * @module config/poi-types
 */

export type POIType =
  | "col"
  | "route_panoramique"
  | "point_de_vue"
  | "monument"
  | "village_pittoresque"
  | "restaurant_biker"
  | "station_service"
  | "parking_moto"
  | "atelier_moto";

export interface POITypeConfig {
  icon: string;
  color: string;
  label: string;
  xpBonus?: number;
}

/**
 * Configuration centralisée de tous les types de POI
 */
export const POI_TYPE_CONFIG: Record<POIType, POITypeConfig> = {
  col: {
    icon: "image-filter-hdr",
    color: "#4A90E2",
    label: "Col",
    xpBonus: 100,
  },
  route_panoramique: {
    icon: "road-variant",
    color: "#F5A623",
    label: "Route panoramique",
    xpBonus: 75,
  },
  point_de_vue: {
    icon: "eye",
    color: "#7ED321",
    label: "Point de vue",
    xpBonus: 50,
  },
  monument: {
    icon: "castle",
    color: "#9B59B6",
    label: "Monument",
    xpBonus: 60,
  },
  village_pittoresque: {
    icon: "home-group",
    color: "#E67E22",
    label: "Village pittoresque",
    xpBonus: 40,
  },
  restaurant_biker: {
    icon: "silverware-fork-knife",
    color: "#E74C3C",
    label: "Restaurant biker",
    xpBonus: 30,
  },
  station_service: {
    icon: "gas-station",
    color: "#3498DB",
    label: "Station service",
    xpBonus: 10,
  },
  parking_moto: {
    icon: "parking",
    color: "#1ABC9C",
    label: "Parking moto",
    xpBonus: 10,
  },
  atelier_moto: {
    icon: "wrench",
    color: "#95A5A6",
    label: "Atelier moto",
    xpBonus: 20,
  },
};

/**
 * Récupère la configuration d'un type de POI
 * @param type - Type de POI
 * @returns Configuration du POI ou config par défaut
 */
export const getPOITypeConfig = (type: string): POITypeConfig => {
  return (
    POI_TYPE_CONFIG[type as POIType] || {
      icon: "map-marker",
      color: "#95A5A6",
      label: type,
    }
  );
};

/**
 * Liste des types de POI pour les filtres
 */
export const POI_FILTER_OPTIONS = Object.entries(POI_TYPE_CONFIG).map(
  ([type, config]) => ({
    type: type as POIType,
    ...config,
  })
);
