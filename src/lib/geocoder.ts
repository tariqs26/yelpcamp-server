import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding"
import { env } from "./env"
import { NotFoundError } from "./exceptions"

const geocoder = mbxGeocoding({ accessToken: env.MAPBOX_TOKEN })

export const getGeoDataGeometry = async (location: string) => {
  const { body } = await geocoder.forwardGeocode({ query: location }).send()
  if (body.features[0] === undefined) throw new NotFoundError("Location")
  return body.features[0].geometry
}
