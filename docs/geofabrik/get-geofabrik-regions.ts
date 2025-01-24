/**
 * All of these regions should have a `.poly` and a `-latest.osm.pbf` file
 * associated to them.
 */
import * as cheerio from "npm:cheerio"

const baseURL = "https://download.geofabrik.de/"
const regions = new Set()

// antarctica has no children, so not in baseRegions, but add to regions
const baseRegions = [
  "australia-oceania",
  "asia",
  "africa",
  "central-america",
  "europe",
  "north-america",
  "south-america",
]

baseRegions.concat(["antarctica"])
  .forEach(region => regions.add(region))

const responses = baseRegions.map(fetchRegion)

await Promise.all(responses)
const regionsArray = [...regions];
Deno.writeTextFile('regions.txt', regionsArray.sort().join("\n") + "\n")

async function fetchRegion(region: string) {
  console.log('fetching: ', region)
  const url = baseURL + "/" + region
  const resp = await fetch(url)
  const html = await resp.text()
  const { directories, polyFiles } = await parseGeofabrikDirectory(html)
  polyFiles
    .forEach(file => regions.add(region + "/" + file.replace(".poly", "")))

  const childrenResp = directories.map(
    (name) => {
      const childName = name.replace(/^\//, "").replace(/\/$/, "")
      if (!regions.has(childName)) {
        return fetchRegion(region + "/" + childName)
      }
    }
  )
  await Promise.all(childrenResp)
}

async function parseGeofabrikDirectory(html: string) {
  const $ = cheerio.load(html)
  const rows = $("tr")

  const directories: string[] = []
  const polyFiles: string[] = []

  rows.each((_, row) => {
    const href = $(row).find("td a").first().attr("href")

    if (!href) return

    if (href.endsWith("/") && (href !== "/") && !href.endsWith("-updates/")) {
      directories.push(href)
    }
    else if (href.endsWith(".poly")) {
      polyFiles.push(href.replace("/", ""))
    }
  })

  return {
    directories,
    polyFiles
  }
}
