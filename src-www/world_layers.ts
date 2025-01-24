export default [
  {
    "id": "boundary-lines",
    "type": "line",
    "source": "world",
    "source-layer": "ne_10m_admin_0_boundary_lines_land",
    "paint": {
      "line-color": "#888",
      "line-width": 1
    }
  },
  {
    "id": "countries",
    "type": "fill",
    "source": "world",
    "source-layer": "ne_10m_admin_0_countries",
    "paint": {
      "fill-color": "#ccc",
      "fill-outline-color": "#888"
    }
  },
  {
    "id": "states",
    "type": "fill",
    "source": "world",
    "source-layer": "ne_10m_admin_1_states_provinces",
    "paint": {
      "fill-color": "#ddd",
      "fill-outline-color": "#888"
    },
    "maxzoom": 5,
    "minzoom": 4
  }
]
