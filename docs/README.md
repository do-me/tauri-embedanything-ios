# Docs

This dir holds some auxillary information and scripts for the project.

## geofabrik

Basically, to fully realize a project like this, we will need scripts to organize the different downloadable regions, and also to find the urls for us to download. This doesn't include region naming/localization, so maybe need to figure that out later.

The files we need are:

1. `[insert-region]-latest.osm.pbf`: map data
2. `[insert-region].poly`: the borders of each region

## tilemaker

We want tilemaker to create tiles that are compatible with our protomaps styles. Basically, you just need these files in the directory when you need to process your pbf:

```
tilemaker monaco-latest.osm.pbf monaco.pmtiles
```
